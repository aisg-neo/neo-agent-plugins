---
name: neo-harness-claude-code-desktop
description: "Claude Code inside the Claude Desktop app (Code tab) through a third-party Anthropic-compatible gateway: install, Developer-Mode gateway setup, model/effort/permission controls, where each feature lives, sandbox limits, session JSONL logs and export, and token fields. Use when the agent under test is Claude Code Desktop."
---

# Project Neo - Harness: Claude Code Desktop

## Overview
How to use Claude Code in the Claude Desktop app (Code tab) with a gateway instead of an Anthropic account. Only harness-specific facts are here: exercise steps live in the exercise playbooks, and OS specifics are in `neo-platform-<os>`. Facts were checked on macOS with Claude Desktop 2.9939.2 / Claude Code 2.1.281; re-check them when the app updates.

## Inputs to confirm with the user
- Gateway base URL and API key, as saved secrets. Ask about the key's spend budget: a budget 429 stops every request.
- The model id the gateway exposes (`/v1/models`) and the effort (Low / Medium / High; default High).

## Reference
1. **Install and gateway**
   - Get the macOS DMG. If `claude.ai/download` is blocked, use `https://storage.googleapis.com/osprey-downloads-c02f6a0d-347c-492b-a752-3e0651722e97/nest/Claude.dmg`. Copy `Claude.app` to `/Applications`. The first launch self-updates and relaunches.
   - Turn on Help -> Troubleshooting -> **Enable Developer Mode**.
   - Then Settings -> **Developer** -> **Configure third-party inference** -> Gateway: base URL, static API key, bearer auth -> **Test connection**.
   - Verify the key first with curl: `GET $URL/v1/models`, and `POST $URL/v1/messages` with header `anthropic-version: 2023-06-01`.
   - The sidebar footer shows `<user> · Gateway` when the gateway is active.
2. **Project and controls**
   - Open a project: Code tab -> `+ New` -> folder chip.
   - The composer chips are Local, folder, branch, `worktree` (keep it off to work in the checkout) and `+` (attach).
   - Model and effort are at the bottom right.
   - Permission mode is at the bottom left (Bypass permissions / Default / Plan) and persists per project. A new session may still open in Plan mode with an "Accept and bypass permissions" button.
   - The composer timer (`1m 38s · N tokens`) is the agent time.
   - Rate limiting shows as `Rate limited · Retrying (n/10)`. After a budget 429, **Try again** resumes the turn in the same session.
3. **Feature map**
   - **Plan mode:** the permission chip, or `/plan`. The plan card offers Accept / "Accept and bypass permissions" / reject. After a reject, "Failed to propose plan" is cosmetic.
   - **Context file:** `/init` creates `CLAUDE.md`, not AGENTS.md.
   - **Compaction:** `/compact`; auto-compaction is also on.
   - **MCP:** there is no custom-server form in the GUI (Settings -> Connectors / `/mcp`). Use project `.mcp.json`: `{"mcpServers": {"<name>": {"command": ..., "args": [...]}}}` or `{"type": "http", "url": ...}`.
     - The **next new session** picks it up, with no approval dialog.
     - Tools are named `mcp__<server>__<tool>`.
   - **Skills:** `.claude/skills/<name>/SKILL.md` or `~/.claude/skills`, invoked with `/name` or the `Skill` tool.
     - A skill with `disable-model-invocation: true` cannot run through the `Skill` tool.
     - `npx skills add` has no Claude Code target: install to `.agents/skills` and symlink into `.claude/skills`.
   - **Subagents:** `.claude/agents/<name>.md` with frontmatter `name`, `description`, `tools` and `model`. Invoke with `@name <task>` or the Task tool. The built-in `Explore` subagent runs on its own.
   - **AskUserQuestion:** shows a multiple-choice card (Submit / Skip).
   - **Headless CLI:** `claude` is not on PATH. Use the bundled binary: `~/Library/Application Support/Claude/claude-code/<ver>/claude.app/Contents/MacOS/claude -p "<prompt>" --output-format stream-json`.
   - **In-app browser preview** (`mcp__Claude_Browser__preview_start`):
     - Launch configs that attach to a URL fail ("needs the in-app Browser preview").
     - A command-based config in `.claude/launch.json` (`runtimeExecutable`/`runtimeArgs`/`port`) works and provides screenshot, eval and click tools.
     - Another process on that port gives "Port in use".
   - **Web search:** on by default.
