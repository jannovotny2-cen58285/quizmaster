# AI Coding Instructions for Quizmaster

This guide helps AI agents understand Quizmaster's architecture, development practices, and code patterns.

## Architecture Overview

**Monorepo with integrated frontend-backend:**
- **Frontend:** React 19 SPA (TypeScript, Vite) → builds to `backend/src/main/resources/static/`
- **Backend:** Spring Boot 3 REST API + frontend server (Java 21, Gradle, Lombok, JPA/Hibernate)
- **Database:** PostgreSQL (Flyway migrations in `backend/src/main/resources/db/migration/`)
- **Testing:** Cucumber + Playwright for BDD E2E tests (`specs/` package)

**Key insight:** Frontend must be built with `pnpm build` before running backend—changes don't auto-reflect.

## Domain Model (Three Entities)

1. **Question** (`question/` package): `id`, `editId` (UUID for editing), `question`, `answers[]`, `correctAnswers[]`, `answerExplanations[]`, `workspaceGuid`
2. **Workspace** (`workspace/` package): `guid` (UUID), `title`
3. **Quiz** (`quiz/` package): `id`, `title`, `questionIds[]` (int array), `mode` (EXAM/LEARN), `passScore`, `timeLimit`, `finalCount` (randomizes to N questions), `workspaceGuid`

## Development Workflow

```bash
# Setup
cd frontend && pnpm install
cd specs && pnpm ci:install

# Development (recommended - HMR enabled)
cd backend && ./gradlew bootRun          # :8080
cd frontend && pnpm dev                   # :5173 (proxies /api to :8080)

# Production flow
cd frontend && pnpm build
cd backend && ./gradlew bootRun          # :8080

# Tests
cd specs && pnpm test:e2e                # Against :8080
cd specs && pnpm test:e2e:vite           # Against :5173 (dev)
```

## Backend Patterns

**Package structure:** Each domain entity (question, quiz, workspace) has its own package with `Entity`, `Repository`, `Controller`, `DTO` classes.

**API DTOs:** Separate read DTOs from entity classes:
- `QuestionCreateResponse`: `{id, editId}` returned from POST
- `QuizResponse`: Complete quiz data for GET
- `QuizListItem`, `QuestionListItem`: Lightweight list responses

**Error handling in controllers:** Currently minimal—add validation errors as needed (see `validateQuizForm` frontend pattern).

**Entity relationships:**
- Quiz stores `int[] questionIds` (array)—plan: refactor to M:N junction table
- Question uses `editId` UUID for edit links (no auth needed)

## Frontend Patterns

**API calls:** Use helper functions in `/frontend/src/api/`:
```typescript
export const postQuiz = async (quiz: QuizCreateRequest) =>
  await postJson<QuizCreateRequest, string>('/api/quiz', quiz)
```

**Error handling:** `tryCatch` helper sets error state:
```typescript
const onSubmit = (data: QuizCreateFormData) =>
  tryCatch(setErrorMessage, async () => {
    const quizId = await postQuiz(data)
    setQuizId(quizId)
  })
```

**Data fetching:** `useApi` hook for automatic fetching:
```typescript
useApi(workspaceGuid, fetchWorkspaceQuestions, setWorkspaceQuestions)
```

**Form validation:** Separate validation files (`validations.ts`) with `validateQuizForm()` returning errors object.

**State management:** Use React hooks (`useState`, `useStateSet` for Set state). Avoid Redux—keep it simple.

## Testing Patterns (BDD)

**Page Objects:** Located in `specs/src/pages/` with constructor-injected `page: Page`. Methods return `Locator` or `Promise<string>`:
```typescript
export class QuizCreatePage {
  constructor(private page: Page) {}
  enterQuizName = (title: string) => this.page.locator('#quiz-title').fill(title)
  submit = () => this.page.locator('button[type="submit"]').click()
}
```

**Step definitions:** In `specs/src/steps/` organized by domain (quiz/*, question/*, workspace/*). Use regex or string patterns:
```typescript
When('I enter quiz name {string}', async function (title: string) {
  await this.quizCreatePage.enterQuizName(title)
})
```

**World object:** `QuizmasterWorld` holds page objects and bookmarks for test data reuse.

**Bookmarking pattern:** Store created entities in `world.quizBookmarks[name]` for reference across scenarios.

**Feature tags:** `@feature-flag` skips tests unless `FEATURE_FLAG=true` env var.

## Key Files Reference

- **Backend entities:** `backend/src/main/java/cz/scrumdojo/quizmaster/{quiz,question,workspace}/`
- **Frontend components:** `frontend/src/pages/{make,take}/`
- **E2E tests:** `specs/features/*.feature` and `specs/src/steps/`
- **Database:** `backend/src/main/resources/db/migration/V*.sql`
- **Configuration:** `backend/src/main/resources/application.properties`

## Known Constraints

1. **No PUT endpoint yet:** Frontend has `putQuiz()` but backend `QuizController` only has POST—implement PUT if needed
2. **Int array for questionIds:** Refactor to proper M:N table to add referential integrity
3. **No authentication:** `editId` UUID used as pseudo-auth for questions
4. **Standalone questions:** Kept for backward compatibility; consider deprecation

## Testing Philosophy

- **Trunk-based development:** All work on `master`
- **Test-first:** Write E2E Gherkin specs before code
- **Thin slices:** Minimal incremental features tested end-to-end
- **Page objects:** Encapsulate all DOM interaction; locators as lazy properties

---

**For detailed tutorials on BDD patterns, test data management, and page object design, see `docs/tutorial/`.**
