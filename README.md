# drone-app

Study app for FAA Part 107 commercial drone certification. Quiz, practice tests, and topic study modules.

**Disclaimer:** This is a study aid. Questions are not official FAA test items. Embedded YouTube videos are third-party content, not official FAA training.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Client-only React + Vite + TypeScript. No backend or account is required. Progress is stored in the browser under the `drone-app-progress` localStorage key (version 1).

## Modes

- **Study modules** (`/modules`) — index of the same nine ACS-aligned topics as practice. Each module has a YouTube embed, key points, vocabulary, a short explanation, and a 3-question check. Switch topics from the list or the detail-page dropdown. Module quizzes are separate from the practice bank.
- **Practice by topic** (`/practice`) — choose one of nine ACS-aligned topics. Questions are shuffled (25 per session, the full topic set). After each answer you see correct/incorrect plus an explanation and reference, then Continue.
- **Practice test** (`/test`) — 60 questions mixed across topics, sampled in proportion to the bank. **2-hour countdown** with auto-submit at 0:00. No per-question feedback until Results. **Pass at 70%.**

## Question bank

Seed data lives in `src/data/questions.json`.

- 9 topics, **225 unique questions** (25 per topic)
- Practice tests draw **60 unique** items sampled in proportion to the bank
- Each item includes a teaching **rationale** and a **Reference** cite (CFR, AIM, ACS, AC, or handbook)
- Items are original study-style questions aligned to ACS topic IDs. They are **not** copied from the FAA knowledge test.

Topic IDs: `regulations`, `airspace`, `weather`, `loading-performance`, `operations-emergency`, `airport-operations`, `radio`, `maintenance-preflight`, `human-factors-adm`

Study module content lives in `src/data/modules.ts` (one module per topic). Videos are embedded from YouTube; the app does not download or host video files.

## Screens

| Route | Screen |
| --- | --- |
| `/` | Home — modules, practice, test, disclaimer, recent/best scores |
| `/modules` | Study modules index — nine topics, same labels as practice |
| `/modules/:topicId` | Module detail: video, key points, vocabulary, explanation, 3-question quiz |
| `/practice` | Topic picker |
| `/practice/:topicId` | Practice quiz player |
| `/test` | Timed practice test |
| `/results` | Score, pass/fail (tests), topic breakdown, missed list |

From results you can **Retry missed**, **Retake**, or go **Home**.

## Out of scope (v1)

Auth, cloud sync, payments, spaced repetition, official FAA licensing, and native wrappers.
