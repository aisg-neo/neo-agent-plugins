---
name: codex-desktop
description: "OpenAI Codex desktop app (Codex mode of the ChatGPT app): install and update, sign-in, environment inheritance, where each feature lives, rollout logs, session export, and token fields. Use when the agent under test is Codex."
---

# Project Neo - Harness: Codex Desktop

## Overview
How to use the Codex desktop app for the Project Neo run. Only Codex-specific facts are here: exercise steps live in the exercise playbooks, and OS specifics are in the platform skill (`macos`, `linux`, or `windows`). Re-check version-specific details when the app updates.

## Inputs to confirm with the user
- The model, as shown in the composer picker, and the reasoning effort (Light / Standard / Extended / Max; default Light).
- Sign-in: follow "Signing in to Codex (email code)" below.

## Signing in to Codex (email code)
- Sign in with the account email using the email one-time-code option (not Google sign-in).
- The code will arrive in chat.

## Reference
1. **Install and update**
   - macOS: `brew install --cask codex` installs the CLI `codex` and `Codex.app`.
     - Clear quarantine with `xattr -dr com.apple.quarantine /Applications/Codex.app`.
     - The in-app **Update** (sidebar footer) replaces Codex.app with `/Applications/ChatGPT.app`. Codex is then a mode of that app: click the "ChatGPT" sidebar title and choose **Codex**.
     - Update before checking the model list; older builds expose fewer models.
   - Windows: the app is Store package `OpenAI.Codex_2p2nqsd0c76g0` (product `9PLM9XGG6VKS`). `codex app` only opens the Store, which Server VMs lack, so download the MSIX per the platform skill and run `Add-AppxPackage`.
     - The entry point is `app\ChatGPT.exe`; `app\Codex.exe` is a stub.
     - If packaged activation shows no window, fully extract the MSIX (`unzip -q -o codex.msix -d C:\CodexApp`). Set `CODEX_CLI_PATH=C:\CodexApp\app\resources\codex.exe` and launch `app\ChatGPT.exe`. Without that variable, an unpackaged launch fails with "The process has no package identity".
     - Unpackaged, the in-app updater is unavailable; update by installing a newer MSIX.
   - Versions: `codex --version` gives the CLI version; Settings shows the app version.
2. **Project, permissions, model:** open the repo as a project and accept the trust prompt. Set permissions to **Full access**. Model and effort are in the composer picker.
3. **Environment inheritance:** Codex inherits the PATH of whatever launched it. Confirm with `node -v` in a prompt.
4. **Feature map**
   - **Plan mode:** `/` menu -> **Plan mode** (a "Plan" chip appears). The plan ends with an "Implement this plan? Yes / No" gate.
   - **Context file:** `/init` creates AGENTS.md.
   - **Context and compaction:** there is no usage ring; the `/compact` menu entry shows "(NN% full)". `/compact` is native.
   - **Image input:** paste into the composer.
   - **Search:** the agent runs `rg` and other shell commands inside its `exec` tool.
   - **MCP:** Settings -> Plugins -> MCPs -> Add -> **Add MCP server**. Pick the type first; the URL field only appears for HTTP.
     - CLI equivalent: `codex mcp add <name> -- <cmd> <args>`. Config is stored in `~/.codex/config.toml` under `[mcp_servers.<name>]`.
     - Tools are named `mcp__<server>__<tool>`.
     - "Create MCP App" (HTTP/Tunnel) is a different feature.
   - **Skills:** `$` lists them; `$skill-creator` is bundled. They are discovered in `~/.codex/skills/` and the repo's `.agents/skills/`, which is where `npx skills add` installs.
   - **Subagents:** the tools are `spawn_agent`, `wait_agent`, `send_message` and `close_agent`. Built-in roles are `default`, `explorer` and `worker`.
     - A custom role needs `[agents.<name>]` in `~/.codex/config.toml` plus `~/.codex/agents/<name>.toml`, with `developer_instructions` required and `sandbox_mode = "read-only"` for read-only roles.
     - There is no `@agent` mention; `@` offers only files and threads.
     - Child agents write separate rollout files.
   - **Headless CLI:** `codex exec [PROMPT]`.
   - **Web search:** built in, and the agent uses it unprompted.
5. **Logs:** each thread is a rollout file `~/.codex/sessions/<yyyy>/<mm>/<dd>/rollout-<local-time>-<thread-id>.jsonl`. The filename time is local, but timestamps inside are UTC. Records:
   - `session_meta`: thread id, plus agent role and parent for subagents
   - `event_msg` with `payload.type == "token_count"`: `info.last_token_usage` per request, `info.total_token_usage` cumulative, `model_context_window`
   - `response_item`: reasoning, messages and function calls
6. **Export:** there is no in-app export. Copy the raw rollout JSONL, including child rollouts.
7. **Token fields**
   - Sum `last_token_usage.{input_tokens,cached_input_tokens,output_tokens,reasoning_output_tokens}`.
   - `token_count` events repeat, so dedupe on the cumulative tuple first; `input_tokens` includes cached tokens, and reasoning is counted inside output.
   - Response items are written on completion, so rollout-based latency is only an upper bound on TTFT.
   - The app shows no cost. Official prices: https://developers.openai.com/api/docs/pricing and `https://developers.openai.com/api/docs/models/<model-id>` (app name "GPT-6 Luna" -> id `gpt-6-luna`); check the long-context threshold.
   - Your own `codex exec` checks also create rollouts.

## Do not
- Do not sum `total_token_usage`; it is cumulative.
- Do not commit `~/.codex`.