4. **Sandbox** (Settings -> Claude Code; the toggle is locked on in Gateway mode, and `dangerouslyDisableSandbox` has no effect). Configure it in `~/.claude/settings.json` under `sandbox`:
   - **Local port binding** returns EPERM until `network.allowLocalBinding: true` is set.
   - **Writes outside the project** (e.g. `~/.npm`, `/tmp`, `~/.claude/skills`) fail until the paths are added to `filesystem.allowWrite`.
   - **Unix sockets** (MCPorter and agent-browser daemons) are denied even when listed in `network.allowUnixSockets`, so daemon-based CLIs don't work inside the sandbox.
   - **Outbound domains** other than the gateway are blocked unless listed in `network.allowedDomains`. Even then, `npm install` may return 403, and the Bash tool cannot widen network access mid-session. Run installs yourself.
   - **Other limits:**
     - `ps` is not permitted.
     - `Read` refuses files over 256 KB.
     - CLIs that write to `~/Library/Preferences` hit EPERM (e.g. set `ASTRO_TELEMETRY_DISABLED=1`).
     - Edits outside the project leave `.claude/.cc-writes/` scratch directories behind.
5. **Logs and export**
   - Sessions: `~/.claude/projects/<cwd-with-slashes-as-dashes>/<session-uuid>.jsonl`, with subagents in `<session-uuid>/subagents/*.jsonl`. The sidebar title is not the UUID; find the session by grepping the first prompt, or with `ls -t`.
   - Record types:
     - `user`: a prompt or a `tool_result`
     - `assistant`: one record per content block, with `message.id`, `message.model`, and `message.usage` (`input_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`, `output_tokens`, `output_tokens_details.thinking_tokens`)
     - `system` and `summary`
   - Timestamps are UTC ISO.
   - App logs are in `~/Library/Logs/Claude/`. Config is in `~/Library/Application Support/Claude/` (`developer_settings.json`, `claude_desktop_config.json`, `config.json`).
   - Export: there is no GUI export for Code sessions. Copy the JSONL and the `subagents/` directory.
6. **Token fields**
   - Dedupe assistant records on `message.id` (one request writes N blocks with identical usage).
   - Price `cache_creation` (write) and `cache_read` separately; thinking is counted inside output.
   - The request start time is not logged, so latency (previous record -> first assistant block) is only an upper bound on TTFT.
   - Never use the home-screen Overview counters for accounting.
   - Official prices: https://platform.claude.com/docs/en/about-claude/pricing. The gateway's own budget counter may differ, so report both.

## Do not
- Do not commit `~/.claude`, `.claude/launch.json`, or a `.mcp.json` that contains secrets.


## Windows Desktop supplement

Observed on Windows Server 2022, Claude Desktop 2.31226.1 / bundled Code 2.1.295. Recheck paths and UI after updates. This supplement contains harness facts, not exercise findings. macOS sandbox behavior above is not assumed on Windows.

### Installation and activation
- The official Windows redirect may be Cloudflare-blocked in shell. The official bootstrapper `https://downloads.claude.ai/releases/win32/ClaudeSetup.exe` worked; verify its Authenticode signature is Valid/Anthropic before installing.
- Install is MSIX, currently package family `Claude_pzs8sxrjxfjjc`. Query `Get-AppxPackage '*Claude*'` for the real version/install location.
- If Start activation silently exits, opening Applications may reveal a disabled-service error. Inspect AppInfo before blaming the harness. On this VM AppInfo was Disabled; restoring Manual startup and starting it recovered Desktop. Do not enable unrelated services blindly.
- Persist Node>=22 (prefer24) first in user PATH through System Properties and remove obsolete machine Node precedence if necessary. Relaunch Desktop through Start.
- Fresh automation shells may still inherit a stale service PATH. For shell setup refresh `$env:Path=[Environment]::GetEnvironmentVariable('Path','Machine')+';'+[Environment]::GetEnvironmentVariable('Path','User')`. Independently verify the agent's actual `node -v`; do not infer it from the setup shell.

