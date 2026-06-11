# Napworks

Next.js frontend app.

## Getting Started

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Start MongoDB locally, then run the frontend and API in two terminals:

```bash
npm run dev
```

Live Demo: [https://napworks-xi.vercel.app](https://napworks-xi.vercel.app)

## API Routes

Healthcheck comes first:

```http
GET /api/health
```

Product CRUD templates:

```http
GET /api/products
POST /api/products
DELETE /api/products/:id
```

Create product example:

```json
{
  "name": "Ergonomic Chair",
  "price": 129.99,
}
```

List products supports optional query params:

```http
GET /api/products?page=1&limit=10&search=chair&category=office
```

## Scripts

```bash
npm run dev          # Next.js dev server
npm run build        # Build Next.js app
npm run start        # Start built Next.js app
npm run lint         # Run ESLint
```
