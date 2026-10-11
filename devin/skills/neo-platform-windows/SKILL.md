---
name: neo-platform-windows
description: "Project Neo evaluation on a Windows VM: Node/PATH and app relaunch rules, CRLF line-ending churn, winget, npx cache, path syntax, GUI automation. Use with any Project Neo exercise playbook when the VM is Windows."
---

# Project Neo - Platform: Windows

## Overview
Platform reference for `Project Neo - Run All Exercises Against a Desktop Coding Agent` for running the exercises on a Windows VM. Covers Node/PATH, line endings, package managers, npx cache, app relaunch rules and GUI automation. Harness specifics stay in the `neo-harness-<agent>` skill; exercise playbooks refer here as "the platform skill".

## Inputs to confirm with the user
- Nothing beyond the main playbook; confirm the VM has admin rights for `winget` if a system install is needed.

## Reference
1. Node: check `node -v` in a fresh shell; the VM default has been Node 20. Install Node 24 (`winget install OpenJS.NodeJS` or nvm-windows) and put it first in the *user* PATH via System Properties, not only in the current shell, so desktop apps inherit it.
2. Relaunch the coding agent from the Start menu after any PATH change; apps started from a shell inherit that shell's stale PATH and the agent's `npm test` will fail on `node:sqlite`. Record the environment note once in results.md if the agent still sees Node 20.
3. Line endings: the repo may check out as CRLF (`git config core.autocrlf`). Edit tools that match text can fail on CRLF and fall back to whole-file rewrites as LF; use `git diff -w --stat` for the real change size, note the churn, and do not count it against the model. When an exercise's only diff is a line-ending flip, restore the committed file so later diffs stay clean.
4. Package managers: `winget install <id>` for CLIs (Worktrunk: `winget install max-sixty.worktrunk`, fall back to the GitHub release zip if winget is unavailable); jq via `winget install jqlang.jq`. Ensure the install dir is on the user PATH and relaunch the agent (step 2).
5. npx cache: a cold `npx -y <pkg>` can exceed a harness's MCP validation timeout and can leave a corrupt cache ("Cannot find module 'zod'"). Pre-warm from a terminal first; on corruption clear `%LOCALAPPDATA%\npm-cache\_npx` and retry (environment issue, not harness).
6. Paths in MCP/agent config use backslashes and absolute drive paths (e.g. `C:\Users\<user>\repos\weather_starter\backend\weather.db`); quote paths with spaces.
7. Browser for agent-browser / Chrome DevTools skills: if Chrome is not at the standard path the agent may fall back to Edge (`--executablePath msedge.exe --headless`); acceptable, note it.
8. GUI automation: desktop composers send on Enter, paste multi-line prompts with Ctrl+V; screenshots with the taskbar clock visible serve as timestamps. Maximize windows via the title bar before recording.
9. Validate before the first exercise: `node -v` >= 22 in a fresh shell and inside the agent, `npm test` and `npm run build` green, app reachable at http://weather-starter.localhost:1355.

## Deliverable requirements
- results.md setup notes record OS build, Node version on PATH, Node version seen by the agent, and `core.autocrlf`.
- Line-ending churn, stale-PATH failures and npx cache corruption are classified environment, never model/harness, unless the harness skill says otherwise.

## Tips
- A whole run attributed to one exercise in token accounting usually means the VM clock zone differs from the log's UTC timestamps; derive the offset from one known prompt.
- OS dialogs (SmartScreen, firewall prompts on first `npm run dev`) must be screenshotted and dismissed; they are environment issues.

## Do not
- Do not launch the coding agent from a shell to "fix" PATH visibility when testing environment behaviour.
- Do not change `core.autocrlf` mid-run; it invalidates line-ending comparisons across exercises.
