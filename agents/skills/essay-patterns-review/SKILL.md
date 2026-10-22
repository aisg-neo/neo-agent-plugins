---
name: essay-patterns-review
description: "Writing patterns review. Checks how paragraphs and clauses organize ideas: whether each substantive unit has an Index that frames its Discussion, and whether Topic-Comment movement follows a recognizable pattern. Use after the discourse architecture review. Its section map supplies the unit boundaries this review works within. Headings and surrounding sections count as context."
---

# Writing patterns review

Checks how paragraphs and clauses organize ideas: whether each substantive unit has an Index that frames its Discussion, and whether Topic-Comment movement follows a recognizable pattern.

**When to use:** Use after the discourse architecture review. Its section map supplies the unit boundaries this review works within. Headings and surrounding sections count as context.

**Score categories:** `information_flow`, `thematic_coherence`, `framing`

## Structure
Within a paragraph, an Index establishes the point, relationship, or key terms that a Discussion develops. At clause level, the Topic is the starting information and the Comment adds new information. An Index may be a clause or sentence. The point may close the Index or, after preparation, close the Discussion. It is stated once.

Paragraphs can also connect locally when one paragraph's Comment supplies the next paragraph's Topic. Key terms may continue through repetition, synonyms, and pronouns.

## The four patterns

1. Constant theme: the same element appears as the Topic in successive clauses. Each Comment adds new information about it.
   Good: "The flask keeps water warm. It fits in a pocket. It has a sealed lid."
   Bad: "Warmth is retained by the flask. A pocket can hold it. Its lid has a seal." The focal element moves out of Topic position.

2. Linking: a Comment introduces relevant new information that the next clause picks up as its Topic before adding another Comment. The chain continues developing the unit's established point or relationship.
   Good: "A sensor emits a pulse. The pulse reaches a switch. The switch starts the pump."
   Bad: "A sensor emits a pulse. The switch starts the pump. The pulse lasts one second." New information is not picked up by the next Topic.

3. Super theme: a unit's Index establishes a whole activity, category, claim, or relationship. The Discussion develops its stages, parts, aspects, or evidence as later Topics. The Index need not enumerate them. An opening item may both supply the first instance and establish the relationship that frames the rest.
   Good: "Engineers can see damage in an aging bridge. Corrosion has weakened the bolts. Sensors record movement. Load tests reveal flexing."
   Bad: "Corrosion has weakened the bolts. Sensors record movement. Load tests reveal flexing." The evidence lacks a local claim that establishes its relationship.

4. Theme preview: a paragraph's Index previews key terms that later clauses or sentences pick up in the same order.
   Good: "A login has two checks: identity and permission. Identity confirms the user. Permission controls access."
   Bad: "A login has two checks: identity and permission. Permission controls access. Identity confirms the user." The Discussion reverses the previewed order.

## How to review

Treat the four patterns as the standard for well-organized substantive units. A substantive unit is the smallest contiguous span that develops one point, relationship, sequence, category, or body of evidence. It may be one paragraph, several adjacent paragraphs, a list with its framing paragraph, or a clause group within a long paragraph. Do not require each paragraph inside a larger unit to instantiate its own pattern. Patterns may operate at different resolutions and may nest inside one another. A passage does not earn full credit merely because its meaning is understandable.

1. Start from the architecture review's section map as the primary unit boundaries. Within each unit, identify genuine transitions, asides, captions, or labels as non-substantive.
2. For each substantive unit, examine the Index-Discussion relationship, Topic-Comment movement, thematic strings, and connection to adjacent units.
3. Decide which pattern or mixture the unit's purpose calls for, whether the prose sustains it, and where a missing or broken pattern weakens the writing.
4. A relevant heading can serve as the Index and establish a super theme or theme preview. Do not demand a sentence that merely repeats it.
5. For super theme, infer the relationship from the continuing thematic string. An opening claim can frame later evidence without calling it evidence or enumerating it.
6. A successfully sustained pattern organizes the unit even when a different pattern could also have been used. Once a supported pattern coherently organizes the whole Discussion, return no recommendation for that unit. Do not recommend replacing or adding a pattern unless the current organization is absent or broken.
7. Recognize linking only as one uninterrupted chain with two successive Comment-to-Topic handoffs across three consecutive sentences or paragraphs. A chain within two sentences, or separate handoffs with gaps, is insufficient.
8. When a unit lacks an effective pattern, recommend the pattern that would best organize it. Do not excuse unpatterned development because the sentences are individually clear.
9. Judge local pattern execution independently of the architecture and framing scores.

