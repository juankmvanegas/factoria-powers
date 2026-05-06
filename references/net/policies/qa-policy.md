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
- `.cloud/qa/strategy/qa-strategy.md`
- `.cloud/qa/plans/test-plan.md`
- `.cloud/qa/scenarios/{feature}.scenarios.md`
- `.cloud/qa/cases/{feature}.cases.md`
- `.cloud/qa/automation/traceability-matrix.md`
- `.cloud/qa/reports/{date}/{suite}/report.md`

If an artifact is not applicable, the reason must be documented explicitly.

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
