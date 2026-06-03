# LinkShrink Frontend

Vite React static frontend for LinkShrink. This repository is independent from the backend and communicates only through REST API calls.

## Stack

- React
- Vite
- Tailwind CSS
- Axios
- React Router v6
- Recharts

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the backend API origin plus `/api`, for example:

```env
VITE_API_BASE_URL="https://linkshrink-backend.vercel.app/api"
```

Deploy to Vercel as a static Vite site. The backend must separately set `FRONTEND_URL` to this frontend origin for CORS.
