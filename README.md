# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Getting Started

First, run the development server:

```bash
npm i
npm run dev

```

[Figma Link](<https://www.figma.com/design/70OK7JBA9MbWPJcAOuAYjV/Website-(New)?node-id=1-6&t=P72lXr0akfJarjDX-1>)

Vercel dev [Desktop Only For Now](https://ods-pink.vercel.app/)

Open [http://localhost:5173/](http://localhost:5173/) with your browser to see the result.

![Hero Section](./src/assets/img/readme/heroShow.png 'the result at the moment')

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Flutterwave Configuration
# Get your public key from https://dashboard.flutterwave.com/settings/apis
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-**************************-X
```

**Note:** 
- For production, make sure to use your live Flutterwave public key instead of the test key
- Vite uses `VITE_` prefix for environment variables (not `REACT_APP_`)
- Restart your development server after adding environment variables

## Hackathon portal (RSVP, QR tickets, check-in)

The Ogun Innovate Hackathon portal lives in [`src/hackathon-portal/`](src/hackathon-portal/) and is served under **`/hackathon-portal`**:

| Path | Who | What |
|---|---|---|
| `/hackathon-portal/login` | Staff | Sign in (admins and check-in officers) |
| `/hackathon-portal/dashboard` … `/settings` | Admins | Dashboard, events, teams, participants, CSV import, RSVP, tickets, sessions, reports, email & audit logs, officers, settings |
| `/hackathon-portal/officer` | Check-in officers | Session picker, QR scanner, manual lookup, own check-ins |
| `/hackathon-portal/rsvp/:token` | Participants | Public RSVP page (link from the invitation email) |
| `/hackathon-portal/ticket/:credential` | Participants | Public ticket page with QR code |

Its API is the `hackathon-portal` module of the ODS backend (`ODS-Main-Website-Backend/resources/hackathon-portal`, mounted at `/api/hackathon-portal`). See `ODS-Main-Website-Backend/docs/hackathon-portal/` for the API reference, admin bootstrap and email setup.

**Which API it talks to:** the live ODS backend (`https://ods2025.onrender.com/api/hackathon-portal`).

- **Production build:** calls the live API directly. The API only accepts browser requests from `https://www.ogundigitalsummit.com` (the backend's `HACKATHON_PORTAL_URL` origin), so deploy the site there.
- **`npm run dev`:** calls go through a Vite proxy (`/hackathon-portal-api` in `vite.config.ts`) to the same live API, because the live API rejects `localhost` origins. Signing in locally uses the real live accounts and data.
- **A local backend instead:** set `VITE_HACKATHON_API_URL=http://localhost:4000/api/hackathon-portal` in `.env` (that backend allows `http://localhost:5173` when not in production).

Emailed links are built from the backend's `HACKATHON_PORTAL_URL`. The site serves them at `/hackathon-portal/rsvp/...` and `/hackathon-portal/ticket/...`, and also redirects bare `/rsvp/...` and `/ticket/...` there, so either setting works.

The QR scanner needs camera access, which browsers only allow over HTTPS (or on `localhost`).

## What is commitlint

commitlint checks if your commit messages meet the [conventional commit format](https://conventionalcommits.org).

In general the pattern mostly looks like this:

```sh
type(scope?): subject  #scope is optional; multiple scopes are supported (current delimiter options: "/", "\" and ",")
```

Real world examples can look like this:

```text
chore: run tests on travis ci
```

```text
fix(server): send cors headers
```

```text
feat(blog): add comment section
```

Common types according to [commitlint-config-conventional (based on the Angular convention)](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum) can be:

- build
- chore
- ci
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test

