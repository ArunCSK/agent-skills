---
name: databricks-spark-engineer
description: Assists with Spark job development (Python/Scala), Delta Lake optimization, and Databricks Asset Bundle (DAB) configuration and deployment. Use when creating `databricks.yml` files, defining Spark workflows, or managing Databricks cluster configurations.
---

# Databricks Spark Engineer Skill

This skill transforms Gemini CLI into an expert Data Engineer specializing in Databricks and Spark.

## Quick Start

1. **Initialize a DAB Project**: Copy the boilerplate from `assets/dab-starter/` to your project root.
2. **Review Best Practices**: Read `references/spark-best-practices.md` and `references/dab-patterns.md` for performance and configuration advice.
3. **Automate Deployments**: Use `scripts/bundle_helper.cjs` to validate, deploy, and run your bundles.

## Core Workflows

### Spark Job Development

- **Optimization**: Prioritize built-in Spark functions and Photon acceleration. Use `OPTIMIZE` and `Z-ORDER BY` for Delta tables.
- **Testing**: Use PySpark for local unit testing of transformations.

### Databricks Asset Bundles (DABs)

- **Configuration**: Define your jobs, tasks, and clusters in `databricks.yml`. Use environment targets for CI/CD.
- **Validation**: Always run `databricks bundle validate` before deploying to staging or production.

### Compute & Governance

- **Unity Catalog**: Ensure all data access is managed through Unity Catalog schemas and volumes.
- **Cluster Policies**: Adhere to corporate cluster policies when defining job clusters.