### Gateway UI
- Enable Developer Mode through Help/Troubleshooting, then native Developer menu/Configure Third-Party Inference is available before account login. File/Settings may not work on the sign-in surface.
- Connection uses Gateway, Static API key, bearer. Enter secrets through secret references only. Capabilities allows Code and egress policy; set the intended domains or Allow all for an explicitly approved unrestricted exercise environment.
- Apply then restart. Gateway mode bypassed account login and displayed `Administrator · Gateway`.
- Bypass needs both Settings/Claude Code/Allow bypass permissions mode AND the per-project composer permission selector/confirmation.
- Code composer: Local, folder, branch, unchecked worktree. Haiku5.5 and azure_ai/claude-haiku-5-5 are separate choices. Haiku5.5 exposed a Medium effort slider in this version. Verify the exact model via real session JSONL.

### Windows files
Discover paths again after updates; do not assume macOS layout.
- Installed app: `C:\Program Files\WindowsApps\Claude_<package-version>_x64__pzs8sxrjxfjjc\app\Claude.exe`.
- Pre-gateway user data: `%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude`.
- Active gateway user data: `%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Local\Claude-3p`.
- Gateway config is in active `configLibrary\<uuid>.json` and `_meta.json`; other settings in `config.json`, `claude_desktop_config.json`. Never dump config/credential contents or attach them.
- Gateway logs in active `logs`: `main.log`, `cli-diagnostics.jsonl`, `claude.ai-web.log`, `mcp.log`, `ssh.log`.
- Active bundled Code: active `claude-code\<version>\<hash>\claude.exe`; `--version` is safe version inspection, not a substitute for Desktop.
- Sessions remain `%USERPROFILE%\.claude\projects\C--Users-Administrator-repos-weather-starter\<uuid>.jsonl` for this checkout. Raw usage dedupe by assistant message.id; setup probe usage must be excluded from exercise accounting.
- Cowork service logs: `C:\ProgramData\Claude\Logs\cowork-service.log`.

### Prompt timing and evidence
- For multiline verbatim prompts, use native PowerShell `Set-Clipboard` with the complete Unicode text, then Ctrl+V in the composer. `computer.type` can interpret newline characters as Enter submissions, splitting the prompt into queued messages.
- Before Enter, capture the entire composer and copy it back with Ctrl+A/Ctrl+C; compare clipboard text with the intended prompt (normalize CRLF to LF only). After submission, require exactly one raw human message equal to the intended text.
- If delivery fails, preserve the aborted session, fragment queue timestamps, screenshots and spend as an evaluator error, not a model/harness error. Do not silently retry or clean agent-created fixtures; obtain lead authorization and keep the valid retry separate.
- For exercises involving env/config files, inspect only requested marker matches and safe path/line metadata. Share privacy-sanitized exports, explicitly distinguishing their hashes from the original raw-source hash; retain raw logs locally without dumping or attaching config output.
- Completed Windows Desktop Code answers may omit a final processed-time value even when an in-progress seconds counter was visible. Record the displayed final value as unavailable rather than using the transient counter.
- Use the session JSONL user timestamp and last assistant `end_turn` timestamp for a separately labeled raw prompt window; for first-edit timing distinguish the Edit request from its successful tool-result timestamp.
- Exact course prompts may lead the agent to initiate its own shell checks. Distinguish these from evaluator-owned checks and retain their errors in exports; a combined piped shell command can mask an earlier command failure with an overall zero exit code.
- Desktop can combine adjacent search/read operations into one collapsed summary. Click the summary to reveal separate ordered operation rows, and verify exact first-tool names/inputs from JSONL `tool_use` records rather than inferring them from the aggregate label.
- A fresh New composer can show `Context 0` before submission; this is a native UI initialization reading, not evidence that the eventual model request contains zero system/context tokens.
- Clipboard image paste can attach a thumbnail in the Code composer. A PNG source may be natively converted to WebP in the user JSONL image block; verify the actual image pixels/content, not PNG byte equality.
- For native `/compact`, the first Enter can select the command and show optional summarization-instructions placeholder; a second Enter submits it. Confirm the actual `/compact` transcript entry rather than treating menu selection as execution.
- Compaction can expose `compact_boundary.compactMetadata` (`trigger`, `preTokens`, `postTokens`, `durationMs`, `cumulativeDroppedTokens`) plus a compact-summary user record. These transcript-token values are not interchangeable with the footer tooltip's total context; capture/report both separately.
- A compaction summary may be logged without an assistant `message.usage` record. Inspect parent/subagent/diagnostic logs, but report missing request tokens/cost as unknown, not zero; ordinary JSONL accounting can omit this side request.

