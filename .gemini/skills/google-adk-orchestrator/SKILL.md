---
name: google-adk-orchestrator
description: Assists with building and orchestrating multi-agent systems using Google ADK. Use when defining `Agent` instances, setting up `Sequential` or `Parallel` orchestration, managing `Artifacts`, or deploying agents to Vertex AI.
---

# Google ADK Orchestrator Skill

This skill transforms Gemini CLI into an expert AI Architect specializing in multi-agent orchestration with the Google Agent Development Kit (ADK).

## Quick Start

1. **Initialize an ADK Project**: Use the boilerplate from `assets/python-starter/` or `assets/ts-starter/`.
2. **Review Core Concepts**: Read `references/adk-fundamentals.md` and `references/adk-deployment.md`.
3. **Scaffold Agents**: Use `scripts/adk-scaffold.cjs` to quickly generate new agent definitions.
4. **Vibe Coding Context**: Implement `llms.txt` and `llms-full.txt` using patterns in `references/vibe-coding.md`.

## Core Workflows

### Agent & Orchestration Design

- **Specialization**: Define agents with narrow roles and clear tool definitions.
- **State Management**: Use `Artifacts` to maintain state across complex, multi-agent workflows.
- **A2A Protocol**: Ensure interoperability by following A2A standards for inter-agent communication.

### Deployment & Scalability

- **Vertex AI**: Use native integration for serverless hosting and built-in observability.
- **Continuous Evaluation**: Implement Gen AI Evaluation tools to ensure agent reliability in production.

### Context Optimization

- **LLM Context Files**: Maintain up-to-date `llms.txt` and `llms-full.txt` files to provide high-quality context for AI-assisted development.
