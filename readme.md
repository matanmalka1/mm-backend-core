# Express Sequelize REST API

Production-ready REST API built with Express.js and Sequelize ORM.

## Features

- **Authentication & Authorization**: JWT-based auth with refresh token rotation
- **Database**: Sequelize ORM with PostgreSQL
- **Security**: Helmet, CORS, rate limiting, input validation
- **File Upload**: Multer with file type and size validation
- **Error Handling**: Centralized error handling with consistent API responses
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js >= 18.0.0

## Installation

1. Clone the repository
2. Install dependencies:

```bash
   npm install
```

3. Copy environment variables:

4. Update `.env` with your configuration

## Environment Variables

| Variable               | Description                            | Default               |
| ---------------------- | -------------------------------------- | --------------------- |
| NODE_ENV               | Environment (development/production)   | development           |
| PORT                   | Server port                            | 3000                  |
| DB_HOST                | Database host                          | localhost             |
| DB_PORT                | Database port                          | 5432                  |
| JWT_ACCESS_SECRET      | JWT access token secret                | -                     |
| JWT_REFRESH_SECRET     | JWT refresh token secret               | -                     |
| JWT_ACCESS_EXPIRES_IN  | Access token expiry                    | 15m                   |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry                   | 7d                    |
| COOKIE_SECURE          | Use secure cookies (https)             | false                 |
| CORS_ORIGIN            | Allowed CORS origins (comma-separated) | http://localhost:3000 |

## Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server

## API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Flow

1. **Register**: `POST /api/v1/auth/register`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

2. **Login**: `POST /api/v1/auth/login`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response includes:

- `accessToken` in response body
- `refreshToken` in httpOnly cookie

3. **Refresh Token**: `POST /api/v1/auth/refresh`

   - Reads refresh token from cookie
   - Returns new access token and refresh token
   - Invalidates old refresh token (rotation)

4. **Logout**: `POST /api/v1/auth/logout`
   - Requires authentication
   - Invalidates refresh token

### Protected Routes

Include access token in Authorization header:

```
Authorization: Bearer <access_token>
```

### Users CRUD

- `GET /api/v1/users` - List users (paginated)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user (admin only)
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### File Upload

- `POST /api/v1/upload` - Upload single file
  - Max size: 5MB
  - Allowed types: jpeg, png, gif, pdf

### Health Check

- `GET /health` - Server health status

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

## Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Authentication failed
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Resource not found
- `DUPLICATE_RESOURCE` - Resource already exists
- `TOKEN_EXPIRED` - JWT token expired
- `INVALID_TOKEN` - Invalid JWT token
- `SERVER_ERROR` - Internal server error

## Project Structure

```
src/
├── config/          # Configuration files
├── constants/       # Constants and error codes
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
├── models/          # Sequelize models
├── routes/          # Route definitions
├── services/        # Business logic
├── utils/           # Utility functions
├── validators/      # Input validation schemas
├── app.js           # Express app setup
└── server.js        # Entry point
```

## Security Features

- Password hashing with bcrypt
- JWT access and refresh tokens
- Refresh token rotation (one-time use)
- httpOnly cookies for refresh tokens
- Rate limiting (global + stricter on auth routes)
- Helmet security headers
- CORS with origin whitelist
- Input validation
- File upload restrictions

## License

MIT
