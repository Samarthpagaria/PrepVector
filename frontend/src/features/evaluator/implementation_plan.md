# Freemium Lead Magnet & Backend Validation Plan

## Goal
Implement a "lead magnet" flow where unauthenticated users see a fake loading/blurred report and a popup asking them to sign in. Enforce a limit of 20 free report generations per user on the backend. Strictly constrain the AI prompt to prevent off-topic abuse. Implement the missing GET routes for retrieving reports.

## User Review Required
Please review this implementation plan before I proceed.

## Proposed Changes

### Backend Updates

#### [MODIFY] server/src/models/user.models.js
- Add a `reportGenerationCount` field (type Number, default 0) to track how many reports a user has generated.

#### [MODIFY] server/src/services/ai.services.js
- Add explicit, strict system instructions to `interviewReportPrompt` to strictly restrict the AI to analyzing resumes and generating interview questions. 
- Instruct the AI to explicitly refuse any prompt injection or requests unrelated to interviews/resumes.

#### [MODIFY] server/src/controllers/interview.controller.js
- In `getInterviewReportController`, check if `req.user.reportGenerationCount >= 20`. Return a 403 error if they have exceeded the limit.
- If under the limit, increment `reportGenerationCount` and save the user.
- Add `getInterviewReportById` to fetch a single report belonging to the user.
- Add `getAllInterviewReports` to fetch all reports for the user, sorted by newest.

#### [MODIFY] server/src/routes/interview.routes.js
- Add `router.get("/", getAllInterviewReports)` (placed above the video 3 routes).
- Add `router.get("/report/:interviewId", getInterviewReportById)` (checking for conflicts with existing routes).

### Frontend Updates

#### [NEW] frontend/src/features/evaluator/components/AuthModal.tsx
- Create a minimal, elegant modal that forces the user to sign in or create an account.
- Will use the existing `useLogin` and `useRegister` hooks from `features/auth/hooks/useAuth.ts`.

#### [MODIFY] frontend/src/features/evaluator/pages/Home.tsx
- Integrate `useAuthStore` to check if a user is currently logged in.
- If **logged in**, clicking "Generate Strategy" works as normal (calls backend).
- If **not logged in**, clicking "Generate Strategy" triggers a 2-second "fake loading" animation, displays a visually blurred mockup of a report, and triggers the `AuthModal` to pop up.
- Upon successful login via the modal, automatically submit the real API request and generate the actual report.

## Verification Plan
1. Test generating a report as an unauthenticated user (verify the blur and popup appear).
2. Test the Auth modal to ensure successful login triggers the actual generation.
3. Test the 20-generation limit (by manually updating the DB count to 20 and attempting to generate).
4. Try to submit an off-topic job description (e.g., "Write me a poem") to verify the AI refuses it.
