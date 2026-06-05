# /factoria-init [factory]

Initialize the current project with the minimum Factoria scaffolding.

## What this command does

1. Detect the active factory — use the provided `[factory]` argument, auto-detect from cwd signals, or invoke `factoria:selecting-factory` if unknown. Supported factory keys live in `references/` — list that directory to see all available factories; do not hardcode the list.
2. Write `CLAUDE.md` (pointer to the plugin — does NOT include all policies inline).
3. Append Factoria entries to `.gitignore`.
4. Create the `.cloud/` skeleton — **create directories before files**, in this exact order:
   a. Create directory `.cloud/planning/` — then write `.cloud/planning/.gitkeep` (empty)
   b. Create directory `.cloud/architecture/` — then create directory `.cloud/architecture/decisions/` — then write `.cloud/architecture/decisions/.gitkeep` (empty)
   c. Write `.cloud/architecture/current.md` (blank architecture diagram placeholder)
5. Create the `.cloud/qa/` QA workspace (see the next section).

Do NOT attempt to write a file inside a directory before the directory exists.

## QA workspace scaffolding

The QA skills (`qa-strategy`, `qa-plan`, `qa-scenarios`, `qa-test-cases`, `qa-automation-plan`, `qa-run-suite`, `qa-report`, `qa-release-gate`, `perf-test`, `sast-scan`, `dast-scan`) treat `.cloud/qa/` as the QA source of truth and `.qa-reports/` as the raw-evidence sink. This step creates that workspace so those skills never have to bootstrap it from scratch.

**Always — for every factory.** Create the directory skeleton first, then seed the files. **Create each directory before writing files into it.**

a. Create directories (in this order):
   - `.cloud/qa/context/` — then write `.cloud/qa/context/.gitkeep` (empty)
   - `.cloud/qa/strategy/` — then write `.cloud/qa/strategy/.gitkeep` (empty)
   - `.cloud/qa/plans/` — then write `.cloud/qa/plans/.gitkeep` (empty)
   - `.cloud/qa/scenarios/` — then write `.cloud/qa/scenarios/.gitkeep` (empty)
   - `.cloud/qa/cases/` — then write `.cloud/qa/cases/.gitkeep` (empty)
   - `.cloud/qa/automation/` — then write `.cloud/qa/automation/.gitkeep` (empty)
   - `.cloud/qa/reports/` — then write `.cloud/qa/reports/.gitkeep` (empty)
   - `.cloud/qa/templates/` — then write `.cloud/qa/templates/.gitkeep` (empty)
   - `.qa-reports/` — then write `.qa-reports/.gitkeep` (empty)

b. Seed files (write after the directories above exist):

   - `.cloud/qa/context/work-item-context.md`:
     ```markdown
     # Azure DevOps Work Item Context

     Work item id: TBD

     ## Functional Summary
     - Pending capture from Azure DevOps

     ## Acceptance Criteria
     - Pending capture from Azure DevOps

     ## QA Notes
     - Pending analysis
     ```

   - `.cloud/qa/README.md`:
     ```markdown
     # Factoria QA Workspace

     This folder is the QA source of truth for the project.
     ```

   - `.cloud/qa/strategy/qa-strategy.md`:
     ```markdown
     # QA Strategy

     Status: Draft
     ```

   - `.cloud/qa/plans/test-plan.md`:
     ```markdown
     # Test Plan

     Status: Draft
     ```

   - `.cloud/qa/automation/automation-plan.md`:
     ```markdown
     # QA Automation Plan

     Status: Draft
     ```

   - `.cloud/qa/automation/traceability-matrix.md`:
     ```markdown
     # Traceability Matrix

     | Requirement | Scenario | Test Case | Automated Script | Last Execution | Result | Evidence |
     |-------------|----------|-----------|------------------|----------------|--------|----------|
     ```

   - `.cloud/qa/templates/qa-strategy-template.md` → `# QA Strategy Template`
   - `.cloud/qa/templates/test-plan-template.md` → `# Test Plan Template`
   - `.cloud/qa/templates/test-case-template.md` → `# Test Case Template`
   - `.cloud/qa/templates/report-template.md` → `# QA Report Template`
   - `.cloud/qa/templates/traceability-matrix-template.md` → `# Traceability Matrix Template`

