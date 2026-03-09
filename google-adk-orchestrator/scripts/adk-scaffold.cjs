const fs = require('fs');
const path = require('path');

const type = process.argv[2] || 'python';
const name = process.argv[3] || 'MyAgent';

const templates = {
  python: `from google_adk import Agent

${name.toLowerCase()} = Agent(
    name="${name}",
    role="Specialist in ${name.toLowerCase()} tasks",
    tools=[]
)
`,
  ts: `import { Agent } from '@google/adk';

export const ${name} = new Agent({
  name: '${name}',
  role: 'Specialist in ${name.toLowerCase()} tasks',
  tools: [],
});
`
};

const ext = type === 'ts' ? 'ts' : 'py';
const fileName = `${name.toLowerCase()}.${ext}`;
fs.writeFileSync(fileName, templates[type]);
console.log(`Created agent scaffold: ${fileName}`);
