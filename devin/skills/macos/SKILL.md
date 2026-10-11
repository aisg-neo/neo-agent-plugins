---
name: macos
description: "Project Neo evaluation on macOS: Homebrew/Node, PATH inheritance of desktop apps, privacy dialogs, GUI automation. Use with any Project Neo exercise playbook when the VM is macOS."
---

# Project Neo - Platform: macOS

## Overview
Platform reference for `Project Neo - Run All Exercises Against a Desktop Coding Agent` for running the exercises on macOS. Covers Homebrew/Node, PATH inheritance for desktop apps, privacy dialogs, line endings and GUI automation. Harness specifics stay in the `<agent>-<type>` skill; exercise playbooks refer here as "the platform skill".

## Inputs to confirm with the user
- Nothing beyond the main playbook; the user completes any browser SSO/2FA on the Desktop tab.

## Reference
1. Node: `brew install node` (Node 24 at `/opt/homebrew/bin/node`) and confirm `node -v` >= 22 in a fresh shell. Desktop apps launched from Finder/Spotlight do not read shell rc files; check `node -v` from inside the agent before the first exercise and, if it differs, launch the agent once from a shell with the right PATH and keep that instance for the whole run.
2. Package managers: `brew install jq`, Worktrunk via `brew install max-sixty/worktrunk/wt` or the GitHub release; `brew install --cask` for desktop agents. Record versions in results.md setup notes.
3. Line endings: macOS checkouts are LF; if an edit tool still rewrites whole files, check `git diff -w --stat` and note it (harness quirk, see the harness skill).
4. Privacy/OS dialogs: agents that scan the home directory (`rg ~`) trigger "would like to access your Desktop/Documents/Downloads" prompts; deny, screenshot with the menu-bar clock visible, and classify as environment unless the harness triggers them repeatedly. Accessibility/Screen Recording permission may be needed for GUI automation tools once.
5. npx cache: pre-warm `npx -y <pkg>` before registering MCP servers; on corruption clear `~/.npm/_npx` and retry (environment issue).
6. Paths in MCP/agent config are POSIX absolute paths (`/Users/<user>/repos/weather_starter/backend/weather.db`).
7. GUI automation: Cmd+V pastes multi-line prompts as one message; use the green title-bar button (Option-click) or `open -a` to bring apps forward; screenshots include the menu-bar clock as timestamp.
8. Notifications: macOS banners/alerts (agent completion, updates, Screen Time, etc.) stack in the top-right and hide the agent's UI. Before every screenshot dismiss them: `osascript -e 'tell application "System Events" to tell process "NotificationCenter" to click button "Close" of every window'` (fallback: `... perform action "AXPress" of every button of every group of every UI element ...`, or click the "x"/"Clear" on each banner), then wait ~1 s and capture. Turn on Focus/Do Not Disturb for the run (Control Center -> Focus -> Do Not Disturb) to stop new banners; the exception is a dialog that IS the evidence (privacy prompt, provider error) - screenshot that first, then dismiss it. Never screenshot with a notification overlapping the agent window; if one slipped in, dismiss and retake.
9. Validate before the first exercise: `node -v` >= 22 in a fresh shell and inside the agent, `npm test` and `npm run build` green, app reachable at http://weather-starter.localhost:1355 (Portless resolves `*.localhost` natively).

## Deliverable requirements
- results.md setup notes record macOS version, chip, Node version on PATH and inside the agent, Homebrew prefix.
- Privacy prompts and npx cache issues are classified environment.
- No evidence screenshot has a notification banner covering the agent window.

## Tips
- Apps updated in place (e.g. an agent's in-app update) keep the original launch environment; relaunch after updating if PATH matters.
- `security` keychain prompts from `git`/`gh` are environment; approve once with "Always Allow".

## Do not
- Do not grant Full Disk Access to the agent to silence privacy dialogs; the dialogs are part of the recorded behaviour.
