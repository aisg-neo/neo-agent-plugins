// Builds the prompt for each provider. Harnesses invoke the skill the way a user would;
// the raw API gets the skill text as its system prompt.
const fs = require('fs');
const path = require('path');

const SKILLS = path.join(__dirname, '..', '..', 'agents', 'skills');
const ASK = 'Review the essay below. Return only the expected result shape as one JSON object, with no other text.';

module.exports = function ({ vars, provider }) {
  const id = provider?.id ?? '';
  if (id.startsWith('anthropic:claude-agent-sdk')) {
    return `/writer:${vars.skill}\n\n${ASK}\n\n${vars.essay}`;
  }
  if (id.startsWith('openai:codex')) {
    return `$${vars.skill}\n\n${ASK}\n\n${vars.essay}`;
  }
  const skill = fs.readFileSync(path.join(SKILLS, vars.skill, 'SKILL.md'), 'utf8');
  return JSON.stringify([
    { role: 'system', content: `You are applying the following skill.\n\n${skill}` },
    { role: 'user', content: `${ASK}\n\n${vars.essay}` },
  ]);
};