## QA tooling tree (conditional — perf/security factories only)

Some factories run performance and security suites; others do not. Create the `tooling/` tree **only** for factories that have a perf/security QA layer:

- **Backend REST/gRPC factories — `net`, `nest`, `pyt`:** create the backend tooling tree (k6 REST + gRPC smoke scripts, perf/SAST/DAST runners, report writers, Semgrep rules). Only `net` additionally gets `tooling/grpc/service.proto` (the placeholder proto its gRPC script loads).
- **Browser factory — `ang`:** create the browser tooling tree (a single k6 browser-oriented `smoke.js` instead of REST/gRPC scripts, plus the same runners/writers/rules).
- **Every other factory (`pytml`, `dataeng`, `kot`, `swf`, `wps`):** SKIP the entire `tooling/` tree. They have no perf/security QA layer, so only the seed workspace above is created.

When creating the tooling tree, **create directories before files**: `.cloud/qa/tooling/`, `.cloud/qa/tooling/k6/`, `.cloud/qa/tooling/scripts/`, `.cloud/qa/tooling/semgrep/`, and (net only) `.cloud/qa/tooling/grpc/`.

### Shared tooling files (all perf/security factories: net, nest, pyt, ang)

- `.cloud/qa/tooling/README.md` — tooling guide. Use the backend variant for `net`/`nest`/`pyt` and the browser variant for `ang`:

  Backend variant (net/nest/pyt — adjust the factory name in the title/intro):
  ```markdown
  # Factoria QA Tooling — Backend

  This folder contains the starter tooling for specialized QA suites in backend (REST/gRPC) factories.

  ## Default Stack

  - Functional and regression: project-native tests plus Factoria QA artifacts
  - Performance: `k6` as primary backend tool, Docker fallback
  - SAST: `Semgrep` via Docker
  - DAST: `OWASP ZAP` baseline via Docker

  ## Performance Workflow

  1. Prefer the `k6` MCP server to generate, validate, and execute the script.
  2. Use it explicitly for `REST`, `gRPC`, or mixed backend flows.
  3. Persist curated QA outputs in `.cloud/qa/reports/`.
  4. Persist raw logs, exports, and k6 summaries in `.qa-reports/`.
  5. If the MCP server is unavailable, use the fallback shell runner in `scripts/run-perf.sh`.
  ```

  Browser variant (ang):
  ```markdown
  # Factoria QA Tooling — Angular

  This folder contains the starter tooling for specialized QA suites in projects that use Factoria-Ang.

  ## Default Stack

  - Functional and visual QA: prefer the `playwright` MCP server, then Angular tests and Playwright CLI fallback
  - Performance: `k6` as browser-first complement, Docker fallback
  - SAST: `Semgrep` via Docker
  - DAST: `OWASP ZAP` baseline via Docker

  ## Browser QA Workflow

  1. Prefer the `playwright` MCP server for screenshots, assertions, auth/session persistence, and interactive debugging.
  2. Use raw Playwright CLI only when the MCP server is unavailable or a deterministic shell artifact is explicitly needed.

  ## Performance Workflow

  1. Prefer the `k6` MCP server to generate, validate, and execute the script.
  2. Prefer browser-oriented coverage for critical user journeys.
  3. Treat protocol-only checks as partial evidence for frontend performance.
  4. Persist curated QA outputs in `.cloud/qa/reports/`.
  5. Persist raw logs, exports, and k6 summaries in `.qa-reports/`.
  6. If the MCP server is unavailable, use the fallback shell runner in `scripts/run-perf.sh`.
  ```

