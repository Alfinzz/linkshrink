# LinkShrink Backend

Standalone REST API for LinkShrink. This repository is independent from the frontend and communicates only over HTTP.

## Stack

- Node.js
- Express.js
- Prisma ORM
- Neon serverless PostgreSQL
- Vercel serverless functions

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run dev
```

Set these environment variables in Vercel:

- `DATABASE_URL`: Neon PostgreSQL connection string with `sslmode=require`
- `JWT_SECRET`: long random signing secret
- `FRONTEND_URL`: deployed frontend origin, for example `https://linkshrink-frontend.vercel.app`
- `NODE_ENV`: `production`

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/links`
- `POST /api/links`
- `GET /api/links/:id`
- `PATCH /api/links/:id`
- `DELETE /api/links/:id`
- `GET /api/links/:id/analytics`
- `GET /:slug`

## Vercel Deployment

`vercel.json` routes every request to `api/index.js`, where Express handles both API routes and public redirects.
