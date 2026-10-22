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
| `essay-review` | Runs the three reviews below in order and combines them into one editor's report |
| `essay-architecture-review` | Index-Discussion, fractal structure, section Point placement, key-term coherence |
| `essay-patterns-review` | Constant theme, linking, super theme, theme preview within units |
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
