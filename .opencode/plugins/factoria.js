/**
 * Factoria plugin for OpenCode.ai
 *
 * Injects Factoria bootstrap context via system prompt transform.
 * Auto-registers skills directory via config hook (no symlinks needed).
 * Auto-detects the active factory from the project root.
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple frontmatter extraction
const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }

  return { frontmatter, content: body };
};

const normalizePath = (p, homeDir) => {
  if (!p || typeof p !== 'string') return null;
  let normalized = p.trim();
  if (!normalized) return null;
  if (normalized.startsWith('~/')) {
    normalized = path.join(homeDir, normalized.slice(2));
  } else if (normalized === '~') {
    normalized = homeDir;
  }
  return path.resolve(normalized);
};

// Factory auto-detection from project directory
const detectFactory = (dir) => {
  try {
    const files = fs.readdirSync(dir);

    // .NET: .sln / .csproj / Program.cs
    const hasNet = files.some(f => f.endsWith('.sln') || f.endsWith('.csproj')) ||
                   fs.existsSync(path.join(dir, 'Program.cs'));

    // Angular: angular.json or @angular/core in package.json
    const hasAngularJson = fs.existsSync(path.join(dir, 'angular.json'));
    let hasAngularDep = false, hasNestDep = false, hasNextDep = false;
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        hasAngularDep = '@angular/core' in deps;
        hasNestDep = '@nestjs/core' in deps;
        hasNextDep = 'next' in deps;
      } catch { /* ignore */ }
    }
    const hasAngular = hasAngularJson || hasAngularDep;

    // Next.js: next.config.* or next dep
    const hasNextConfig = files.some(f => f.startsWith('next.config.'));

    // Python: pyproject.toml / requirements.txt / .python-version
    const hasPython = fs.existsSync(path.join(dir, 'pyproject.toml')) ||
                      fs.existsSync(path.join(dir, 'requirements.txt')) ||
                      fs.existsSync(path.join(dir, '.python-version')) ||
                      fs.existsSync(path.join(dir, 'main.py'));

    if (hasNet && hasAngular) return 'both';
    if (hasNet) return 'net';
    if (hasAngular) return 'ang';
    if (hasNestDep) return 'nest';
    if (hasNextConfig || hasNextDep) return 'next';
    if (hasPython) return 'python';
    return 'unknown';
  } catch {
    return 'unknown';
  }
};

// Module-level cache for bootstrap content.
let _bootstrapCache = undefined;

export const FactoriaPlugin = async ({ client, directory }) => {
  const homeDir = os.homedir();
  const factoriaSkillsDir = path.resolve(__dirname, '../../skills');
  const envConfigDir = normalizePath(process.env.OPENCODE_CONFIG_DIR, homeDir);
  const configDir = envConfigDir || path.join(homeDir, '.config/opencode');
  const projectDir = directory || process.cwd();

  const getBootstrapContent = () => {
    if (_bootstrapCache !== undefined) return _bootstrapCache;

    const skillPath = path.join(factoriaSkillsDir, 'using-factoria', 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      _bootstrapCache = null;
      return null;
    }

    const fullContent = fs.readFileSync(skillPath, 'utf8');
    const { content } = extractAndStripFrontmatter(fullContent);

    const factory = detectFactory(projectDir);
    let factoryHeader;
    if (factory === 'unknown') {
      factoryHeader = 'Factory not auto-detected. Invoke skill `factoria:selecting-factory` to identify the active factory.';
    } else if (factory === 'both') {
      factoryHeader = 'Detected multi-factory project (.NET + Angular). Invoke skill `factoria:selecting-factory` to set the active factory for this session.';
    } else {
      factoryHeader = `Detected factory: ${factory}. References at: references/${factory}/. Load full context with skill 'factoria:loading-factory-context'.`;
    }

    const toolMapping = `**Tool Mapping for OpenCode:**
When skills reference Claude Code tools:
- \`TodoWrite\` → \`todowrite\`
- \`Task\` with subagents → OpenCode's \`@mention\` syntax
- \`Skill\` tool → OpenCode's native \`skill\` tool
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → Your native tools`;

    _bootstrapCache = `<EXTREMELY_IMPORTANT>
You have Factoria.

${factoryHeader}

**IMPORTANT: The using-factoria skill content is included below. It is ALREADY LOADED — do NOT use the skill tool to load "using-factoria" again.**

${content}

${toolMapping}
</EXTREMELY_IMPORTANT>`;

    return _bootstrapCache;
  };

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(factoriaSkillsDir)) {
        config.skills.paths.push(factoriaSkillsDir);
      }
    },

    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (!bootstrap || !output.messages.length) return;
      const firstUser = output.messages.find(m => m.info.role === 'user');
      if (!firstUser || !firstUser.parts.length) return;

      // Guard: skip if already injected
      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('EXTREMELY_IMPORTANT'))) return;

      const ref = firstUser.parts[0];
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap });
    }
  };
};