### Git Bash and native Node interoperability
- Custom subagents (Desktop 2.31226.x): Customize has no agent editor; the native file is `.claude/agents/<name>.md` (ignored when `.gitignore` excludes `.claude/`). Typing `@name` in the Code composer may show no picker; the literal text can still route to the native `Agent` tool with `subagent_type:<name>`. Prove delegation from the parent `Agent` tool_use, the child `<session>/subagents/agent-<id>.jsonl` (isSidechain true, agentId) and a `.meta.json` whose `toolUseId` matches. The parent may rewrite or expand the child task prompt; record that separately from the agent definition.
- Count child usage from the child JSONL assistant records (dedupe message.id globally). The parent `toolUseResult.totalTokens/totalToolUseCount` aggregate is only a cross-check; do not add it as extra requests.
- Native Desktop Bash can expose `rg` even when evaluator PowerShell cannot find it. Verify each surface's actual tool call/output instead of assuming shared PATH availability or installing a replacement preemptively.
- Native Node does not necessarily interpret a Git Bash `/tmp/...` string passed inside JavaScript as the same physical directory used by the shell. Convert directories with `cygpath -m /tmp`, pass the converted path as a script argument, and use `path.join` inside JavaScript.
- Embedded JavaScript backslash literals can lose escaping across the Desktop Bash tool and shell layers, including some heredoc commands. Prefer forward-slash paths and `path.join` over hand-built backslash joins; capture the original failed command and the working recovery separately.
- An API response with data.gov.sg `code:24` / `TOO_MANY_REQUESTS` is an upstream weather rate limit, not a model-gateway budget429. Preserve it, respect its retry interval, and distinguish it from provider-budget errors before deciding whether to stop.
- Desktop markdown tables expose an expand icon near the header; use it to capture a complete wide endpoint table without clipped columns or repeated screenshots.

### Project stdio MCP on Windows

- When this Desktop build lacks a custom stdio form under Settings > Connectors, register a credential-free project `.mcp.json`, then use a fresh task. Verify actual `mcp__<server>__<tool>` records and inputs; the presence of a config or connector screen alone does not establish startup.
- Prewarm a pinned npm server before native validation. Some server CLIs do not implement `--help` and treat it as a database filename; run mandatory help-style prewarm outside the repository, record exit/status/side effects, and confirm readiness with a real Inspector initialize/tools-list handshake. Package npm version and advertised MCP serverInfo version can differ; record them separately.
- A Windows evaluator shell can inherit stale Node/PATH while Desktop resolves the newer installed Node. Refresh only that shell's PATH from Machine + User, then record resolved versions. Inspect safe process executable/command metadata to distinguish the native server from a separately launched Inspector server; never dump process environments.
- Inspector 2.x can use an ad-hoc server card/toggle and one loopback UI port rather than the older proxy form. Select tool definitions and required input fields in the GUI without invoking unrelated writes. In an isolated local evaluator session, authentication omission must be restricted to verified loopback listeners; never expose an unauthenticated Inspector remotely or export proxy tokens.
- A native MCP log may be empty even when the server is operational. Report missing startup detail explicitly; successful raw tool results, GUI initialize/tools-list status and safe live-process metadata are stronger evidence than inferring readiness from a blank log.
- Compare MCP schema objects to independently opened read-only SQLite, and compare answer names/types/constraints to source separately. Account for framework semantics such as Drizzle `.primaryKey()` implying NOT NULL; a naive source-text parser can otherwise invent a constraint mismatch. Distinguish user tables from internal `sqlite_%` tables intentionally excluded by the server.

