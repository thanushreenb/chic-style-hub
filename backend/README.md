# MERN Backend for Chic Style Hub

This backend is built with Express and MongoDB to support the frontend app.

## Features
- User signup and login with hashed passwords
- JWT-based authentication
- Product CRUD operations
- Order creation and retrieval
- Admin login and protected admin routes

## Setup
1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` and `JWT_SECRET`.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Seed product data:
   ```bash
   npm run seed
   ```

## API endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/admin/login`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/orders`
- `GET /api/orders`

## Notes
- The frontend currently uses local storage for auth, cart, and orders.
- To fully integrate this backend, update the frontend to call these API endpoints instead of reading local state.
