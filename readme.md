# Express MongoDB REST API

Production-ready REST API built with Express.js and MongoDB/Mongoose.

## Features

- **Authentication & Authorization**: JWT-based auth with refresh token rotation
- **OAuth Providers**: Optional Google/GitHub/Facebook login with Passport
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, input validation
- **File Upload**: Multer with file type and size validation
- **Error Handling**: Centralized error handling with consistent API responses
- **Auto-Cleanup**: TTL indexes for automatic token expiration
- **Pagination**: Built-in pagination for list endpoints
- **Seeding**: Database seed script with roles, permissions, and users

## Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0 (local or MongoDB Atlas)

## Installation

1. **Clone the repository**

2. **Install dependencies**:

```bash
npm install
```

3. **Setup MongoDB**:
   - **Local**: Install MongoDB and start the service
   - **Cloud**: Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

4. **Configure environment variables**:

```bash
# Copy the example file
cp .env.example .env.development

# Generate secure JWT secrets (run this command twice for two secrets):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. **Update `.env.development`** with your values

6. **Seed the database**:

```bash
npm run seed
```

7. **Start the server**:

```bash
npm run dev
```

## Environment Variables

Create a `.env.development` file with these variables (start from `.env.example`):

| Variable                       | Description                             | Example                                          |
| ------------------------------ | --------------------------------------- | ------------------------------------------------ |
| `NODE_ENV`                     | Environment                             | `development`                                    |
| `PORT`                         | Server port                             | `3000`                                           |
| `MONGODB_URI`                  | MongoDB connection string               | `mongodb://localhost:27017/myapp`                |
| `JWT_ACCESS_SECRET`            | JWT access token secret (min 32 chars)  | Generate with crypto                             |
| `JWT_REFRESH_SECRET`           | JWT refresh token secret (min 32 chars) | Generate with crypto                             |
| `JWT_ACCESS_EXPIRES_IN`        | Access token expiry                     | `15m`                                            |
| `JWT_REFRESH_EXPIRES_IN`       | Refresh token expiry                    | `7d`                                             |
| `COOKIE_SECURE`                | Use secure cookies (https only)         | `false` (dev), `true` (prod)                     |
| `COOKIE_SAME_SITE`             | Cookie same-site policy                 | `lax`                                            |
| `CORS_ORIGIN`                  | Allowed CORS origins (comma-separated)  | `http://localhost:3000,http://localhost:5173`    |
| `RATE_LIMIT_WINDOW_MS`         | Global rate limit window                | `900000` (15 min)                                |
| `RATE_LIMIT_MAX_REQUESTS`      | Global rate limit max requests          | `100`                                            |
| `AUTH_RATE_LIMIT_WINDOW_MS`    | Auth rate limit window                  | `900000`                                         |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | Auth rate limit max requests            | `10`                                             |
| `BODY_LIMIT`                   | JSON/form body size limit               | `1mb`                                            |
| `MAX_FILE_SIZE`                | Max upload size (bytes)                 | `5242880` (5MB)                                  |
| `ALLOWED_FILE_TYPES`           | Allowed MIME types                      | `image/jpeg,image/png,image/gif,application/pdf` |
| `API_URL`                      | Backend base URL for OAuth callbacks    | `http://localhost:3000/api/v1`                   |
| `FRONTEND_URL`                 | Frontend base URL for OAuth redirects   | `http://localhost:5173`                          |
| `GOOGLE_CLIENT_ID`             | Google OAuth client ID                  | OAuth provider value                             |
| `GOOGLE_CLIENT_SECRET`         | Google OAuth client secret              | OAuth provider value                             |
| `GITHUB_CLIENT_ID`             | GitHub OAuth client ID                  | OAuth provider value                             |
| `GITHUB_CLIENT_SECRET`         | GitHub OAuth client secret              | OAuth provider value                             |
| `FACEBOOK_CLIENT_ID`           | Facebook OAuth client ID                | OAuth provider value                             |
| `FACEBOOK_CLIENT_SECRET`       | Facebook OAuth client secret            | OAuth provider value                             |

### MongoDB Connection Strings

**Local MongoDB**:

```
MONGODB_URI=mongodb://localhost:27017/your-database-name
```

**MongoDB Atlas** (cloud):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your-database-name?retryWrites=true&w=majority
```

## Scripts

```bash
npm run dev      # Start development server with hot reload
npm start        # Start production server
npm run seed     # Seed database with roles, permissions, and test users
npm run jscpd    # Detect copy/paste duplicates
npm test         # Run tests (Vitest)
```

Tests use an in-memory MongoDB server and do not require a running database.

## Default Users (after seeding)

All users have password: `Password123!`

| Email               | Role    | Permissions                                        |
| ------------------- | ------- | -------------------------------------------------- |
| admin@example.com   | Admin   | All permissions                                    |
| manager@example.com | Manager | Users (read, create, update), roles (read), upload |
| editor@example.com  | Editor  | Users (read, update), upload                       |
| support@example.com | Support | Users (read), health check                         |
| user1@example.com   | User    | Basic access                                       |

## API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response** (201):

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "role": "507f1f77bcf86cd799439012"
    }
  },
  "message": "User registered successfully"
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Note**: `refreshToken` is set as an httpOnly cookie.

#### Refresh Token

```http
POST /api/v1/auth/refresh
Cookie: refreshToken=...
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
```

#### Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

#### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
Cookie: refreshToken=...
```

