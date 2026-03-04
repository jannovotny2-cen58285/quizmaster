---
name: code-review
description: Review the codebase for quality issues, patterns, and improvements. Use when the user asks to "review the code", "code review", "check code quality", or "audit the codebase".
allowed-tools: Read, Glob, Grep, Bash(git diff:*), Bash(git log:*), Bash(git rev-parse:*), Bash(deno task test:*), Bash(find:*)
argument-hint: [scope] — empty for full codebase, a path (e.g. "backend"), or "branch" for current branch changes
---

# Code Review

Perform a read-only code review of this project. Never modify any files.

## Step 1: Determine Scope

Parse the invocation argument to decide what to review:

- **No argument** — review the entire codebase (all source and test files).
- **`branch`** — review only changes on the current branch vs `main`. Run `git diff main...HEAD` and `git log --oneline main..HEAD` to identify changed files and their diffs. Only review those files.
- **Any other argument** — treat it as a path relative to the project root. Review files under that path.

## Step 2: Read Project Conventions

Read `CLAUDE.md` to understand the project's architecture, tech stack, and codestyle rules. Use these as the baseline for the review — flag deviations from the project's own standards, not generic best practices.

## Step 3: Gather Code

Read all source files (`.ts`, `.tsx`, `.scss`) and test files in scope. For large scopes, prioritize reading files in this order:

1. Type definitions and shared code
2. Core logic (pipeline, extraction, API routes)
3. UI components and pages
4. Tests
5. Configuration files

## Step 4: Run Tests

Run `deno task test` from the backend directory to check current test status. Note any failures.

## Step 5: Produce the Review

Output the review directly in the conversation using this structure:

```
## Code Review: <scope description>

### Good Patterns
Bullet list of things already done well — established patterns, good abstractions, clean code.

### Issues
Bullet list of problems found. For each issue:
- **What**: describe the problem concretely (reference files/lines)
- **Why it matters**: one sentence on the impact

Categories to check:
- Anti-patterns
- Inconsistencies (naming, structure, style deviations from CLAUDE.md)
- Duplication (repeated logic that should be shared)
- Ambiguous or misleading names
- Abstraction problems (too much or too little)

### Test Coverage
- What is tested and how well
- What is missing test coverage
- Quality observations about existing tests

### Suggestions
Numbered list of actionable improvements. Each suggestion:
1. **<Short title>** — <what to change>. <why it matters>. *Plan: <1-3 sentence implementation approach>.*
```

## Rules

1. **Never modify files.** This is a read-only review.
2. **Be proportionate.** This is an MVP — flag real problems, not theoretical purity issues. Do not suggest adding types, comments, or docs to working code unless there is a concrete problem.
3. **Be specific.** Reference file paths and line numbers. Do not make vague observations.
4. **Every suggestion must be independently actionable.** Each one can be tackled as a standalone task without requiring the others.
5. **Keep it concise.** Findings and evidence, not essays.
