---
name: neo-harness-agnes-code
description: "Agnes Code desktop (Sapiens AI, goose-based Electron app with an agnesd backend): install, sign-in, environment inheritance, where each feature lives, LLM logs and sessions.db, Share Diagnostics export, and usage fields. Use when the agent under test is Agnes Code."
---

# Project Neo - Harness: Agnes Code

## Overview
How to use Agnes Code for the Project Neo run. Only Agnes-specific facts are here: exercise steps live in the exercise playbooks, and OS specifics are in `neo-platform-<os>`. Facts were checked on Windows with v1.0.60; re-check them when the version changes.

## Inputs to confirm with the user
- The model, as shown in the composer model picker (Agnes models plus third-party ones). There is no reasoning-effort setting; Settings -> response style is `concise` by default.
- Sign-in method: Google SSO via Edge by default. SSO with 2FA cannot be completed by Devin, so open the login window and ask the user to finish on the Desktop tab.

## Reference
1. **Install**
   - Download https://cos-agnes-code.agnes-ai.cn/release/latest/AgnesCode-Installer.exe and run the NSIS wizard through the GUI; `/S` silent install is ignored.
   - The app installs to `%LOCALAPPDATA%\Programs\AgnesCode\AgnesCode.exe`. The backend is `resources\bin\agnesd.exe`, bundled with `node`, `npx` and `uv`/`uvx`.
   - On first launch a BACKEND_PROCESS_CONFLICT can appear; click "Terminate process".
   - The version is in Settings -> About or `resources\agnes-build-manifest.json`.
2. **Project, permissions, model**
   - Ctrl+O opens a project.
   - Permission modes are Full Access, Request Approval and Chat (`AGNES_MODE` in `~/.agnes/config/config.yaml`).
   - The model picker is in the composer.
3. **Environment inheritance:** `agnesd` keeps the PATH of whatever launched the app for its whole lifetime. Set PATH first, launch from the Start menu or Explorer, and confirm with `node -v` in a prompt.
4. **Feature map**
   - **Slash commands:** `/plan` enters plan mode (leave with `/act` or `/endplan`). Also `/compact`, `/goal`, `/grind`, `/status`, `setup-check`.
     - There is no `/init` and no `/clear`; for fresh context, start a **New Task** in the same project.
     - Typing a slash command and pressing Enter takes the first fuzzy match (`/status` -> `/goal`), so pick the entry explicitly.
     - A pasted prompt containing `/path` opens the slash menu; type a space, then Enter.
   - **Context and compaction:** the composer shows a context counter. `/compact` is native. Auto-compaction triggers at `AGNES_MODEL_AUTO_COMPACT_THRESHOLDS` (fraction of the context window).
   - **Image input:** paste, or attach from the plus menu. The model reads images with `read_image`.
   - **Tools:**
     - `search` is grep-like and returns hidden and gitignored hits.
     - `analyze` uses tree-sitter.
     - `shell` defaults to cmd on Windows; `shell:'powershell'` switches it.
     - `edit` is an exact-match replace and fails with "No match found" on CRLF files. The fallback whole-file `write` converts the file to LF.
   - **MCP:** add servers in Settings -> Plugins -> **Add custom plugin** (STDIO or Streamable HTTP), or from the plus menu -> MCP.
     - Config is stored in `~/.agnes/config/config.yaml` under `extensions.<name>` (`type: stdio|streamable_http`, `timeout`).
     - Servers load in new sessions without a restart. Tools are named `<server>__<tool>`.
     - STDIO validation times out after about 5 s, so a cold `npx -y <pkg>` can be killed mid-install. That leaves a corrupt `%LOCALAPPDATA%\npm-cache\_npx\<hash>`, and `main.log` shows `"success":false` with no UI error. Pre-warm the package in a shell first.
   - **Skills:** `$` lists them; `$skill-creator` is bundled. The tools are `load_skill` and `create_skill`.
     - Skills are discovered in `<repo>/.agnes/skills/<name>/SKILL.md` and `~/.agnes/skills`.
     - `create_skill` writes to `.agnes/skills/` and mirrors to `.github/skills/`.
     - `npx skills add` has no Agnes target: it writes `.agents/skills/`, so copy the result into `.agnes/skills/`.
   - **Subagents:** the bundled `summon` extension provides `delegate` and `load`. Built-in agents are `deep-analysis`, `deep-search`, `slide` and `wide-research`.
     - Custom agents are `<repo>/.agnes/agents/<name>.md` or `~/.agnes/agents/` (Agnes's own doc skill wrongly says `.agents/agents/`), invoked with `@name`.
     - There is no `tools:` allowlist or `model:` field.
     - A subagent runs as its own session with `parent_session_id` set.
   - **Headless CLI:** none. `agnesd` has only `agent`, `mcp` and `validate-extensions`.
   - **Web search:** the bundled `agnes_web_search` extension, toggled in Settings -> Plugins.
   - **Other bundled extensions:** `todo`, `agnes_artifacts` (`present_artifacts` may ask approval for paths it treats as outside the workspace), `agnes_aigc`, and the `agnes-doc-guide` skill.
   - **Agent time:** each turn shows a "Processed HH:MM:SS" counter.
5. **Logs and storage** (under `~/.agnes`)
   - **LLM log:** `state/logs/llm/<session-id>/main.jsonl`. Each request writes:
     - a `meta` line (`session_id`, `purpose`, `request_id`, `timestamp_ms`)
     - a `model_config`/`input` line
     - streamed `data` chunks, where `data.created` is the provider time of the first chunk
     - a final `usage` line: `input_tokens`, `output_tokens`, `cache_read_input_tokens`, `cache_write_input_tokens`
   - **Server log:** `state/logs/server/<date>/*.log`, for provider and network errors.
   - **Database:** `data/sessions/sessions.db` (SQLite, WAL; copy it before reading). Tables:
     - `sessions`: `parent_session_id`, `accumulated_*` tokens and cost
     - `messages`
     - `usage_ledger`: one row per request with `created_timestamp` (s), `model`, token columns, `cost`, `cost_source`, `is_compaction`
   - **Desktop log:** `%APPDATA%\AgnesCode\logs\main.log`, covering agnesd start/stop and per-extension load results.
6. **Export:** use the session menu -> Debug -> **Share Diagnostics** -> Save ZIP. The zip holds the transcript `index.html`, a screenshot and the agnesd logs.
7. **Usage fields**
   - Use `usage_ledger` as the per-request source; it includes compaction (`is_compaction`) and title requests, and subagents appear as their own sessions.
   - `sessions.accumulated_*` and the LLM-log `usage` lines are cross-checks only.
   - TTFT is `data.created*1000 - meta.timestamp_ms`; chunks are streamed, so this is the true time to first token.
   - `cost` stays NULL for Agnes models. Official prices are at https://www.agnes-ai.com/en/docs/pricing (model pages under https://wiki.agnes-ai.com/en/docs/).

## Do not
- Do not relaunch Agnes from your own shell.
- Do not sum `usage_ledger` together with `sessions.accumulated_*`; that double counts.
- Do not commit `~/.agnes` or `.agnes/work` scratch files.
