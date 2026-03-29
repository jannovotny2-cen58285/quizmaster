# CI Test Reporting Improvements

## Goal

Add detailed test result export to GitHub Actions CI so flaky test failures can be analyzed after the workflow finishes. Currently the CI produces zero persistent artifacts — all test output is lost when the run ends.

## Current State

### CI Workflow: `.github/workflows/ci.yml`
- Runs on `ubuntu-24.04` in container `ghcr.io/scrumdojo/dev-quizmaster:v4`
- PostgreSQL 16 service container
- Steps: checkout → install → lint → build frontend → backend tests → E2E tests
- No artifact uploads, no test reporters

### Backend Tests: JUnit 5 / Gradle
- Config: `backend/build.gradle.kts`
- Test task config is minimal:
  ```kotlin
  tasks.withType<Test> {
      useJUnitPlatform()
      jvmArgs("-XX:+EnableDynamicAgentLoading")
  }
  ```
- Already produces XML in `backend/build/test-results/test/` and HTML in `backend/build/reports/tests/test/` (Gradle defaults)
- No enhanced logging configured

### E2E Tests: Playwright + Cucumber (playwright-bdd)
- Config: `specs/playwright.config.ts`
- Uses `playwright-bdd` to generate tests from `.feature` files
- **No reporters configured** — only default console output
- **No trace/screenshot/video capture configured**
- 2 workers, chromium only, 20s test timeout, 10s expect timeout

## Implementation Plan (apply one at a time, test each independently)

### Step 1: Gradle Test Logging Enhancement

**File:** `backend/build.gradle.kts`

Add `testLogging` block to the existing `tasks.withType<Test>`:

```kotlin
tasks.withType<Test> {
    useJUnitPlatform()
    jvmArgs("-XX:+EnableDynamicAgentLoading")
    testLogging {
        events("passed", "skipped", "failed")
        showExceptions = true
        showCauses = true
        showStackTraces = true
        exceptionFormat = org.gradle.api.tasks.testing.logging.TestExceptionFormat.FULL
    }
}
```

This makes failure details visible in the Actions console log with zero new dependencies.

### Step 2: Playwright Traces, Screenshots, and Reporters

**File:** `specs/playwright.config.ts`

Add to the `defineConfig` call (top level, not inside projects):

```ts
use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
},
reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
],
```

Note: The `use` block at top level merges with project-level `use` (which already has `browserName`, `baseURL`, `permissions`). The existing project-level config in `projects[0].use` is preserved.

Traces can be viewed with `npx playwright show-trace path/to/trace.zip` or at trace.playwright.dev (runs locally, no upload).

### Step 3: Artifact Upload in CI

**File:** `.github/workflows/ci.yml`

Add after the existing "Run end-to-end tests" step. The `if: always()` is critical — without it, uploads are skipped on test failure (exactly when you need them).

```yaml
    - name: Upload backend test results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: backend-test-results
        path: |
          backend/build/reports/tests/test/
          backend/build/test-results/test/

    - name: Upload E2E test results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: e2e-test-results
        path: |
          specs/playwright-report/
          specs/test-results/
```

Artifacts are downloadable as ZIPs from the workflow run page. Default retention: 90 days.

### Step 4: In-Browser Test Report (GitHub Check)

**File:** `.github/workflows/ci.yml`

Uses `dorny/test-reporter@v2` to render test results directly in the GitHub Actions UI as Check Runs with summary tables and failure annotations. Requires JUnit XML outputs from steps 1 and 2.

Added `permissions` block to the job:
```yaml
jobs:
  build:
    permissions:
      checks: write
      contents: read
      actions: read
```

Added after artifact upload steps:
```yaml
    - name: Publish backend test results
      if: always()
      uses: dorny/test-reporter@v2
      with:
        name: Backend Tests
        path: backend/build/test-results/test/*.xml
        reporter: java-junit

    - name: Publish E2E test results
      if: always()
      uses: dorny/test-reporter@v2
      with:
        name: E2E Tests
        path: specs/test-results/results.xml
        reporter: jest-junit
```

When Vitest is added, include a third reporter step with `reporter: jest-junit`.

## Key Files to Edit

1. `backend/build.gradle.kts` — step 1
2. `specs/playwright.config.ts` — step 2
3. `.github/workflows/ci.yml` — steps 3, 4
