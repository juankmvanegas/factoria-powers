# Testing Policy

These testing rules are mandatory for Factoria-Pyt-MLOps.

## Unit and Service Tests

- Serving and orchestration code must have pytest coverage
- Validate startup and artifact checks
- Validate error paths for missing files, invalid records, and broken assumptions

## Analytical Logic

- Reusable transformation helpers require tests when they affect model behavior or outputs
- Notebooks do not need direct unit tests, but their reusable extracted code does

## Pipeline Safety

- Changes to stage definitions, params, or artifact names require verification of downstream compatibility
- Tests must help detect serving regressions caused by pipeline changes

## Documentation

- If the workflow changes, update README and operational documentation
- If artifact expectations change, update the documented runtime assumptions