### Unit dispositions
Give every substantive unit exactly one:
- supported: a finding directly demonstrates its organizing pattern. Quote the passages that show it and explain their relationship.
- inherits_pattern: an ancestor unit's supported pattern governs it. Name the ancestor.
- needs_pattern: a recommendation names the pattern the unit should follow. Every such unit must appear in a recommendation.

Group units into one recommendation only when the same diagnosis and ordered rewrite apply. Evidence must be contiguous source excerpts of at most 20 words. Use an empty list when a missing frame is the evidence. Every score reason must name the relevant patterns and units.

## Scoring
Score each dimension independently by choosing the description that best matches the evidence. A minor problem is a localized break in an otherwise sustained pattern. A major problem leaves a substantive unit without the pattern needed to organize its development. Base scores on how consistently the essay follows the framework, not on general readability.

### Information flow
Execution of constant theme and linking wherever ideas must stay anchored or move through a sequence.
- 5: units consistently sustain an appropriate constant-theme or linking progression; transitions preserve those progressions across adjacent units.
- 4: one localized Topic shift or broken handoff weakens an otherwise sustained progression.
- 3: one unit lacks the progression its development requires, or several local breaks interrupt it.
- 2: several units lack a usable progression, forcing readers to reconstruct how sentences connect.
- 1: Topic-Comment movement provides no recoverable path through the ideas.

### Thematic coherence
Whether super theme and theme preview establish the thematic strings their Discussions develop, and whether constant themes remain stable inside them.
- 5: units consistently establish and sustain the appropriate thematic pattern; previewed or implied parts are developed in a coherent order.
- 4: one thematic string weakens, changes label, or departs briefly from its established pattern.
- 3: one unit lacks a needed super theme or theme preview, or several strings drift enough to disrupt development.
- 2: several units present parts, examples, or parallel ideas without patterns that establish their relationship.
- 1: no stable thematic organization for substantive units.

### Framing
Whether each Index establishes the pattern its Discussion follows, and whether patterns mix or nest coherently.
- 5: each unit has an Index that establishes its organizing pattern, and its Discussion fulfills it; mixed or nested patterns remain clear.
- 4: one Index weakly establishes an otherwise successful pattern, or one local boundary is slightly unclear.
- 3: one unit's Index fails to establish the pattern its Discussion needs, or several Index-Discussion relationships are only partly fulfilled.
- 2: several units are framed by Indexes that do not establish their actual development patterns.
- 1: most units lack a usable Index-pattern-Discussion relationship.

## Expected result shape
{
  units: [{
    unit_id, kind: "section" | "paragraph_group" | "excerpt", parent_unit_id: string | null,
    span: string, index_present: boolean, index_quote: string | null,
    disposition: "supported" | "inherits_pattern" | "needs_pattern",
    pattern: "constant_theme" | "linking" | "super_theme" | "theme_preview" | null,
    pattern_source_unit_id: string | null, evidence: string[], note
  }],
  recommendations: [{ unit_ids: string[], pattern, diagnosis, rewrite_steps: string[] }],
  scores: { information_flow: 1-5, thematic_coherence: 1-5, framing: 1-5 },
  score_reasons: { information_flow, thematic_coherence, framing }
}

## Worked examples

## Choosing the right resolution
Good: "Heat can be reduced through surface changes. Lighter roofs reflect energy, planted ground replaces exposed paving, and permeable surfaces retain water. Together, these changes reduce stored heat." The three coordinated changes jointly develop the super theme. Clause-level development is valid.
Bad: treat the three surface changes as separate units that each need their own pattern.

Good: a section develops its claim through an example paragraph and a paragraph explaining the example's consequences.
Bad: demand a separate pattern from the explanatory paragraph merely because a blank line precedes it. Its role must be judged within the section's complete development.
