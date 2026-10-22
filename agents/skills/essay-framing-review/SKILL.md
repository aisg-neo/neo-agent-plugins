---
name: essay-framing-review
description: "Essay framing review. Checks how an essay frames and delivers its value to a cold reader: the title, the introduction's motivation, the promise the opening makes, and whether the conclusion returns to and resolves that promise. Use on a complete draft with a title, an introduction, body, and conclusion. Runs independently of the other reviewers."
---

# Essay framing review

Checks how an essay frames and delivers its value to a cold reader: the title, the introduction's motivation, the promise the opening makes, and whether the conclusion returns to and resolves that promise.

**When to use:** Use on a complete draft with a title, an introduction, body, and conclusion. Runs independently of the other reviewers.

**Score categories:** `title`, `introduction`, `whole_essay_promise`, `conclusion`

## What to look for

### 1. Title
A title should orient a cold reader and create relevant curiosity. If it names key concepts, the essay should develop them.

### 2. Introduction
An introduction motivates the essay through Common Ground, then Problem, then Solution. Common Ground states the reader's status quo fairly. The Problem destabilizes it and establishes the cost. The Solution presents the essay's Point as valuable because it resolves that problem.

### 3. Whole-essay promise
The opening promises a Point and key concepts. The body should fulfill that promise.

### 4. Conclusion
A conclusion returns to the opening problem, shows how the Point resolves it, and carries the resolution into a broader question or conversation.

## How to review

1. Map the structure. Record the exact source sentence that ends the introduction, starts the body, and starts the conclusion. Use null where a boundary is unclear.
2. Review all four categories from exact evidence. Copy quotes with the source capitalization and punctuation. Never insert ellipses, brackets, or paraphrases into a quote.
3. Recommend only material improvements, each with concrete rewrite steps.
4. Return one score per category with the evidence that supports it.

## Scoring
Choose the description that best matches the whole category and support it with evidence.

### Title
- 5: clear to cold readers, creates relevant curiosity, sets accurate expectations, and links named concepts forward.
- 4: clear and aligned, with limited weakness in curiosity, precision, or forward linkage.
- 3: names the topic but gives little sense of the problem, Point, or destination.
- 2: cryptic, vague, or misleading until the essay is read.
- 1: missing or establishes the wrong expectations.

### Introduction
- 5: a fair status quo, destabilization, reader-relevant cost, and Solution form a persuasive sequence.
- 4: the sequence motivates clearly, but one move is compressed, generic, or weakly connected.
- 3: a problem and Point are recoverable, but the value of the Point remains partly implicit.
- 2: mostly arranges information; a crucial motivational function is absent.
- 1: no identifiable problem-solution motivation or governing Point.

### Whole-essay promise
- 5: the body fully develops the Point and announced key terms, producing the promised change in the reader's understanding.
- 4: the promise is clear and substantially kept, with limited drift or underdevelopment.
- 3: the main promise is recoverable, but important body material or promised concepts connect weakly.
- 2: the body substantially departs from or fails to deliver the opening promise.
- 1: no usable promise connects the opening and body.

### Conclusion
- 5: returns to the opening problem, demonstrates its resolution, and moves to a meaningful broader conversation.
- 4: provides resolution and forward movement, with one underdeveloped element.
- 3: closes intelligibly but mainly summarizes, reconnects weakly, or offers little forward movement.
- 2: does not show how the Point resolves the opening problem.
- 1: absent or replaced by an abrupt stop, procedure, or unrelated call to action.

## Expected result shape
{
  structure_map: { introduction_end: string | null, body_start: string | null, conclusion_start: string | null },
  findings: [{ category, evidence: string[], note }],
  recommendations: [{ category, diagnosis, rewrite_steps: string[] }],
  scores: { title: 1-5, introduction: 1-5, whole_essay_promise: 1-5, conclusion: 1-5 },
  score_reasons: { title, introduction, whole_essay_promise, conclusion }
}

## Worked examples

## Applying the framework to the example essay

### 1. Title
Good: "Why a Cooler City Needs More Than More Trees"
Bad: "Urban Heat". It names the subject but hides the challenge to tree-counting that drives the essay.

### 2. Introduction
Good:
- Common Ground: "Planting trees is one of the most visible ways a city can respond to hotter weather. Trees provide shade, cool the air, and make dense neighbourhoods more pleasant."
- Problem and cost: "Yet a canopy target says little about whether people can escape the heat." through "A city can meet its planting target while leaving the most difficult parts of the day unchanged."
- Solution: "Cooling plans should therefore respond to three features of daily experience: where people are exposed, how streets store heat, and when relief is needed."

Bad, Background then Thesis: "Cities have planted trees for centuries. Modern cities should continue planting them." Supplies history and a claim but removes the misleading canopy target and the exposure problem.
Bad, General then Specific: "Climate change affects cities. Heat is one effect. This essay discusses urban trees." Narrows its topic without showing why the reader needs a different way to plan cooling.
Bad, Gap then Niche: "Few local reports compare bus shelters with planted verges. This essay compares them." Identifies a research niche without establishing the consequence of ignoring daily heat exposure.
Bad, decorative hook: "At sunset, the pavement glows beneath a copper sky." Attracts attention but does not establish the reader's reasonable belief, the problem with it, or the proposed response.

### 3. Whole-essay promise
Good: "where people are exposed, how streets store heat, and when relief is needed" is developed by the sections "Shade the places people cannot avoid", "Heat remains after the sun moves on", "Averages hide the difficult hours", and "Follow one journey". The journey section combines the three promised concepts in one resident's route rather than adding a fourth parallel factor.
Bad: keep the introduction, but replace the body with sections on tree species, procurement rules, and annual maintenance budgets. The body concerns urban trees but does not develop exposure, stored heat, or timing.

### 4. Conclusion
Good: "Tree planting remains valuable, but residents do not experience heat as a canopy total. They experience it on particular journeys, beside particular surfaces, at particular times." through "Its success is measured by whether people can move, wait, work, and rest more safely through a hotter day."
Bad: "Cities can add shelters, reflective roofs, and sensors. These measures can reduce heat." Summarizes interventions without returning to the opening weakness of canopy totals or defining success through lived experience.

The examples refer to the worked example essay in [references/example-essay.md](references/example-essay.md); read it when calibrating a review.
