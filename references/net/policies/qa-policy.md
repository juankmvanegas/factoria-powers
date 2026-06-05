# QA Policy

> Mandatory: every feature, fix, migration, and release candidate must have a QA strategy, test scenarios, execution evidence, and a delivery recommendation. No release is considered ready without QA traceability.

## 1. Scope

This policy applies to:
- New features
- Bug fixes with user-visible impact
- Legacy migrations
- Regression cycles
- Release candidates

## 2. Required QA Artifacts

For each significant delivery, the project must generate or update:
- `.cloud/qa/context/work-item-context.md`
- `.cloud/qa/strategy/qa-strategy.md`
- `.cloud/qa/plans/test-plan.md`
- `.cloud/qa/scenarios/{feature}.scenarios.md`
- `.cloud/qa/cases/{feature}.cases.md`
- `.cloud/qa/automation/traceability-matrix.md`
- `.cloud/qa/reports/{date}/{suite}/report.md`

If an artifact is not applicable, the reason must be documented explicitly.

## 2.0 Functional Intake from Azure DevOps

When the QA request is associated with a User Story, Bug, Feature, or other Azure DevOps work item, Factoria must:

1. Ask for the Azure DevOps work item ID if the user did not provide it.
2. Read the functional context of that work item before generating QA artifacts.
3. Persist the extracted functional summary, acceptance criteria, and QA notes in `.cloud/qa/context/work-item-context.md`.

QA planning must use the Azure DevOps work item as the primary functional source of truth when it exists.

## 2.1 Mandatory QA Execution Order

When the user requests QA, testing strategy, test cases, automation, performance validation, security testing, or QA signoff, Factoria MUST follow this order unless a step is explicitly documented as N/A:

1. `qa-strategy`
2. `qa-plan`
3. `qa-scenarios`
4. `qa-test-cases`
5. `qa-automation-plan`
6. `qa-run-suite`
7. `qa-report`
8. `qa-release-gate` when a final verdict is requested

`perf-test`, `sast-scan`, and `dast-scan` are inserted before the release gate whenever risk, scope, or policy requires them.

Factoria must not jump directly to execution or reporting if upstream QA artifacts are missing.

## 3. Minimum Traceability

Every critical requirement must be traceable through:

`Requirement -> Scenario -> Test Case -> Automated or Manual Execution -> Evidence -> Defect or Pass result`

Critical or high-risk requirements without traceability block delivery.

## 4. Scenario Design Rules

All scenario sets must include:
- Happy path
- Validation failures
- Authorization/authentication failures
- Empty or null data responses
- External dependency failures
- Business rule edge cases
- Regression-sensitive paths

For migrations, include parity scenarios against the legacy behavior.

## 5. Test Case Rules

Each test case must contain:
- Unique id
- Requirement reference
- Scenario reference
- Preconditions
- Steps
- Test data
- Expected result
- Priority
- Severity if it fails
- Execution type: manual, automated, or hybrid

## 6. Automation Policy

Automation priority order:
1. Critical business flows
2. Recurrent regression flows
3. API contracts and validation paths
4. Security-sensitive paths
5. High-volume UI workflows

Do not automate unstable low-value flows before the critical path is covered.

## 7. Reporting

Each suite execution must produce a report with:
- Scope executed
- Environment
- Start/end time
- Pass/fail/blocked/not-run counts
- Defects found
- Evidence links
- Risks
- Recommendation: GO / GO WITH RISKS / NO-GO

## 8. Exit Gates

QA blocks delivery when:
- Critical scenarios were not executed
- Critical defects remain open
- No evidence exists for the executed suite
- Traceability is incomplete for critical requirements
- Specialized suites required by risk were skipped

## 9. Relationship with Other Policies

This policy complements:
- `testing-policy.md`
- `security-policy.md`
- `coding-standards.md`

When there is a conflict, security and testing policies still have absolute priority for enforcement details.
