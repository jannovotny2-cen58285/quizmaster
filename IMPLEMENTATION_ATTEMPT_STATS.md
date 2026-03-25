# Quiz Attempt Statistics - Implementation Summary

## Overview
Successfully implemented a complete database-backed solution for storing and tracking quiz attempt statistics, replacing the previous sessionStorage-based implementation.

## Database Schema

### New Table: `attempt`
Created via migration `V00038__create_attempt_table.sql`

```sql
CREATE TABLE attempt (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL,
    points NUMERIC(10, 2) NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    max_score INTEGER NOT NULL,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP,
    CONSTRAINT fk_quiz FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('FINISHED', 'IN_PROGRESS', 'TIMEOUT'))
);
```

**Key Fields:**
- `duration_seconds`: Total time spent on quiz (in seconds)
- `points`: Actual points earned (decimal, e.g., 2.5)
- `score`: Percentage score (0-100)
- `status`: FINISHED | IN_PROGRESS | TIMEOUT
- `max_score`: Maximum achievable points for the quiz
- Foreign key to `quiz` table with CASCADE delete

## Backend Implementation

### Package: `cz.scrumdojo.quizmaster.attempt`

**Created Files:**
1. **`AttemptStatus.java`** - Enum for attempt status (FINISHED, IN_PROGRESS, TIMEOUT)
2. **`Attempt.java`** - JPA Entity with Lombok annotations
3. **`AttemptRepository.java`** - JPA Repository with custom query `findByQuizIdOrderByStartedAtDesc`
4. **`AttemptRequest.java`** - DTO for creating/updating attempts
5. **`AttemptResponse.java`** - DTO for API responses with `fromEntity()` mapper
6. **`AttemptController.java`** - REST controller with full CRUD operations

### API Endpoints

```
GET    /api/attempt/quiz/{quizId}  - Get all attempts for a quiz (sorted by most recent)
GET    /api/attempt/{id}           - Get a specific attempt
POST   /api/attempt                - Create a new attempt
PUT    /api/attempt/{id}           - Update an existing attempt
DELETE /api/attempt/{id}           - Delete an attempt
```

## Frontend Implementation

### Updated Files

1. **`frontend/src/model/stats.ts`**
   - Added `AttemptStatus` enum
   - Updated `StatsRecord` interface to match backend structure:
     - Added: `quizId`, `durationSeconds`, `points`, `status`
     - Changed: `started` → `startedAt`, `finished` → `finishedAt`
     - Removed: `timedOut` (replaced by `status`)
   - Added `AttemptRequest` interface

2. **`frontend/src/api/helpers.ts`**
   - Added `getJson` export (alias for `fetchJson`)

3. **`frontend/src/api/stats.ts`**
   - Replaced sessionStorage logic with backend API calls
   - Added `createAttempt()` - POST new attempt
   - Added `updateAttempt()` - PUT existing attempt
   - Updated `fetchStats()` - GET from `/api/attempt/quiz/{quizId}`
   - Kept `putStats()` for backward compatibility (deprecated)

4. **`frontend/src/pages/take/quiz-take/quiz-welcome/quiz-welcome-page.tsx`**
   - Quiz start now creates an attempt in database with status `IN_PROGRESS`
   - Stores attempt ID in sessionStorage for later updates
   - **Stores start timestamp (milliseconds) in sessionStorage to avoid timezone issues**

5. **`frontend/src/pages/take/quiz-take/quiz-take-page.tsx`**
   - Quiz completion updates the attempt with:
     - Calculated `durationSeconds` using sessionStorage start time (avoids timezone conversion)
     - Actual `points` earned (not percentage)
     - Final `score` (percentage 0-100)
     - Status: `FINISHED` or `TIMEOUT`
   - **Fixed timezone bug**: Duration now calculated using client-side timestamps only

6. **`frontend/src/pages/make/quiz-stats/quiz-stats-component.tsx`**
   - Updated to use new data structure
   - Duration now calculated from `durationSeconds` field (not timestamps)
   - Points displayed directly from `points` field
   - Status filtering uses `status` enum values
   - **Added Status column** to attempts table showing FINISHED/IN_PROGRESS/TIMEOUT

