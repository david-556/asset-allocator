# Asset Allocator

A small **Next.js** app for tracking a personal portfolio: total value, allocation by asset or type, target weights, and simple rebalancing guidance. Everything runs in the browser; there is no server-side database.

## Features

- **Dashboard** (`/`) — Portfolio total, allocation breakdown, and a pie chart with an **asset** vs **type** view toggle.
- **Holdings** (`/holdings`) — Add, edit, and remove positions; data persists in **localStorage**.
- **Targets** (`/targets`) — Set target allocation percentages and see how current weights compare (including suggested adjustments toward targets).

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Recharts](https://recharts.org/) for charts
- [Tailwind CSS](https://tailwindcss.com/) 4

## Repository layout

The runnable application lives in the **`asset-allocator/`** directory (nested folder name matches the npm package). Clone the repo, then work inside that folder for installs and scripts.

## Getting started

```bash
cd asset-allocator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the nav bar to move between Dashboard, Holdings, and Targets.

### Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Run production server    |
| `npm run lint` | ESLint                   |

## Privacy

Portfolio data is stored only in your browser (**localStorage**). Nothing is sent to a backend or third-party analytics by this app.

## Deploy

You can deploy the `asset-allocator` app like any Next.js project, for example on [Vercel](https://vercel.com/docs/frameworks/nextjs).