- `.cloud/qa/tooling/scripts/run-perf.sh` — perf fallback runner. For `ang` set `PERF_PROTOCOL` default to `browser`, `PERF_SCRIPT` default to `.cloud/qa/tooling/k6/smoke.js`, suite default `frontend-perf`, and DROP the rest/grpc protocol validation block + the usage hint suffix. For `net`/`nest`/`pyt` set `PERF_PROTOCOL` default `rest`, `PERF_SCRIPT` default `.cloud/qa/tooling/k6/$PERF_PROTOCOL-smoke.js`, suite default `perf-smoke`, and KEEP the protocol validation:
  ```bash
  #!/usr/bin/env bash
  set -eu

  TARGET_URL="${1:-}"
  SUITE_NAME="${2:-perf-smoke}"
  PERF_PROTOCOL="${3:-${PERF_PROTOCOL:-rest}}"
  ENV_LABEL="${ENVIRONMENT:-qa}"
  PERF_SCRIPT="${PERF_SCRIPT:-.cloud/qa/tooling/k6/$PERF_PROTOCOL-smoke.js}"

  if [ -z "$TARGET_URL" ]; then
    echo "Usage: bash .cloud/qa/tooling/scripts/run-perf.sh <target-url> [suite-name] [rest|grpc]" >&2
    exit 1
  fi

  if [ "$PERF_PROTOCOL" != "rest" ] && [ "$PERF_PROTOCOL" != "grpc" ]; then
    echo "Invalid protocol '$PERF_PROTOCOL'. Use 'rest' or 'grpc'." >&2
    exit 1
  fi

  STAMP="$(date +%Y-%m-%d-%H%M%S)"
  OUT_DIR=".qa-reports/${STAMP}-${SUITE_NAME}/performance"
  CURATED_DIR=".cloud/qa/reports/$(date +%Y-%m-%d)/performance"
  mkdir -p "$OUT_DIR" "$CURATED_DIR"

  STATUS="PASS"
  EXIT_CODE=0

  if ! docker run --rm -i \
    -v "$PWD":/work \
    -w /work \
    -e TARGET_URL="$TARGET_URL" \
    -e PERF_PATHS="${PERF_PATHS:-/}" \
    -e GRPC_ADDR="${GRPC_ADDR:-$TARGET_URL}" \
    -e GRPC_METHOD="${GRPC_METHOD:-package.Service/Method}" \
    -e GRPC_REQUEST_JSON="${GRPC_REQUEST_JSON:-{}}" \
    -e GRPC_PLAINTEXT="${GRPC_PLAINTEXT:-false}" \
    -e GRPC_REFLECT="${GRPC_REFLECT:-false}" \
    -e GRPC_PROTOSET="${GRPC_PROTOSET:-}" \
    -e GRPC_PROTO_PATHS="${GRPC_PROTO_PATHS:-.cloud/qa/tooling/grpc}" \
    -e GRPC_PROTO_FILES="${GRPC_PROTO_FILES:-service.proto}" \
    -e REPORT_DIR="$OUT_DIR" \
    grafana/k6 run "$PERF_SCRIPT" \
    >"$OUT_DIR/k6.stdout.log" 2>"$OUT_DIR/k6.stderr.log"; then
    EXIT_CODE=$?
    STATUS="FAIL"
  fi

  node .cloud/qa/tooling/scripts/write-report.mjs \
    --suite "performance" \
    --tool "k6" \
    --status "$STATUS" \
    --target "$TARGET_URL" \
    --environment "$ENV_LABEL" \
    --scope "$SUITE_NAME" \
    --exit-code "$EXIT_CODE" \
    --report-dir "$CURATED_DIR" \
    --evidence "$OUT_DIR/k6-summary.json,$OUT_DIR/k6.stdout.log,$OUT_DIR/k6.stderr.log" \
    --notes "Performance suite executed with Dockerized k6 fallback using protocol '$PERF_PROTOCOL'. Prefer MCP server k6 when available."

  echo "Performance report written to $CURATED_DIR/report.md"
  ```

