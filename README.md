# drone-app

Study app for FAA Part 107 commercial drone certification. **v1 is quiz and practice tests only.**

**Disclaimer:** This is a study aid. Questions are not official FAA test items.

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

- **Practice by topic** (`/practice`) — choose one of nine ACS-aligned topics. Questions are shuffled (up to 10 per session). After each answer you see correct/incorrect plus an explanation, then Continue.
- **Practice test** (`/test`) — 60 questions mixed across topics, sampled in proportion to the bank. **2-hour countdown** with auto-submit at 0:00. No per-question feedback until Results. **Pass at 70%.**

## Question bank

Seed data lives in `src/data/questions.json`.

- 9 topics, **150 unique questions** (~16–17 per topic)
- Practice tests draw **60 unique** items sampled in proportion to the bank
- Each item includes a teaching **rationale** and a **Reference** cite (CFR, AIM, ACS, AC, or handbook)
- Items are original study-style questions aligned to ACS topic IDs. They are **not** copied from the FAA knowledge test.

Topic IDs: `regulations`, `airspace`, `weather`, `loading-performance`, `operations-emergency`, `airport-operations`, `radio`, `maintenance-preflight`, `human-factors-adm`

## Screens

| Route | Screen |
| --- | --- |
| `/` | Home — both modes, disclaimer, recent/best scores |
| `/practice` | Topic picker |
| `/practice/:topicId` | Practice quiz player |
| `/test` | Timed practice test |
| `/results` | Score, pass/fail (tests), topic breakdown, missed list |

From results you can **Retry missed**, **Retake**, or go **Home**.

## Out of scope (v1)

Auth, cloud sync, payments, spaced repetition, official FAA licensing, and native wrappers.
