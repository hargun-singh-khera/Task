# Napworks

Next.js frontend with a separate Express API server connected to MongoDB.

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
npm run dev:server
```

Frontend: [http://localhost:3000](http://localhost:3000)

API: [http://localhost:5000](http://localhost:5000)

## Environment

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/napworks
```

## API Routes

Healthcheck comes first:

```http
GET /api/health
```

Product CRUD templates:

```http
GET /api/products
POST /api/products
GET /api/products/:id
PATCH /api/products/:id
DELETE /api/products/:id
```

Create product example:

```json
{
  "name": "Ergonomic Chair",
  "description": "Mesh chair with lumbar support",
  "price": 129.99,
  "sku": "CHAIR-001",
  "stock": 25,
  "category": "office"
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