- `.cloud/qa/tooling/scripts/run-sast.sh` — SAST fallback runner (suite default `backend-sast` for net/nest/pyt, `frontend-sast` for ang):
  ```bash
  #!/usr/bin/env bash
  set -eu

  SUITE_NAME="${1:-backend-sast}"
  ENV_LABEL="${ENVIRONMENT:-qa}"
  RULES_PATH="${SAST_RULES_PATH:-.cloud/qa/tooling/semgrep/rules.yml}"

  STAMP="$(date +%Y-%m-%d-%H%M%S)"
  OUT_DIR=".qa-reports/${STAMP}-${SUITE_NAME}/sast"
  CURATED_DIR=".cloud/qa/reports/$(date +%Y-%m-%d)/sast"
  mkdir -p "$OUT_DIR" "$CURATED_DIR"

  STATUS="PASS"
  EXIT_CODE=0

  if ! docker run --rm \
    -v "$PWD":/work \
    -w /work \
    returntocorp/semgrep semgrep \
    --config "$RULES_PATH" \
    --json \
    --output "$OUT_DIR/semgrep.json" \
    . >"$OUT_DIR/semgrep.stdout.log" 2>"$OUT_DIR/semgrep.stderr.log"; then
    EXIT_CODE=$?
    STATUS="FAIL"
  fi

  node .cloud/qa/tooling/scripts/write-report.mjs \
    --suite "sast" \
    --tool "semgrep" \
    --status "$STATUS" \
    --environment "$ENV_LABEL" \
    --scope "$SUITE_NAME" \
    --exit-code "$EXIT_CODE" \
    --report-dir "$CURATED_DIR" \
    --evidence "$OUT_DIR/semgrep.json,$OUT_DIR/semgrep.stdout.log,$OUT_DIR/semgrep.stderr.log" \
    --notes "SAST suite executed with Dockerized Semgrep."

  echo "SAST report written to $CURATED_DIR/report.md"
  ```

- `.cloud/qa/tooling/scripts/run-dast.sh` — DAST fallback runner (suite default `api-dast` for net/nest/pyt, `web-dast` for ang):
  ```bash
  #!/usr/bin/env bash
  set -eu

  TARGET_URL="${1:-}"
  SUITE_NAME="${2:-api-dast}"
  ENV_LABEL="${ENVIRONMENT:-qa}"

  if [ -z "$TARGET_URL" ]; then
    echo "Usage: bash .cloud/qa/tooling/scripts/run-dast.sh <target-url> [suite-name]" >&2
    exit 1
  fi

  STAMP="$(date +%Y-%m-%d-%H%M%S)"
  OUT_DIR=".qa-reports/${STAMP}-${SUITE_NAME}/dast"
  CURATED_DIR=".cloud/qa/reports/$(date +%Y-%m-%d)/dast"
  mkdir -p "$OUT_DIR" "$CURATED_DIR"

  STATUS="PASS"
  RECOMMENDATION="GO"
  EXIT_CODE=0

  docker run --rm -t \
    -v "$PWD":/zap/wrk \
    ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
    -t "$TARGET_URL" \
    -J "$OUT_DIR/zap.json" \
    -r "$OUT_DIR/zap.html" \
    -w "$OUT_DIR/zap.md" \
    -x "$OUT_DIR/zap.xml" \
    >"$OUT_DIR/zap.stdout.log" 2>"$OUT_DIR/zap.stderr.log" || EXIT_CODE=$?

  if [ "$EXIT_CODE" -eq 1 ]; then
    STATUS="WARN"
    RECOMMENDATION="GO WITH RISKS"
  elif [ "$EXIT_CODE" -ge 2 ]; then
    STATUS="FAIL"
    RECOMMENDATION="NO-GO"
  fi

  node .cloud/qa/tooling/scripts/write-report.mjs \
    --suite "dast" \
    --tool "owasp-zap-baseline" \
    --status "$STATUS" \
    --recommendation "$RECOMMENDATION" \
    --target "$TARGET_URL" \
    --environment "$ENV_LABEL" \
    --scope "$SUITE_NAME" \
    --exit-code "$EXIT_CODE" \
    --report-dir "$CURATED_DIR" \
    --evidence "$OUT_DIR/zap.json,$OUT_DIR/zap.html,$OUT_DIR/zap.md,$OUT_DIR/zap.xml,$OUT_DIR/zap.stdout.log,$OUT_DIR/zap.stderr.log" \
    --notes "DAST suite executed with Dockerized OWASP ZAP baseline scan. Run only against approved non-production environments."

  echo "DAST report written to $CURATED_DIR/report.md"
  ```

