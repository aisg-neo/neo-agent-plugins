---
name: essay-architecture-review
description: "Discourse architecture review. Checks how an essay organizes and connects its argument across levels: whether each unit opens with an Index that frames its Discussion, whether that structure repeats from essay to section to paragraph, and where each section states its Point. Run this before the writing patterns review. Its section map fixes the unit boundaries that review works within."
---

# Discourse architecture review

Checks how an essay organizes and connects its argument across levels: whether each unit opens with an Index that frames its Discussion, whether that structure repeats from essay to section to paragraph, and where each section states its Point.

**When to use:** Run this before the writing patterns review. Its section map fixes the unit boundaries that review works within.

**Score categories:** `index_discussion`, `fractal_structure`, `section_point_placement`

## What to look for

### 1. Index-Discussion
Every unit opens with an Index that gives readers the context for interpreting its Discussion. The Discussion develops what the Index establishes.

### 2. Fractal structure
Index-Discussion repeats across the essay, its sections, and their paragraphs. Each smaller Point governs its own unit and supports the Point above it. The Indexes should form a coherent storyboard when skimmed.

### 3. Section Point placement
A body section states its Point once. By default the Point opens its Index. Placing it at the end of the Discussion is acceptable only when the reader needs preparation first.

## How to review

1. Build the section map. Create body-section units only from visible headings, in source order. Record every unheaded run as an excerpt named "unstructured body", not as a section. Mapping an unheaded run does not establish that the prose has an effective section structure.
2. For each unit record its rhetorical role, its Index (quoted exactly), and its section Point (quoted exactly). Do not put document-level or unstructured-body claims among section Points. Section Index quotes may contain only openings of identifiable body sections.
3. Record the document Index and the skim-test sequence of Indexes and Points.
4. Record announced major terms and any major terms the body introduces without announcement. The sentence review uses them as its key-term list.
5. Review all three categories from exact evidence copied with the source capitalization and punctuation. Never insert ellipses, brackets, or paraphrases into a quote.
6. Provide concrete rewrite steps for material improvements.
7. Return one score per category with the evidence that supports it. Pass the section map on to the writing patterns review.

## Scoring
Choose the description that best matches the whole category and support it with evidence.

### Index-Discussion
- 5: every major unit establishes useful interpretive context and its Discussion fully keeps that promise.
- 4: promises and fulfillment are clear, with limited weakness in one unit.
- 3: the governing relationship is recoverable, but important units are weakly framed or unevenly fulfilled.
- 2: several units misframe or fail to frame their Discussions.
- 1: no coherent Index-Discussion relationship can be recovered.

### Fractal structure
- 5: section Points govern their Discussions and support the essay Point across resolutions; the skim test yields a coherent storyboard.
- 4: the hierarchy and skim story are clear, with limited weakness at one resolution.
- 3: the hierarchy is recoverable, but connections between levels or the skim story are uneven.
- 2: readers must reconstruct how major parts relate to each other and the essay Point.
- 1: no usable hierarchy connects the essay's parts.

### Section Point placement
- 5: every identifiable body-section Point is stated once and easy to locate; each opens its Index unless the reader needs preparation, in which case it closes the Discussion.
- 4: placement is consistently clear, but one Point closes its Discussion when it could have opened the Index, or one placement has another limited weakness.
- 3: several section Points are recoverable but late, repeated, or weakly prepared.
- 2: section Points are routinely buried, duplicated, or disconnected from their units.
- 1: no body sections or section Points can be identified.

## Expected result shape
{
  structure_map: {
    document_index_quote: string | null,
    section_units: [{ unit_id, kind: "section" | "excerpt", heading: string | null, role, index_quote: string | null, point_quote: string | null }],
    skim_sequence: string[],
    announced_terms: string[], unannounced_terms: string[]
  },
  findings: [{ category, evidence: string[], note }],
  recommendations: [{ category, diagnosis, rewrite_steps: string[] }],
  scores: { index_discussion: 1-5, fractal_structure: 1-5, section_point_placement: 1-5 },
  score_reasons: { index_discussion, fractal_structure, section_point_placement }
}

## Worked examples

## Applying the framework to the example essay

### 1. Index-Discussion at different resolutions
- Essay Index: the introduction ends with "Cooling plans should therefore respond to three features of daily experience: where people are exposed, how streets store heat, and when relief is needed." The body develops those three features, then combines them in one journey.
- Section Index: "Heat exposure changes across the day:" frames the four time periods that follow.
- Paragraph Index: "Trees alone cannot interrupt every step in that chain." frames the alternatives developed by the next two sentences.

Bad, mismatched Discussion: keep "Heat exposure changes across the day:" but follow it with a list of roofing materials. The Discussion develops surfaces instead of changes in exposure over time.
Bad, heading without an Index: under "Follow one journey", delete "Imagine a resident leaving home at six in the evening." and begin with the block, junction, road, and park as unrelated observations. The places remain, but the journey no longer establishes how to relate them.

### 2. Fractal structure, the skim test
Reading only the Indexes and Points in order:
"Cooling plans should therefore respond to three features of daily experience: where people are exposed, how streets store heat, and when relief is needed."
then "Shade becomes useful when its location follows people's routines."
then "These changes matter because evening conditions depend partly on what the neighbourhood absorbed earlier."
then "Together, this evidence shows when an intervention must work, not merely where the map looks hottest."
then "The journey reveals where shade, cooler surfaces, and better timing must meet."
then "A useful cooling plan follows that experience."

Bad: replace the "Follow one journey" section with a history of municipal tree planting. The new section interrupts the movement from the three factors to their combined effect on one person.

### 3. Section Point placement
Both sections below close their Discussions with the Point. That is acceptable here because each Point depends on preparation: a concrete case in one, a causal chain in the other.
Good, prepared by a concrete case. Section "Shade the places people cannot avoid". Preparation: the bus-shelter example and the map of unavoidable journeys. Point: "Shade becomes useful when its location follows people's routines."
Good, prepared by a causal chain. Section "Heat remains after the sun moves on". Preparation: "Dark paving absorbs sunlight throughout the afternoon." then "That stored energy warms nearby walls and walkways after sunset." then "The released heat then reaches homes just as residents return for the evening." Point: "These changes matter because evening conditions depend partly on what the neighbourhood absorbed earlier."

Bad, repeated Point: add "Useful shade follows people's routines." directly below the Shade heading while keeping the same Point at the section's end. The conclusion is announced before the example and repeated after it.
Bad reading, wrong resolution: labelling "Cooling plans should therefore respond to three features of daily experience..." as the Shade section Point. That sentence governs the whole essay, not that section.
Bad reading, list item: labelling "Morning: children walk to school as streets begin to warm." as the Averages section Point. It is one time-specific example, not the governing claim.

The examples refer to the worked example essay in [references/example-essay.md](references/example-essay.md); read it when calibrating a review.
