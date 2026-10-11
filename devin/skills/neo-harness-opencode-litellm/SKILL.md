---
name: neo-harness-opencode-litellm
description: "OpenCode (Desktop by default, TUI on request) driven through a LiteLLM gateway: install, provider config, environment inheritance, where each feature lives, session storage, export, and token fields. Use when the agent under test is OpenCode."
---

# Project Neo - Harness: OpenCode via LiteLLM

## Overview
How to use OpenCode for the Project Neo run. Only OpenCode-specific facts are here: exercise steps live in the exercise playbooks, and OS specifics are in `neo-platform-<os>`. Default to OpenCode Desktop (Electron). Use the TUI (`opencode` in a terminal) only when the user asks. The Desktop and the CLI share one version, config, database and log. Facts were checked against 1.18.34; re-check them when the version changes.

## Inputs to confirm with the user
- Mode: Desktop or TUI.
- The exact model id on the gateway, as listed by `curl -H "Authorization: Bearer $LITELLM_API_KEY" $LITELLM_BASE_URL/v1/models`.
- Secrets `LITELLM_BASE_URL` and `LITELLM_API_KEY`.
- Reasoning effort, if the model picker offers variants (Default/Low/Medium/High).

## Reference
1. **Install**
   - Desktop: installer from https://opencode.ai/download. On Windows it installs per user under `%LOCALAPPDATA%\Programs\opencode` and adds a Start-menu entry.
   - CLI: `curl -fsSL https://opencode.ai/install | bash`. It lands in `~/.opencode/bin/` and is not on PATH. You need it for `--version`, `opencode run` and `opencode export`.
2. **Provider config** in `~/.config/opencode/opencode.jsonc`:
   `{"provider": {"litellm": {"npm": "@ai-sdk/openai-compatible", "name": "LiteLLM", "options": {"baseURL": "{env:LITELLM_BASE_URL}v1", "apiKey": "{env:LITELLM_API_KEY}"}, "models": {"<model-id>": {"name": "<display>", "tool_call": true, "limit": {"context": <ctx>, "output": <max out>}}}}}, "model": "litellm/<model-id>", "permission": "allow"}`
   - `permission: "allow"` is full access.
   - `{env:VAR}` is resolved from the app's own environment. On Windows, set the variables as user environment variables.
   - Smoke test: `opencode run -m litellm/<model-id> "reply OK"`.
   - The Desktop model picker is in the composer footer; there is no `/models` picker. Settings > Models lists the configured providers.
3. **Environment inheritance**
   - The Desktop and its agent shell inherit the environment of whatever launched them. On Windows, launch from the Start menu, never from your own shell.
   - Closing the Desktop window leaves the `opencode-cli` sidecar running, and the sidecar owns the agent shell. After a PATH or env change, stop `opencode-cli` too before relaunching.
   - Confirm with `node -v` / `Get-Command <tool>` in a session.
4. **Driving the Desktop**
   - "Open project" opens the repo folder; sessions are per project. New session is Ctrl+N.
   - The composer sends on Enter; Shift+Enter is a newline. Ctrl+V pastes multi-line text as one message, or an image as an attachment.
   - Pasted `/x` and `@x` are plain text. Typed `/` and `@` open the slash and autocomplete menus.
   - In 1.18.34 one Enter on a slash command (`/compact`) selects and runs it. A second Enter during compaction cancels it.
   - Tool-reported time is in the answer footer (`N toolcalls · 1m 2s`).
5. **Feature map**
   - **Plan mode:** native `Plan` agent. The Build/Plan picker is hidden until Settings > "Show agent" is on. Plan has no edit tools; to implement, switch to Build and re-prompt.
   - **Context file:** `/init` creates AGENTS.md.
   - **Context and compaction:** the circle icon (top right) shows Usage % and Tokens. Cost reads $0.00 for custom providers. `/compact` is native.
   - **Built-in tools:** `read`, `glob`, `grep`, `bash`, `edit`, `write`, `webfetch`, `websearch`, `task`, `skill`.
     - `grep` uses ripgrep: no look-around, and it skips hidden and gitignored paths.
     - `read` caps at about 50 KB per call (use `offset`).
     - The first `websearch` call opens a "Third-party web search" consent dialog.
   - **Agent shell on Windows:** `bash` runs `powershell.exe -NoProfile -NonInteractive` (PowerShell 5.1 quoting). Commands that leave a daemon holding stdio fail as `Shell Unknown: ChildProcess.kill (...)`, though the daemon usually started anyway.
   - **MCP:** no settings UI; edit the `"mcp"` key in `opencode.jsonc`.
     - Local server: `"<name>": {"type": "local", "command": ["npx","-y","<pkg>@<ver>",...], "enabled": true}`
     - Remote server: `{"type": "remote", "url": "<url>", "enabled": true}`
     - Config changes hot-reload: `opencode.log` shows `mcp connected server=<name> tools=N`.
     - Tools are called inside a code-mode `Execute` card as `tools["<server>"].<tool>(...)`.
     - Pre-warm `npx -y <pkg>@<ver>` to completion first; a killed pre-warm leaves a broken `_npx` cache.
   - **Skills:** `.opencode/skills/<name>/SKILL.md` or `.agents/skills/<name>/SKILL.md`. They are loaded by the model through the `skill` tool and are picked up without a restart. Skills marked user-invocation-only are not offered in the Desktop slash menu ("No matching items").
   - **Subagents:** `.opencode/agents/<name>.md` with `mode: subagent` frontmatter. They run via the `task` tool as child sessions (`parent_id` set). An `@name` pill selected from the popup is attached to the message but does not force delegation.
   - **Headless:** `opencode run [-m model] [--agent a] [--format json] "<prompt>"`.
6. **Storage and logs**
   - Database: `~/.local/share/opencode/opencode.db` (SQLite, WAL). Read it with Node >= 22 `node:sqlite` `{readOnly: true}`, or from a copy of the db + `-wal` + `-shm` files.
   - **Desktop 1.18.x** writes to:
     - `session_v2` (`id`, `parent_id`, `title`, cumulative `tokens_*`)
     - `session_message` (`session_id`, `type` = user/assistant/compaction/system/idle/synthetic, `seq`, `data` JSON)
   - An assistant `data` record has `model.{id,providerID}`, `tokens.{input,output,reasoning,cache.read,cache.write}`, `cost`, `time.{created,streamed,completed}`, `error`, `finish`.
   - The legacy tables `session`, `message` and `part` hold only CLI sessions.
   - Log: `~/.local/share/opencode/log/opencode.log`, for provider and MCP errors.
7. **Export:** `opencode export <id>` reads only the legacy tables, so it returns `Session not found` for Desktop sessions. For those, dump the `session_v2` row, child session ids and `session_message` rows from the database.
8. **Token fields**
   - Sum the per-request `data.tokens` of assistant and compaction rows; never sum the cumulative `session_v2` totals.
   - `tokens.input` already excludes `cache.read`.
   - TTFT is `time.streamed - time.created`.
   - Title-generation calls are not persisted.
   - `cost` is 0 for gateway models, so cost must be estimated externally.

## Tips
- With `permission: "allow"`, the agent can kill processes it did not start and edit the user-level `opencode.jsonc`. Snapshot the config, and check it after any exercise that touches config.
- The Desktop's "Changed files +N -M" panel counts whole files on CRLF checkouts. Use `git diff -w --stat` instead.

## Do not
- Do not launch the Desktop from your own shell on Windows.
- Do not present OpenCode's `cost: 0` as the real cost.
- Do not commit `~/.config/opencode` or `~/.local/share/opencode`.