- `.cloud/qa/tooling/scripts/write-report.mjs` — per-suite report writer:
  ```javascript
  import { mkdirSync, writeFileSync } from "node:fs";
  import { join } from "node:path";

  function parseArgs(argv) {
    const args = {};
    for (let index = 0; index < argv.length; index += 1) {
      const token = argv[index];
      if (!token.startsWith("--")) continue;
      const key = token.slice(2);
      const value = argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[++index] : "true";
      args[key] = value;
    }
    return args;
  }

  function defaultRecommendation(status) {
    if (status === "PASS") return "GO";
    if (status === "WARN") return "GO WITH RISKS";
    return "NO-GO";
  }

  const args = parseArgs(process.argv.slice(2));
  const reportDir = args["report-dir"];

  if (!reportDir) {
    console.error("Missing required argument: --report-dir");
    process.exit(1);
  }

  mkdirSync(reportDir, { recursive: true });

  const evidence = (args.evidence || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const status = args.status || "PASS";
  const summary = {
    suite: args.suite || "qa-suite",
    tool: args.tool || "manual",
    status,
    recommendation: args.recommendation || defaultRecommendation(status),
    target: args.target || "",
    environment: args.environment || "qa",
    scope: args.scope || "",
    exitCode: Number(args["exit-code"] || 0),
    evidence,
    notes: args.notes || "",
    generatedAt: new Date().toISOString(),
  };

  writeFileSync(join(reportDir, "summary.json"), JSON.stringify(summary, null, 2));

  const markdown = [
    "# QA Report — " + summary.suite,
    "",
    "- Tool: " + summary.tool,
    "- Status: " + summary.status,
    "- Recommendation: " + summary.recommendation,
    "- Environment: " + summary.environment,
    "- Target: " + (summary.target || "N/A"),
    "- Scope: " + (summary.scope || "N/A"),
    "- Exit code: " + summary.exitCode,
    "- Generated at: " + summary.generatedAt,
    "",
    "## Evidence",
    ...(evidence.length > 0 ? evidence.map((item) => "- " + item) : ["- No evidence files recorded"]),
    "",
    "## Notes",
    summary.notes || "No additional notes.",
    "",
  ].join("\n");

  writeFileSync(join(reportDir, "report.md"), markdown);
  ```

