# Vibe Coding & LLM Context Files

## llms.txt & llms-full.txt

ADK encourages the use of structured context files for AI code editors like Cursor or Windsurf.

- **llms.txt**: A high-level overview of the project's architecture, dependencies, and core patterns.
- **llms-full.txt**: A comprehensive dump of the project's codebase and logic for deep context.

## Best Practices for ADK Context

- **Tool Definitions**: Clearly document available tools and their schemas in `llms.txt`.
- **State Flow**: Map out how `Artifacts` move between agents.
- **Prompt Engineering**: Store system prompts as separate files and reference them in your context files for consistency.
