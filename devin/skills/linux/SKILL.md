---
name: linux
description: "Project Neo evaluation on a Linux desktop VM: nvm/Node PATH, user-space installs, window management, tmux/xdotool text entry, npx cache, path syntax. Use with any Project Neo exercise playbook when the VM is Linux."
---

# Project Neo - Platform: Linux

## Overview
Platform reference for `Project Neo - Run All Exercises Against a Desktop Coding Agent` for running the exercises on a Linux desktop VM (Ubuntu with X on `:0`). Covers nvm/Node, launching desktop or TUI agents with the right environment, window management, clipboard/typing automation and package installation. Harness specifics stay in the `<agent>-<type>` skill; exercise playbooks refer here as "the platform skill".

## Inputs to confirm with the user
- Nothing beyond the main playbook; sudo is generally unavailable, so prefer user-space installs (nvm, `~/.local/bin`, release tarballs).

## Reference
1. Node: use nvm (`nvm install 24 && nvm alias default 24`); confirm `node -v` >= 22 in a fresh login shell. Launch the coding agent from a shell where that Node is active so it inherits the PATH; for `.desktop`/AppImage launches export PATH in `~/.profile` and log out/in once.
2. Package managers: `apt` needs sudo, so install jq (`~/.local/bin` from GitHub release or `nvm`-scoped `npm i -g`), Worktrunk (GitHub release tarball into `~/.local/bin`) and agent CLIs via their user-space install scripts. Record versions in results.md setup notes.
3. Line endings: LF checkout; whole-file rewrites by an edit tool are harness quirks (harness skill) - use `git diff -w --stat`.
4. Windows and recording: maximize with `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz` (never Super+Up tiling). Keep the dev server and TUI agents in separate terminal windows on the Desktop so screenshots capture them.
5. Text entry: GUI composers - paste with Ctrl+V (`xclip -selection clipboard`); terminal TUIs - bracketed paste or `xdotool type --delay 20` into the focused terminal for multi-line prompts.
6. npx cache: pre-warm `npx -y <pkg>` before registering MCP servers; on corruption clear `~/.npm/_npx` and retry (environment issue).
7. Paths in MCP/agent config are POSIX absolute paths (`/home/<user>/repos/weather_starter/backend/weather.db`).
8. Browser for agent-browser / Chrome DevTools skills: use the already running Chrome via CDP where possible; headless Chromium from `npx playwright install chromium` otherwise.
9. Validate before the first exercise: `node -v` >= 22 in a fresh shell and inside the agent, `npm test` and `npm run build` green, app reachable at http://weather-starter.localhost:1355 (if `*.localhost` does not resolve, add an `/etc/hosts` entry or use `127.0.0.1:1355` and note it).

## Deliverable requirements
- results.md setup notes record distro, desktop session type (X11/Wayland), Node version on PATH and inside the agent, install method of each CLI.
- PATH inheritance, missing sudo and DNS `*.localhost` resolution are environment issues.

## Tips
- The VM clock is often UTC while the user is not; derive the log-timestamp offset from a known prompt before bucketing tokens.
- GTK file dialogs and keyring prompts from Electron apps are environment; screenshot and dismiss.

## Do not
- Do not use `xdotool key super+Up` for window management.
- Do not run installs with sudo; if a step truly needs it, ask the user to run it.