- `.cloud/qa/tooling/scripts/write-release-gate.mjs` — aggregates suite summaries into a release verdict:
  ```javascript
  import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
  import { join } from "node:path";

  function parseArgs(argv) {
    const args = {};
    for (let index = 0; index < argv.length; index += 1) {
      const token = argv[index];
      if (!token.startsWith("--")) continue;
      const key = token.slice(2);
      const value = argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[++index] : "true";
      args[key] = value;
    }
    return args;
  }

  const args = parseArgs(process.argv.slice(2));
  const reportDir = args["report-dir"];
  const summaries = (args.summaries || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!reportDir) {
    console.error("Missing required argument: --report-dir");
    process.exit(1);
  }

  mkdirSync(reportDir, { recursive: true });

  const loaded = summaries.map((file) => ({
    file,
    ...JSON.parse(readFileSync(file, "utf8")),
  }));

  let verdict = "GO";
  if (loaded.some((item) => item.status === "FAIL" || item.recommendation === "NO-GO")) {
    verdict = "NO-GO";
  } else if (loaded.some((item) => item.status === "WARN" || item.status === "BLOCKED" || item.recommendation === "GO WITH RISKS")) {
    verdict = "GO WITH RISKS";
  }

  const payload = {
    scope: args.scope || "release",
    verdict,
    generatedAt: new Date().toISOString(),
    suites: loaded,
  };

  writeFileSync(join(reportDir, "release-gate.json"), JSON.stringify(payload, null, 2));

  const markdown = [
    "# QA Release Gate — " + payload.scope,
    "",
    "- Verdict: " + payload.verdict,
    "- Generated at: " + payload.generatedAt,
    "",
    "## Suite Summary",
    ...loaded.map((item) => "- " + item.suite + ": " + item.status + " -> " + item.recommendation + " (" + item.file + ")"),
    "",
  ].join("\n");

  writeFileSync(join(reportDir, "release-gate.md"), markdown);
  ```

- `.cloud/qa/tooling/semgrep/rules.yml` — starter SAST rules:
  ```yaml
  rules:
    - id: factoria-hardcoded-secret
      message: "Potential hardcoded secret detected"
      severity: ERROR
      languages: [generic]
      patterns:
        - pattern-regex: '(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*["\x27][^"\x27]{8,}["\x27]'
  ```

### k6 scripts — backend factories (net, nest, pyt)

- `.cloud/qa/tooling/k6/rest-smoke.js` — REST smoke script (default target `http://localhost:8080`, p(95) threshold `1200`):
  ```javascript
  import http from "k6/http";
  import { check, sleep } from "k6";

  const targetUrl = (__ENV.TARGET_URL || "http://localhost:8080").replace(/\/$/, "");
  const reportDir = __ENV.REPORT_DIR || ".qa-reports/performance";
  const paths = (__ENV.PERF_PATHS || "/")
    .split(",")
    .map((path) => path.trim())
    .filter(Boolean);

  export const options = {
    vus: Number(__ENV.K6_VUS || 5),
    duration: __ENV.K6_DURATION || "30s",
    thresholds: {
      http_req_failed: ["rate<0.05"],
      http_req_duration: ["p(95)<1200"],
    },
  };

  export default function () {
    for (const path of paths) {
      const response = http.get(targetUrl + path);
      check(response, {
        ["GET " + path + " returned < 400"]: (res) => res.status < 400,
      });
    }

    sleep(1);
  }

  export function handleSummary(data) {
    return {
      [reportDir + "/k6-summary.json"]: JSON.stringify(data, null, 2),
      stdout: "k6 performance run completed for " + targetUrl + " on paths: " + paths.join(", "),
    };
  }
  ```

- `.cloud/qa/tooling/k6/grpc-smoke.js` — gRPC smoke script:
  ```javascript
  import grpc from "k6/net/grpc";
  import { check, sleep } from "k6";

  const client = new grpc.Client();
  const reportDir = __ENV.REPORT_DIR || ".qa-reports/performance";
  const grpcAddress = __ENV.GRPC_ADDR || "localhost:5001";
  const grpcMethod = __ENV.GRPC_METHOD || "package.Service/Method";
  const grpcRequest = JSON.parse(__ENV.GRPC_REQUEST_JSON || "{}");
  const grpcPlaintext = String(__ENV.GRPC_PLAINTEXT || "false").toLowerCase() === "true";
  const grpcReflect = String(__ENV.GRPC_REFLECT || "false").toLowerCase() === "true";
  const protoSet = __ENV.GRPC_PROTOSET || "";
  const protoPaths = (__ENV.GRPC_PROTO_PATHS || ".cloud/qa/tooling/grpc")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const protoFiles = (__ENV.GRPC_PROTO_FILES || "service.proto")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (protoSet) {
    client.loadProtoset(protoSet);
  } else if (protoFiles.length > 0) {
    client.load(protoPaths, ...protoFiles);
  }

  export const options = {
    vus: Number(__ENV.K6_VUS || 5),
    duration: __ENV.K6_DURATION || "30s",
    thresholds: {
      checks: ["rate>0.95"],
      grpc_req_duration: ["p(95)<1200"],
    },
  };

  export default function () {
    client.connect(grpcAddress, {
      plaintext: grpcPlaintext,
      reflect: grpcReflect,
      timeout: __ENV.GRPC_TIMEOUT || "60s",
    });

    const response = client.invoke(grpcMethod, grpcRequest);

    check(response, {
      "gRPC status is OK": (res) => res && res.status === grpc.StatusOK,
    });

    client.close();
    sleep(1);
  }

  export function handleSummary(data) {
    return {
      [reportDir + "/k6-summary.json"]: JSON.stringify(data, null, 2),
      stdout: "k6 gRPC performance run completed for " + grpcAddress + " on method: " + grpcMethod,
    };
  }
  ```