### Project HTTP MCP and source-citation evidence

- Project `.mcp.json` HTTP definitions (`type: "http"` and `url`) can be picked up by a fresh Local task without restarting Desktop. Try the fresh task first; establish pickup from a successful native `mcp__<server>__<tool>` result with the required inputs, not configuration presence alone. Restart only if needed and authorized.
- Customize > Connectors can represent cloud connectors rather than project-file MCP servers. An empty cloud view is not proof that the project's server is absent.
- Server tool names can differ across versions. Preserve the exact namespace/name from native tool_use records rather than silently converting an observed alias to a familiar tool name.
- Separate contradictions inside one response from conflicts across multiple responses. Preserve the actual claims and the model's reconciliation/qualification; do not invent a second call or send an unapproved follow-up to improve evidence.
- A filename is not a full repository-relative source path or a line citation. Record only references actually returned, and distinguish wiki-backed source descriptions from direct source inspection or executable verification.
- Remote MCP services can have their own internal model requests. If their usage is not exposed, label it unknown/excluded; do not add imagined remote usage to native message.id accounting or assume it is zero.

### Large logs, jq setup and literal backticks

- Typing backticks into the Desktop composer can autoformat them into inline code; copy-back may then lose the markers and gain U+200B. Put the exact prompt on the plain-text clipboard, paste it, and verify copy-back before you submit.
- The native Read tool may reject files larger than its maximum (observed: 2.2MB vs 256KB). Treat a Read failure followed by sampling/scripts as a native recovery and keep it as a tool error.
- If winget is missing, install jq from the binary linked on jqlang.org/download and verify its SHA256 against the linked checksum file. Add its directory to UserPATH through the Windows account environment dialog, then exit Desktop via File > Exit and reopen it from Start. Before the native prompt, confirm that the new Desktop processes include that directory in their PATH. The unauthenticated GitHub API can be rate-limited, but the direct release download still works.
- A course prompt that does not mention jq may not use it; record that, and do not count jq as unavailable.
- On Windows, .NET ReadAllBytes can refuse a logger's open handle. Use a shared-read FileStream or Python binary read rather than stopping the app; read JSONL explicitly as UTF8, not the Windows default CP1252.
- Pino can serialize a plain Error with an overridden name as `err.type="Error"` plus a specific `err.name`. Check name/message/stack when classifying the error; do not require the prototype type to match the business-error name.
- For same-thread stages, preserve distinct full raw snapshots with distinct held filenames. Filter usage to each prompt/end_turn window before aggregation, and deduplicate message.id across windows; count the ROOTid once even when two exports contain it.
- Enable CDP Network before the first action when response bodies are required. Backend request-completed logs can independently prove statuses, but label that provenance rather than claiming a separate browser-network capture.

### Pipeline exit evidence and post-checkpoint state

- A native pipeline can still establish the lint subprocess exit if it immediately records Bash `${PIPESTATUS[0]}` after the pipeline. Distinguish that from an ordinary shell exit or a later trailing command; keep the original first-failure output even when its pipeline masked the exit.
- After a lead-owned fixture removal or checkpoint delta, preserve a fresh filesystem baseline. A native same-thread answer can describe stale fixture state without reading it again; compare the actual before/after paths rather than crediting the narrative claim.
- PowerShell double-quoted embedded Python can reinterpret backticks. Prefer a file-based evidence script or literal quoting when exact native code/config strings contain backticks; keep evaluator quoting failures distinct from native failures.
