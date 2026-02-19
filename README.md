# Frontend (Vite + React)

## Setup

- Copy env file:
  - `.env.example` → `.env`

## Scripts

- `npm run dev` — start dev server on `http://localhost:5173`
- `npm run build` — production build
- `npm run preview` — preview production build

## Required env

- `VITE_BACKEND_URL` (default `http://localhost:8001`)
- `VITE_STRIPE_PUBLISHABLE_KEY` (Stripe test publishable key)

## Deploy (Render)

### 1) Create a Render **Static Site**

- **Root Directory**: `frontend`
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`

If you prefer Yarn, you can use:

- `corepack enable && yarn install --frozen-lockfile && yarn build`

### 2) Add frontend environment variables (Render)

- `VITE_BACKEND_URL=https://lumina-backend-1-b7ux.onrender.com`
- (Optional) `VITE_STRIPE_PUBLISHABLE_KEY=...`

### 3) SPA routing rewrite (important)

If you use React Router, configure a rewrite so deep links work:

- In Render Static Site settings → **Redirects/Rewrites**
  - Source: `/*`
  - Destination: `/index.html`
  - Action/Status: `Rewrite` (or `200`)

### 4) Update backend CORS on Render

After the frontend deploys, copy its URL (e.g. `https://your-frontend.onrender.com`) and set this in your **backend** Render service env vars:

- `CORS_ORIGINS=https://your-frontend.onrender.com,http://localhost:5173`

Then redeploy the backend.

## Deploy (Vercel)

- Import the repo in Vercel
- **Root Directory**: `frontend`
- **Build Command**: `npm ci && npm run build`
- **Output Directory**: `dist`
- Add env vars:
  - `VITE_BACKEND_URL=https://lumina-backend-1-b7ux.onrender.com`
  - (Optional) `VITE_STRIPE_PUBLISHABLE_KEY=...`

If you prefer Yarn on Vercel:

- `corepack enable && yarn install --frozen-lockfile && yarn build`