- **`net` only** — `.cloud/qa/tooling/grpc/service.proto` (placeholder proto the gRPC script loads):
  ```proto
  syntax = "proto3";

  package package;

  service Service {
    rpc Method (Request) returns (Response) {}
  }

  message Request {
    string placeholder = 1;
  }

  message Response {
    string placeholder = 1;
  }
  ```

  Note: `nest` and `pyt` get `grpc-smoke.js` but NOT the `.proto` placeholder — point `GRPC_PROTOSET`/`GRPC_PROTO_FILES` at the project's own proto when running a gRPC suite.

### k6 script — browser factory (ang)

For `ang`, do NOT create `rest-smoke.js`/`grpc-smoke.js`. Create a single browser-oriented smoke script:

- `.cloud/qa/tooling/k6/smoke.js` (default target `http://localhost:4200`, p(95) threshold `1500`):
  ```javascript
  import http from "k6/http";
  import { check, sleep } from "k6";

  const targetUrl = (__ENV.TARGET_URL || "http://localhost:4200").replace(/\/$/, "");
  const reportDir = __ENV.REPORT_DIR || ".qa-reports/performance";
  const paths = (__ENV.PERF_PATHS || "/")
    .split(",")
    .map((path) => path.trim())
    .filter(Boolean);

  export const options = {
    vus: Number(__ENV.K6_VUS || 5),
    duration: __ENV.K6_DURATION || "30s",
    thresholds: {
      http_req_failed: ["rate<0.05"],
      http_req_duration: ["p(95)<1500"],
    },
  };

  export default function () {
    for (const path of paths) {
      const response = http.get(targetUrl + path);
      check(response, {
        ["GET " + path + " returned < 400"]: (res) => res.status < 400,
      });
    }

    sleep(1);
  }

  export function handleSummary(data) {
    return {
      [reportDir + "/k6-summary.json"]: JSON.stringify(data, null, 2),
      stdout: "k6 performance run completed for " + targetUrl + " on paths: " + paths.join(", "),
    };
  }
  ```

## What it does NOT write

This command does NOT copy skill files, agent prompts, or hook scripts into the project — those live in the plugin and are loaded automatically. It also does NOT create the QA `tooling/` tree for factories without a perf/security QA layer (`pytml`, `dataeng`, `kot`, `swf`, `wps`) — those get only the `.cloud/qa/` seed workspace.

## After running

- Run `factoria:loading-factory-context` to load policies and ADRs for the active factory.
- Commit `CLAUDE.md`, `.gitignore`, and the full `.cloud/` skeleton (including the `.cloud/qa/` QA workspace and, for perf/security factories, the `.cloud/qa/tooling/` tree) plus the `.qa-reports/` evidence directory.
- The project is now Factoria-equipped, and the QA skills can read/write `.cloud/qa/` and `.qa-reports/` without bootstrapping.
