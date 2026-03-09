# Project-Specific Instructions

## Databricks & Spark Engineering

- **Framework**: Use PySpark for data transformations and Databricks Asset Bundles (DABs) for deployment.
- **Optimization**: Prioritize built-in Spark functions and Photon acceleration. Always use `OPTIMIZE` and `Z-ORDER BY` for Delta tables.
- **DABs**: Define jobs and clusters in `databricks.yml`. Validate configurations before deployment.
- **References**: Refer to `databricks-spark-engineer/references/spark-best-practices.md` for performance and `databricks-spark-engineer/references/dab-patterns.md` for bundle configuration.

## Google ADK & Multi-Agent Orchestration

- **Framework**: Use the Google Agent Development Kit (ADK) for multi-agent systems.
- **Orchestration**: Use `Sequential`, `Parallel`, or `Loop` primitives to coordinate agents.
- **State**: Manage cross-agent state using `Artifacts`.
- **Interoperability**: Adhere to the Agent2Agent (A2A) protocol for communication.
- **References**: Refer to `google-adk-orchestrator/references/adk-fundamentals.md` for core concepts and `google-adk-orchestrator/references/adk-deployment.md` for Vertex AI hosting.

## Context Files (Vibe Coding)

- **llms.txt**: Maintain a high-level architectural overview.
- **llms-full.txt**: Provide deep codebase context for AI-assisted development.
- **Patterns**: See `google-adk-orchestrator/references/vibe-coding.md` for details.
