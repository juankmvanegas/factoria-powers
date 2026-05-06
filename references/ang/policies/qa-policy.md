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
- `.cloud/qa/strategy/qa-strategy.md`
- `.cloud/qa/plans/test-plan.md`
- `.cloud/qa/scenarios/{feature}.scenarios.md`
- `.cloud/qa/cases/{feature}.cases.md`
- `.cloud/qa/automation/traceability-matrix.md`
- `.cloud/qa/reports/{date}/{suite}/report.md`

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
