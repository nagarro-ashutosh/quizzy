# Quizzy - Online Assessment Platform

A Next.js 16 + React + TypeScript + MUI implementation of a two-role online assessment platform. Admins can import questions, create tests, and inspect pass/fail metrics. Participants can view assigned tests, attempt timed assessments, and review detailed results.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000/`.

Useful checks:

```bash
npm run lint
npm run build
```

## Demo Login

Choose a role first. The form changes based on the selected role.

- Admin email: `admin@example.com`
- Admin password: `admin123`
- Participant profiles: `priya@example.com`, `rahul@testing.com`, `test@user.com`
- Participant access code: `123123`
- Sessions expire after 15 minutes through a mock token TTL.

## Project Structure

```text
src/
  app/                  Next.js App Router pages, metadata, sitemap, robots
  features/components   MUI shell, theme, protected page wrapper
  features/auth/        Mock login forms, TTL session, role guard
  features/admin/       Dashboard, CSV upload, test builder
  features/participant/ Test listing, timed test, result page
  shared/               Types, seed data, storage, sanitizer
  workers/              CSV parser Web Worker
public/
  sample-questions.csv

```