## Data Flow

### Quiz Start
```
User clicks "Start Quiz"
  ↓
Frontend creates attempt:
  {
    quizId,
    status: IN_PROGRESS,
    startedAt: now,
    durationSeconds: 0,
    points: 0,
    score: 0,
    maxScore: 0
  }
  ↓
POST /api/attempt
  ↓
Backend saves to database
  ↓
Returns attempt with ID
  ↓
Frontend stores:
  - Attempt ID in sessionStorage
  - Start timestamp (ms) in sessionStorage (for duration calc)
```

### Quiz Completion
```
User finishes quiz
  ↓
Frontend retrieves start time from sessionStorage
  ↓
Frontend calculates:
  - durationSeconds (current time - stored start time)
  - points (actual score)
  - score (percentage)
  - status (FINISHED/TIMEOUT)
  ↓
PUT /api/attempt/{id}
  ↓
Backend updates database
  ↓
Cleanup: Remove start time from sessionStorage
```

### View Statistics
```
Navigate to Statistics page
  ↓
GET /api/attempt/quiz/{quizId}
  ↓
Backend fetches all attempts
  ↓
Frontend displays in table
```

## Key Design Decisions

1. **Separate `points` and `score` fields**
   - `points`: Actual decimal points earned (e.g., 2.5 out of 4)
   - `score`: Percentage (0-100) for easy display
   - `maxScore`: Total possible points

2. **Duration stored as seconds (INTEGER)**
   - Simpler calculations
   - Easy to format in frontend (seconds/minutes/hours)
   - Avoids timestamp arithmetic in display logic
   - **Calculated client-side** using sessionStorage timestamps to avoid timezone conversion issues

3. **Status enum instead of boolean flag**
   - More expressive (FINISHED vs TIMEOUT vs IN_PROGRESS)
   - Room for future statuses (ABANDONED, PAUSED, etc.)

4. **Cascade delete on quiz**
   - When a quiz is deleted, all attempts are automatically removed
   - Maintains referential integrity

5. **Backward compatibility**
   - Kept `putStats()` function for any existing code
   - Gradually migrate to new `createAttempt()`/`updateAttempt()` pattern

## Testing Checklist

Before deploying, verify:

- [ ] Database migration runs successfully
- [ ] Start a quiz - attempt created with IN_PROGRESS status
- [ ] Complete a quiz - attempt updated with FINISHED status
- [ ] Timeout a quiz - attempt updated with TIMEOUT status
- [ ] Statistics page displays all attempts correctly
- [ ] Duration, points, and percentage calculations are accurate
- [ ] Deleting a quiz cascades to delete attempts

## Next Steps (Optional Enhancements)

1. Add pagination for attempts (if many attempts per quiz)
2. Add filtering/sorting in statistics UI (by date, score, status)
3. Export statistics to CSV/Excel
4. Add aggregated statistics (average score, completion rate, etc.)
5. Add user tracking (requires authentication implementation)
6. Add attempt history graph/chart visualization

## Build Status

✅ **Backend**: Compiles successfully (`gradlew build`)
✅ **Frontend**: Builds successfully (`pnpm build`)
✅ **TypeScript**: Type-checks pass (`pnpm code:tsc`)

## Files Modified/Created

**Backend (Java):**
- `backend/src/main/java/cz/scrumdojo/quizmaster/attempt/` (new package, 6 files)
- `backend/src/main/resources/db/migration/V00038__create_attempt_table.sql` (new)

**Frontend (TypeScript):**
- `frontend/src/model/stats.ts` (modified)
- `frontend/src/api/stats.ts` (modified)
- `frontend/src/api/helpers.ts` (modified)
- `frontend/src/pages/make/quiz-stats/quiz-stats-component.tsx` (modified)
- `frontend/src/pages/take/quiz-take/quiz-take-page.tsx` (modified)
- `frontend/src/pages/take/quiz-take/quiz-welcome/quiz-welcome-page.tsx` (modified)

---

**Implementation Date**: 2026-03-25
**Status**: ✅ Complete - Ready for testing