#### Change Password

```http
POST /api/v1/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

#### Update Profile

```http
PUT /api/v1/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "+1 555 123 4567"
}
```

#### OAuth Login

```http
GET /api/v1/auth/google
GET /api/v1/auth/github
GET /api/v1/auth/facebook
```

### User Endpoints

All user endpoints require authentication.

#### List Users (with pagination)

```http
GET /api/v1/users?page=1&limit=10
Authorization: Bearer <access_token>
```

**Query Parameters**:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response**:

```json
{
  "success": true,
  "data": {
    "count": 50,
    "users": [...],
    "page": 1,
    "limit": 10,
    "totalPages": 5
  },
  "message": "Users retrieved successfully"
}
```

#### Get User by ID

```http
GET /api/v1/users/:id
Authorization: Bearer <access_token>
```

#### Create User (Admin only)

```http
POST /api/v1/users
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "roleId": "507f1f77bcf86cd799439012"
}
```

#### Update User

```http
PUT /api/v1/users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Updated",
  "isActive": false
}
```

#### Delete User (Admin only)

```http
DELETE /api/v1/users/:id
Authorization: Bearer <access_token>
```

### File Upload

```http
POST /api/v1/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <binary file data>
```

**Constraints**:

- Max size: 5MB
- Allowed types: JPEG, PNG, GIF, PDF

### Health Check

```http
GET /api/v1/health
```

**Response**:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 123.456,
    "timestamp": "2024-01-04T12:00:00.000Z",
    "environment": "development",
    "database": "connected"
  },
  "message": "Server is healthy"
}
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
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

| Code                    | Description              | Status |
| ----------------------- | ------------------------ | ------ |
| `VALIDATION_ERROR`      | Input validation failed  | 400    |
| `AUTHENTICATION_ERROR`  | Authentication failed    | 401    |
| `AUTHORIZATION_ERROR`   | Insufficient permissions | 403    |
| `RESOURCE_NOT_FOUND`    | Resource not found       | 404    |
| `DUPLICATE_RESOURCE`    | Resource already exists  | 400    |
| `TOKEN_EXPIRED`         | JWT token expired        | 401    |
| `INVALID_TOKEN`         | Invalid JWT token        | 401    |
| `INVALID_CREDENTIALS`   | Invalid email/password   | 401    |
| `REFRESH_TOKEN_INVALID` | Invalid refresh token    | 401    |
| `REFRESH_TOKEN_EXPIRED` | Refresh token expired    | 401    |
| `FILE_UPLOAD_ERROR`     | File upload failed       | 400    |
| `FILE_TOO_LARGE`        | File exceeds size limit  | 400    |
| `INVALID_FILE_TYPE`     | File type not allowed    | 400    |
| `SERVER_ERROR`          | Internal server error    | 500    |

## Project Structure

```
├── src/
│   ├── config/          # Configuration (database)
│   ├── constants/       # Constants and error codes
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Express middlewares
│   ├── models/          # Mongoose models
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validators/      # Input validation
│   ├── app.js           # Express app setup
│   ├── server.js        # Entry point
│   └── seed.js          # Database seeder
├── uploads/             # Uploaded files (gitignored)
├── .env.example         # Environment variables template
├── .env.development     # Environment variables (gitignored)
├── .gitignore
├── package.json
└── README.md
```

## Security Features

- ✅ **Password hashing** with bcrypt (10 rounds)
- ✅ **JWT authentication** with access and refresh tokens
- ✅ **Refresh token rotation** (one-time use)
- ✅ **httpOnly cookies** for refresh tokens
- ✅ **Rate limiting** (global + stricter on auth routes)
- ✅ **Helmet** security headers
- ✅ **CORS** with origin whitelist
- ✅ **Input validation** on all endpoints
- ✅ **File upload restrictions** (type, size)
- ✅ **Auto-expiring tokens** via MongoDB TTL indexes

## Testing with cURL

### Register a new user

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@example.com",
    "password": "Password123!"
  }'
```

### Get users (with token)

```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Upload file

```bash
curl -X POST http://localhost:3000/api/v1/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -F "file=@/path/to/your/file.jpg"
```

## Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_ACCESS_SECRET=your_production_secret
JWT_REFRESH_SECRET=your_production_secret
COOKIE_SECURE=true
CORS_ORIGIN=https://your-frontend-domain.com
```

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create database user
4. Whitelist your IP / Allow access from anywhere (0.0.0.0/0)
5. Get connection string and add to `.env`

### Deployment Platforms

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
