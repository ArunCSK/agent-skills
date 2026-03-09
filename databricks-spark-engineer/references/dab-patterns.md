# Databricks Asset Bundle (DAB) Patterns

## Project Structure

```text
my-bundle/
├── databricks.yml        # Root configuration
├── bundle.yml            # Environment-specific overrides
├── src/                  # Source code (Python, SQL, etc.)
└── tests/                # Unit and integration tests
```

## `databricks.yml` Best Practices

- **Environments**: Define `dev`, `staging`, and `prod` targets.
- **Identity & Access**: Use Service Principals for `prod` deployments.
- **Parameterization**: Use bundle variables (`${bundle.target}`) for environment-specific values.

## Job Definitions

- **Compute**: Reference shared cluster policies or use job clusters for isolation.
- **Tasks**: Chain tasks using `depends_on`. Use `notebook_task` for notebooks and `python_wheel_task` for libraries.
- **Notifications**: Configure email or Slack alerts for job failures.

## Deployment Workflow

1. `databricks bundle validate`: Checks for schema errors in YAML.
2. `databricks bundle deploy`: Uploads assets and updates job metadata.
3. `databricks bundle run`: Executes the job in the target environment.
