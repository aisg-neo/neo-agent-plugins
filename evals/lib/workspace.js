// Copies the skills into evals/.workspace/.agents/skills, where Codex discovers them.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '.workspace');
fs.rmSync(root, { recursive: true, force: true });
fs.cpSync(path.join(__dirname, '..', '..', 'agents', 'skills'), path.join(root, '.agents', 'skills'), {
  recursive: true,
});
