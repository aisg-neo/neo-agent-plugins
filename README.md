# Agent Plugins

This repository holds agent plugin setups, organized with one folder per harness (for example, `devin/`).

| Folder | Contents |
| --- | --- |
| `agents/` | Harness-neutral skills (`agents/skills/<name>/SKILL.md`). Also the Codex plugin: `agents/plugin.json` is the portable [agent-plugins](https://agent-plugins.org) manifest |
| `claude/` | Claude Code plugin; `claude/skills` is a symlink to `agents/skills` |
| `devin/` | Devin plugin (Project Neo evaluation skills) |

Edit skills only in `agents/skills/`. Claude Code follows the `claude/skills` symlink when it installs. Codex doesn't follow symlinks when it copies a plugin, so its marketplace points at `agents/` directly.

## Writer plugin

Essay review skills converted from the Executor Writer app:

| Skill | Checks |
| --- | --- |
| `essay-review` | Runs the four reviews below in order and combines them into one editor's report |
| `essay-architecture-review` | Index-Discussion, fractal structure, section Point placement |
| `essay-patterns-review` | Constant theme, linking, super theme, theme preview within units |
| `essay-sentence-review` | Characters and actions, stress position, key-term consistency, word choice, syntactic clarity |
| `essay-framing-review` | Title, introduction, whole-essay promise, conclusion |

### Install in Claude Code

```
/plugin install writer --marketplace aisg-neo/neo-agent-plugins
```

or `claude plugin marketplace add aisg-neo/neo-agent-plugins` then `claude plugin install writer@neo-agent-plugins`.

### Install in Codex

```
codex plugin marketplace add aisg-neo/neo-agent-plugins
codex plugin add writer@neo-agent-plugins
```

### Other harnesses

Any harness that reads Agent Skills can load the folders in `agents/skills/` directly.

## Evals

`evals/` holds [promptfoo](https://promptfoo.dev) checks on how the essay skills score. Each case in `evals/cases/` is the example essay with one thing broken, such as a key term renamed partway through. The broken category should score lower, and unrelated categories should stay high.

Every case runs three ways:

| Provider | How the skill is used | Model access |
| --- | --- | --- |
| `claude-code` | Claude Code loads the plugin from `claude/` and runs `/writer:<skill>` | Your normal Claude Code setup |
| `codex` | Codex finds the skills in a copied `.agents/skills/` folder and runs `$<skill>` | Your normal Codex setup (`~/.codex/config.toml`) |
| `raw-api` | The skill text is the system prompt, so a failure here points at the instructions, not a harness | `google/gemini-3.8-flash` through Vercel AI Gateway |

The gateway key for `raw-api` is `AI_GATEWAY_API_KEY` in the Infisical project `dev-server-1` (`dev` environment, `/skills` folder).

```
cd evals
npm install
npx infisical login
npm run eval
```

Add `-- --filter-providers codex` to run one provider, or `-- --repeat 3` to check that scores are stable.

Results of every run are saved locally in `~/.promptfoo/promptfoo.db`:

- `npm run summary` prints the latest run as a table: pass or fail, provider, case, scores, and which check failed.
- `npm run list` lists past runs; `npm run summary -- <eval id>` prints one of them.
- `npm run view` opens the promptfoo web viewer on port 15500 for full outputs.
