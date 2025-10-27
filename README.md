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



[Figma Link](<https://www.figma.com/design/70OK7JBA9MbWPJcAOuAYjV/Website-(New)?node-id=1-6&t=P72lXr0akfJarjDX-1>)

Vercel dev [Desktop Only For Now](https://ods-pink.vercel.app/)

Open [http://localhost:5173/](http://localhost:5173/) with your browser to see the result.

![Hero Section](./src/assets/img/readme/heroShow.png 'the result at the moment')

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
