# QA Policy — Angular

> Mandatory: every user-visible feature, migration, regression cycle, and release candidate must have QA traceability, execution evidence, and an explicit recommendation.

## 1. Scope

Applies to:
- Views and routes
- Services and adapters
- Guards and interceptors
- Visual changes
- Release candidates

## 2. Required QA Artifacts

The project must generate or update:
- `.cloud/qa/context/work-item-context.md`
- `.cloud/qa/strategy/qa-strategy.md`
- `.cloud/qa/plans/test-plan.md`
- `.cloud/qa/scenarios/{feature}.scenarios.md`
- `.cloud/qa/cases/{feature}.cases.md`
- `.cloud/qa/automation/traceability-matrix.md`
- `.cloud/qa/reports/{date}/{suite}/report.md`

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

Every critical requirement must map through:

`Requirement -> Scenario -> Test Case -> Automated or Manual Execution -> Evidence -> Defect or Pass result`

## 4. Mandatory Scenario Coverage

Include at minimum:
- Main user path
- Validation and empty-state behavior
- Auth and permission failures
- API error handling
- Routing/state restoration
- Responsive or visual checks when UI is affected
- Regression-sensitive flows

## 5. Automation Priority

Automate first:
1. Critical user flows
2. Flows that break often
3. API integration paths
4. Security-sensitive paths
5. UI journeys with high business value

## 6. Reporting

Each execution report must include:
- Scope
- Environment
- Pass/fail/blocked/not-run counts
- Visual evidence when applicable
- Risks
- Recommendation: GO / GO WITH RISKS / NO-GO

## 7. Exit Gates

Delivery is blocked when:
- Critical scenarios are not executed
- Critical defects remain open
- Required evidence is missing
- Specialized suites required by risk are skipped
