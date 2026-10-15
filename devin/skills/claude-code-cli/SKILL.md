---
name: claude-code-cli
description: "Claude Code CLI (terminal `claude`) through a third-party Anthropic-compatible gateway: native install, settings.json gateway env, model selection, onboarding, permission modes, headless `-p`, MCP/skills/subagents, session JSONL logs and token fields. Use when the agent under test is the Claude Code CLI (not the Desktop app)."
---

# Project Neo - Harness: Claude Code CLI

## Overview
How to use the Claude Code CLI (`claude` in a terminal) with a gateway instead of an Anthropic account. Only harness-specific facts are here: exercise steps live in the exercise playbooks, and OS specifics are in the platform skill (`macos`, `linux`, or `windows`). The agent features and log format are shared with `claude-code-desktop`. Facts were checked on Windows Server 2022 with Claude Code 2.1.295 against `https://llm-gateway.aisg.sg`; re-check them when the CLI updates.

## Inputs to confirm with the user
- Gateway base URL and API key, as saved secrets.
- The model id the gateway exposes for that key (`GET $URL/v1/models`). The CLI's default model is not on the gateway (see step 2).
- Effort (`low` / `medium` / `high` / `xhigh` / `max`) and permission mode.

## Reference
1. **Install**
   - Windows (PowerShell): `irm https://claude.ai/install.ps1 | iex`. macOS/Linux: `curl -fsSL https://claude.ai/install.sh | bash`.
   - The native binary goes to `~/.local/bin/claude(.exe)`. On Windows the installer does **not** add it to PATH; add `%USERPROFILE%\.local\bin` to the *user* PATH (`[Environment]::SetEnvironmentVariable('Path', "$env:USERPROFILE\.local\bin;" + [Environment]::GetEnvironmentVariable('Path','User'), 'User')`) and open a new terminal.
   - `claude --version` prints the version. `~/.claude.json` holds install/onboarding state.
2. **Gateway and model** (`~/.claude/settings.json`, Windows `%USERPROFILE%\.claude\settings.json`)
   - Merge into the existing file (the installer already writes `autoUpdatesChannel`); keep it valid JSON:
     ```json
     {
       "env": {
         "ANTHROPIC_AUTH_TOKEN": "<gateway key>",
         "ANTHROPIC_BASE_URL": "https://llm-gateway.aisg.sg"
       },
       "model": "<gateway model id, e.g. claude-sonnet-5>"
     }
     ```
   - Base URL has no `/v1`. `ANTHROPIC_AUTH_TOKEN` is sent as a bearer token.
   - **Set `model`.** Without it the CLI defaults to an Opus id (`claude-opus-5-5` on 2.1.295) and every request fails with `403 ... model ... is not available for this API key` (shown as "Failed to authenticate"). `/model <id>` in the TUI also saves `model` to settings.json; `--model <id>` overrides per run.
   - Verify the key first with curl: `GET $URL/v1/models`, and `POST $URL/v1/messages` with header `anthropic-version: 2023-06-01`.
   - `/status` shows `Auth token: ANTHROPIC_AUTH_TOKEN`, the base URL and the model when the gateway is active.
3. **First run (`claude` in the project directory)**
   - Onboarding is: text style/theme -> security notes (Enter) -> "Is this a project you trust?" (choose **Yes, I trust this folder**; asked once per new folder). No login or endpoint prompt appears when settings.json is set.
   - The header shows `<Model> · API Usage Billing`.
   - Harmless gateway noise: a startup notice that auto-mode classifier billing "isn't compatible" with the gateway, and one `400` on the first request (the gateway rejects a beta header; the CLI retries without it). Managed settings and org policy are not fetched with a custom base URL.
4. **Controls**
   - Permission mode: `shift+tab` cycles auto -> manual -> accept edits -> plan in the TUI; default is **auto mode**. `--permission-mode acceptEdits|auto|bypassPermissions|manual|dontAsk|plan`, or `--dangerously-skip-permissions`.
   - Model: `/model`, `--model`. Effort: `--effort <level>`.
   - `Esc` cancels a dialog or interrupts a turn; `/exit` quits; `-c` continues and `-r <id>` resumes a session.
   - The TUI composer sends on Enter. When driving it from a script/PTY, send the text, then a separate Enter.
   - The turn footer `✻ <verb> for 11s` is the agent time.
5. **Feature map** (same agent as Desktop; see `claude-code-desktop` for details)
   - **Plan mode:** `shift+tab` until `plan mode on`, or `--permission-mode plan`.
   - **Context file:** `/init` creates `CLAUDE.md`. **Compaction:** `/compact`, plus auto-compaction (`--autocompact`).
   - **MCP:** `claude mcp add <name> -- <cmd> <args>` (stdio) or `claude mcp add --transport http <name> <url>`; `-s local|user|project` (project writes `.mcp.json`). Unlike Desktop, a project `.mcp.json` server stays `Pending approval` until approved in the TUI; `claude mcp list` shows the state; tools are named `mcp__<server>__<tool>`.
   - **Skills:** `.claude/skills/<name>/SKILL.md` or `~/.claude/skills`, invoked with `/name` or the `Skill` tool.
   - **Subagents:** `.claude/agents/<name>.md`, or `--agents '<json>'`; `@name <task>` or the Task tool.
   - **Headless:** `claude -p "<prompt>" --output-format json|stream-json`. `-p` skips the trust dialog and silently ignores invalid settings files. The JSON result has `is_error`, `api_error_status`, `result`, `usage`, `modelUsage`, `ttft_ms` and `duration_ms`.
   - **Debug:** `--debug-file <path>` logs every API dispatch (`[API:timing] dispatching ... model=...`) and API errors.
   - **Windows shell:** the Bash tool runs Git Bash (POSIX paths like `/c/Users/...`).
6. **Logs and export**
   - Sessions: `~/.claude/projects/<cwd with :, \ and / as ->/<session-uuid>.jsonl` (e.g. `C--Users-Administrator-repos-x`). Headless `-p` runs also write one each.
   - Record types include `user`, `assistant` (one record per content block, with `message.id`, `message.model`, `message.usage`), `system`, `attachment`, `permission-mode`, `ai-title`, `file-history-snapshot`, `last-prompt`. Timestamps are UTC ISO.
   - Export: copy the JSONL and any `<session-uuid>/subagents/` directory.
7. **Token fields**
   - `usage`: `input_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`, `output_tokens`, `output_tokens_details.thinking_tokens`.
   - Dedupe assistant records on `message.id`. Price cache write and cache read separately; thinking is inside output.
   - `total_cost_usd` / `costUSD` in `-p` output are list-price estimates; the gateway's own budget counter may differ, so report both. Official prices: https://platform.claude.com/docs/en/about-claude/pricing.

## Do not
- Do not commit `~/.claude`, `~/.claude.json`, or a `.mcp.json` that contains secrets; settings.json holds the gateway key in plain text.
- Do not leave the `model` setting unset; the default model id fails on the gateway.
