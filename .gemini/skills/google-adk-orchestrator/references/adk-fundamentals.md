# Google ADK Fundamentals

## Core Components

- **Agent**: The atomic unit of ADK. Defined by a name, role, and tools.
- **Artifacts**: Shared state objects used for data persistence across agents and sessions.
- **Goal**: A high-level objective assigned to an orchestrator or individual agent.
- **A2A Protocol**: The Agent2Agent protocol for interoperable communication.

## Orchestration Primitives

- **Sequential**: Runs agents in a specific order, passing outputs from one to the next.
- **Parallel**: Runs multiple agents simultaneously for independent tasks.
- **Loop**: Repeats a set of agent tasks until a condition is met.
- **Leader-Follower**: A primary agent manages multiple specialist agents.

## Basic Python Example

```python
from google_adk import Agent, Sequential

researcher = Agent(name="Researcher", role="Fact finder")
writer = Agent(name="Writer", role="Content creator")

workflow = Sequential([researcher, writer])
workflow.run(goal="Write a summary of AI trends in 2025.")
```
