from google_adk import Agent, Artifact, Sequential

def fetch_data(query: str) -> str:
    """Mock tool to fetch data."""
    return f"Data for {query}: Gemini is powerful."

# Define the Researcher Agent
researcher = Agent(
    name="Researcher",
    role="Specializes in data retrieval and synthesis.",
    tools=[fetch_data]
)

# Define the Writer Agent
writer = Agent(
    name="Writer",
    role="Expert in creative and technical writing.",
)

# Create a Sequential Orchestrator
orchestrator = Sequential(
    agents=[researcher, writer],
    shared_artifact=Artifact(name="SessionData")
)

if __name__ == "__main__":
    result = orchestrator.run(goal="Research and write about Gemini CLI.")
    print(f"Final Result: {result}")
