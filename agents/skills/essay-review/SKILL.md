---
name: essay-review
description: "Full structural review of an essay: runs the discourse architecture, writing patterns and framing reviews and combines them into one editor's report. Use when asked to review, critique or score an essay or article draft as a whole."
---

# Essay review

Runs the three essay reviewer skills and combines their results.

| Skill | Checks | Score categories |
| --- | --- | --- |
| `essay-architecture-review` | Index-Discussion, fractal structure, section Point placement, key-term coherence | `index_discussion`, `fractal_structure`, `section_point_placement`, `key_term_coherence` |
| `essay-patterns-review` | Constant theme, linking, super theme, theme preview within units | `information_flow`, `thematic_coherence`, `framing` |
| `essay-framing-review` | Title, introduction, whole-essay promise, conclusion | `title`, `introduction`, `whole_essay_promise`, `conclusion` |

## Order

Run architecture first: its section map fixes the unit boundaries the patterns review uses. Framing is independent and can run in parallel with architecture.

## Procedure

1. Apply `essay-architecture-review` to the essay. Keep its section map.
2. Apply `essay-patterns-review` within that section map.
3. Apply `essay-framing-review` to the title, introduction, promise and conclusion.
4. Combine the three results into one editor's report: scores per category, the strongest evidence, and ordered rewrite steps.

Quote source text exactly. Never paraphrase inside a quote.
