---
name: essay-review
description: "Full structural review of an essay: runs the discourse architecture, writing patterns, sentence and framing reviews and combines them into one editor's report. Use when asked to review, critique or score an essay or article draft as a whole."
---

# Essay review

Runs the four essay reviewer skills and combines their results.

| Skill | Checks | Score categories |
| --- | --- | --- |
| `essay-architecture-review` | Index-Discussion, fractal structure, section Point placement | `index_discussion`, `fractal_structure`, `section_point_placement` |
| `essay-patterns-review` | Constant theme, linking, super theme, theme preview within units | `information_flow`, `thematic_coherence`, `framing` |
| `essay-sentence-review` | Characters and actions, stress position, key-term consistency, word choice, syntactic clarity | `characters_and_actions`, `stress_position`, `key_term_consistency`, `word_choice`, `syntactic_clarity` |
| `essay-framing-review` | Title, introduction, whole-essay promise, conclusion | `title`, `introduction`, `whole_essay_promise`, `conclusion` |

## Order

Run architecture first: its section map fixes the unit boundaries the patterns review uses, and its announced and unannounced terms supply the sentence review's key-term list. Run sentence after patterns. Framing is independent and can run in parallel with architecture.

## Procedure

1. Apply `essay-architecture-review` to the essay. Keep its section map.
2. Apply `essay-patterns-review` within that section map.
3. Apply `essay-sentence-review`, using the architecture review's announced and unannounced terms as the key-term list.
4. Apply `essay-framing-review` to the title, introduction, promise and conclusion.
5. Combine the four results into one editor's report: scores per category, the strongest evidence, and ordered rewrite steps.

Quote source text exactly. Never paraphrase inside a quote.
