# JJ Transport API Documentation

Base URL: `https://api.jjtransport.com/api/v1` (or local `http://localhost:5000/api/v1`)

All responses follow the standard envelope:

```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "error": null,
  "meta": {}
}
```

## Authentication

Authentication uses JWT access tokens sent in the `Authorization: Bearer <token>` header.

### POST /auth/login

Login and receive tokens.

**Body:**
```json
{
  "email": "admin@jjtransport.com",
  "password": "Admin@123"
}
```

### POST /auth/refresh

Refresh access token using a refresh token.

**Body:**
```json
{
  "refreshToken": "..."
}
```

### POST /auth/logout

Revoke refresh token.

### GET /auth/me

Get current authenticated user.

## Public Endpoints

All public endpoints are scoped to the default company (`jj-transport`).

### GET /public/profile

Company profile and settings.

### GET /public/services

List active services.

### GET /public/fleet

List active fleet vehicles.

### GET /public/gallery?category=

List gallery images.

### GET /public/testimonials

List active testimonials.

### GET /public/blog

List published blog posts.

### GET /public/blog/:slug

Get a single published blog post.

## Booking & Tracking

### POST /pricing-rules/estimate

Get an estimated transport price.

**Body:**
```json
{
  "pickup": "123 Main St",
  "destination": "456 Oak Ave",
  "cargoType": "GENERAL",
  "weight": 1000,
  "vehicleType": "TRUCK_5_TON"
}
```

### POST /transport-requests

Submit a new transport request.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "pickupLocation": "123 Main St",
  "destination": "456 Oak Ave",
  "cargoType": "GENERAL",
  "weight": 1000,
  "vehicleType": "TRUCK_5_TON",
  "preferredPickupDate": "2026-07-20T10:00:00Z",
  "notes": "Fragile items"
}
```

### GET /transport-requests/track/:referenceNumber

Track a request by reference number.

## Admin Endpoints

All admin endpoints require authentication and appropriate role.

### Transport Requests

- `GET /transport-requests`
- `GET /transport-requests/:id`
- `PUT /transport-requests/:id`
- `DELETE /transport-requests/:id`

### Quotes

- `GET /quotes`
- `GET /quotes/:id`
- `POST /quotes`
- `PUT /quotes/:id`
- `POST /quotes/:id/accept`
- `DELETE /quotes/:id`

### Pricing Rules

- `GET /pricing-rules`
- `GET /pricing-rules/:id`
- `POST /pricing-rules`
- `PUT /pricing-rules/:id`
- `DELETE /pricing-rules/:id`

### Fleet

- `GET /fleet`
- `GET /fleet/:id`
- `POST /fleet`
- `PUT /fleet/:id`
- `DELETE /fleet/:id`

### Services

- `GET /services`
- `GET /services/:id`
- `POST /services`
- `PUT /services/:id`
- `DELETE /services/:id`

### Gallery

- `GET /gallery`
- `GET /gallery/:id`
- `POST /gallery`
- `PUT /gallery/:id`
- `DELETE /gallery/:id`

### Blog

- `GET /blog`
- `GET /blog/:id`
- `POST /blog`
- `PUT /blog/:id`
- `DELETE /blog/:id`

### Testimonials

- `GET /testimonials`
- `GET /testimonials/:id`
- `POST /testimonials`
- `PUT /testimonials/:id`
- `DELETE /testimonials/:id`

### Users

- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

### Notifications

- `GET /notifications`
- `GET /notifications/:id`
- `POST /notifications`
- `PUT /notifications/:id`

### Dashboard

- `GET /dashboard/stats`
- `GET /dashboard/monthly?months=12`

### Settings

- `GET /settings`
- `PUT /settings`

### Companies

- `GET /companies`
- `GET /companies/:id`
- `POST /companies`
- `PUT /companies/:id`
- `DELETE /companies/:id`
