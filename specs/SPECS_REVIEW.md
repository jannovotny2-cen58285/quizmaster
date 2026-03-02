# Feature Files Review (March 2026)

Assessment of `specs/features/` — 38 feature files across `make/` and `take/`.

The `take/` features are in noticeably better shape than the `make/` features. Quiz-taking specs read close to a real domain specification; question creation/editing specs read more like UI automation scripts wrapped in Gherkin.

---

## 1. Deduplicate Feature Names

Every `.feature` file should have a unique, descriptive `Feature:` line. Currently several files share identical names.

**Duplicates found:**
- `Feature: Create Quiz from Workspace` — used in 4 files: `Quiz.CreateNew.feature`, `Quiz.FilterQuestions.feature`, `Quiz.Validations.feature`, `Workspace.CreateQuiz.feature`
- `Feature: Create question GUI` — used in `Question.Create.GUI.feature`, `Question.Create.GUI.Validations.feature`, `Question.Create.GUI.Validations.MultipleChoice.feature`
- `Feature: Edit question GUI` — used in `Question.Edit.GUI.Validations.feature`, `Question.Edit.GUI.Validations.MultipleChoice.feature`
- `Feature: Take a quiz` — used in `Quiz.Flow.feature`, `Quiz.Take.Length.feature`, `QuizRegression.feature`

**Example fix:**
```gherkin
# Quiz.FilterQuestions.feature — before
Feature: Create Quiz from Workspace

# Quiz.FilterQuestions.feature — after
Feature: Filter questions when creating a quiz
```

```gherkin
# Question.Create.GUI.Validations.MultipleChoice.feature — before
Feature: Create question GUI

# after
Feature: Validate multiple choice question on creation
```

---

## 2. Standardize Step Vocabulary

Pick one canonical verb/phrase for each action. Current drift:

| Concept | Variants found |
|---|---|
| Save | `I submit the question` vs `I attempt to save the question` |
| Error check | `I see error messages` vs `I see error messages in quiz form` vs `I see no error messages` vs `I see no error messages in quiz form` |
| Page refresh | `I refresh the page` vs `I refresh page` |
| Start creating | `I start creating a question` vs `I start creating a new quiz` vs `I start creating a workspace` |

**Example fix:**
```gherkin
# before — two different verbs for the same action
When I submit the question
When I attempt to save the question

# after — use "submit" for successful intent, "attempt to submit" for validation testing
When I submit the question          # expects success
When I attempt to submit the question  # expects validation errors
```

```gherkin
# before
Then I see error messages
Then I see error messages in quiz form

# after — unified, context is already clear from the feature
Then I see validation errors
```

---

## 3. Unify Error Identifier Casing

Error identifiers mix kebab-case and camelCase, even within the same domain:

- kebab-case: `empty-question`, `no-correct-answer`, `empty-answer`, `few-correct-answers`
- camelCase: `scoreAboveMax`, `negativeTimeLimit`, `timeLimitAboveMax`

**Example fix — pick one convention (kebab-case to match majority):**
```gherkin
# before
| scoreAboveMax     |
| negativeTimeLimit |
| timeLimitAboveMax |

# after
| score-above-max      |
| negative-time-limit  |
| time-limit-above-max |
```

---

## 4. Rewrite UI-Coupled Steps in Domain Language

The `make/` features in particular describe UI mechanics instead of behavior. The step definitions can still check the same DOM elements — only the Gherkin phrasing needs to change.

**Example — form field assertions:**
```gherkin
# before (UI-speak)
Then I see empty question field
And I see 2 empty answer fields, incorrect, with empty explanations fields, unable to delete
And I see empty question explanation field

# after (domain-speak)
Then I see a blank question form with 2 answer slots
```

**Example — checkbox state:**
```gherkin
# before
Then I see multiple choice is unchecked
When I check show explanations checkbox
Then I see show explanation checkbox is checked

# after
Then the question is set to single choice
When I enable answer explanations
Then answer explanations are visible
```

**Example — button state:**
```gherkin
# before
Then I see the submit button as active
Then I see the submit button as inactive
Then I see buttons "Back, Next"

# after
Then I can submit my answer
Then I cannot submit without selecting an answer
Then I can go back or proceed to the next question
```

