import { Agent, Artifact, Sequential } from '@google/adk';

// Define tools
const fetchTool = async (query: string) => `Mock data for ${query}`;

// Create agents
const researcher = new Agent({
  name: 'Researcher',
  role: 'Data specialist',
  tools: [fetchTool],
});

const writer = new Agent({
  name: 'Writer',
  role: 'Copy editor',
});

// Orchestrate
const workflow = new Sequential({
  agents: [researcher, writer],
  artifact: new Artifact('SessionState'),
});

workflow.run({ goal: 'Brief on multi-agent systems' }).then(console.log);
