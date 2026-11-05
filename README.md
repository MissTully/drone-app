# Remote Possibilities

Study app for FAA Part 107 commercial drone certification — quiz, practice tests, and topic study modules. The GitHub repository remains `drone-app`.

**Disclaimer:** This is a study aid. Questions are not official FAA test items. Embedded YouTube videos are third-party content, not official FAA training.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm test
npm run build
npm run preview
npm run test:platform-auth
```

Client-only React + Vite + TypeScript. Progress is stored in this browser under the `drone-app-progress` localStorage key (version 1). The app does not have accounts of its own, and it does not receive the visitor's identity.

Partner preview access is enforced by Vercel Authentication in front of the deployment. See [Partner access](#partner-access).

## Modes

- **Study modules** (`/modules`) — top-level Learn section, separate from Practice and the practice test. A dropdown selects among the same nine ACS topics. Each module has a YouTube embed, key points, vocabulary, explanations, and a 3-question check. Module quizzes are separate from the practice bank.
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
| `/` | Home — marketing landing for Remote Possibilities, with CTAs into modules and the practice test |
| `/modules` | Study modules — topic dropdown plus video, notes, and 3-question quiz |
| `/modules/:topicId` | Same page with a topic preselected in the dropdown |
| `/practice` | Topic picker |
| `/practice/:topicId` | Practice quiz player |
| `/test` | Timed practice test |
| `/results` | Score, pass/fail (tests), topic breakdown, missed list |

From results you can **Retry missed**, **Retake**, or go **Home**.

## Partner access

Sign-in is not implemented in this repository. Vercel Authentication sits in front of the static deployment and runs before HTML, JavaScript, images, and the bundled study data are sent. The app never sees the visitor's email and does not assign roles.

`ssoProtection.deploymentType` is `all` for this project. That covers production aliases, including `https://drone-app-five.vercel.app`, plus deployment URLs and previews. Anonymous requests are redirected to Vercel login before the app is served. The team is Pro, so outside logged-in Vercel users can be granted deployment access without a paid seat.

Access workflow:

1. Keep Vercel Authentication on for all deployments. Do not create shareable bypass links, and do not use a Protection Bypass for Automation secret as partner access.
2. Each partner uses a free Vercel account registered with the exact approved email and requests access on the deployment.
3. Melissa approves only those two requests. Approval happens in Vercel, not in this app.

`npm run test:platform-auth` checks the production alias without a session. It is separate from `npm test`. An unauthenticated request should be stopped by Vercel Authentication and must not contain question text.

Direct routes such as `/modules` rewrite to `index.html` after Vercel has allowed the request, so a signed-in partner does not get a static 404.

## Out of scope (v1)

In-app auth, cloud sync, payments, spaced repetition, official FAA licensing, and native wrappers. Access control stays on Vercel Authentication.