**Example — positional references:**
```gherkin
# before
When I mark answer 2 as correct
When I delete answer 2
When I enter answer 1 text "4" and mark it as correct

# after
When I mark "Berlin" as correct
When I remove the answer "Berlin"
When I add answer "4" and mark it as correct
```

---

## 5. Fix Typos

| File | Typo | Fix |
|---|---|---|
| `Question.Take.EasyMode.feature` (lines 3, 17, 31, 44) | "correct ansers" | "correct answers" |
| `Question.Edit.GUI.ShowHideExplanation.feature` | "Kambodia" | "Cambodia" |
| `Quiz.Score.feature:26` | "learing mode" | "learning mode" |
| `Quiz.Timer.feature:24` | "after 1 minutes" | "after 1 minute" |

---

## 6. Fix Copy-Paste Bug in Quiz.Score.Partial.feature

Line 6 of the Background embeds Gherkin syntax inside the question text:

```gherkin
# before (broken — "Given a question" leaked into the cell)
| Planets | Given a question "Which of the following are planets? | Mars (*), Pluto, ...

# after
| Planets | Which of the following are planets? | Mars (*), Pluto, ...
```

---

## 7. Dissolve QuizRegression.feature

`QuizRegression.feature` is a catch-all named after a testing concept, not a domain concept. Its 4 scenarios test:
- Initial question state (no answer selected) → belongs in `Quiz.Flow.feature`
- Page refresh clears selection → belongs in `Quiz.Flow.feature`
- Answer cleared after proceeding → belongs in `Quiz.Flow.feature` or `Quiz.Mode.feature`
- Restarting a completed quiz → belongs in `Quiz.Flow.feature`

**Example — move and rename:**
```gherkin
# before: QuizRegression.feature
Scenario: After page refresh no answer is selected

# after: merged into Quiz.Flow.feature
Scenario: Page refresh clears current answer selection
```

---

## 8. Resolve @skip Scenarios

Two scenarios are `@skip`ped with no indication of when they'll be addressed:

- `Quiz.Flow.feature:138` — "When going back answer is submitted"
- `Quiz.Score.feature:25` — "Quiz score in learing mode"

Either implement them, or delete them and track the work elsewhere (e.g., a backlog item). Dormant `@skip` scenarios become invisible tech debt.

---

## 9. Remove Commented-Out Step

`Question.Take.Explanation.feature:19`:
```gherkin
# Then I see the answer explanation "Naples is the capital of Campania region"
```

This is dead code. Either restore it if the feature exists, or delete it.

---

## 10. Reduce `*` Bullet Overuse

Heavy use of `*` strips the Given/When/Then intent signal, making Arrange/Act/Assert harder to see at a glance.

**Example:**
```gherkin
# before — wall of bullets, hard to see where setup ends and action begins
Given I start creating a question
* I check show explanations checkbox
* I enter question "What are cities of Czech Republic?"
* with answers:
    | Brno | | No Brno |
* I mark answer 2 as correct
When I attempt to save the question
Then I see error messages
    | few-correct-answers |

# after — Given/And for setup, When for action, Then for assertion
Given I start creating a question
  And I enable answer explanations
  And I enter question "What are cities of Czech Republic?"
  And I add answers:
    | Brno | | No Brno |
  And I mark answer 2 as correct
When I attempt to submit the question
Then I see validation errors
    | few-correct-answers |
```

Use `*` sparingly — it's fine for a list of closely related assertions in a Then block, but not as a replacement for Given/And in setup.

---

## Priority Order

For tackling these one at a time, suggested order by impact:

1. **#5 Fix typos** and **#6 Fix copy-paste bug** — quick wins, no design decisions
2. **#9 Remove commented-out step** — trivial cleanup
3. **#1 Deduplicate Feature names** — low effort, high clarity gain
4. **#3 Unify error identifier casing** — mechanical rename
5. **#2 Standardize step vocabulary** — requires agreement on canonical terms
6. **#7 Dissolve QuizRegression.feature** — move scenarios to proper homes
7. **#8 Resolve @skip scenarios** — decide: implement or delete
8. **#4 Rewrite UI-coupled steps** — biggest effort, biggest payoff
9. **#10 Reduce `*` bullet overuse** — stylistic, do alongside other refactors
