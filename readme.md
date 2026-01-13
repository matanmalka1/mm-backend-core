# Express MongoDB REST API Template

A production-ready, secure REST API boilerplate built with Express.js and MongoDB. Features JWT authentication, role-based access control, OAuth integration, and comprehensive security measures.

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Seeding](#-database-seeding)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Security Features](#-security-features)
- [Testing](#-testing)
- [Docker Support](#-docker-support)
- [Deployment](#-deployment)

## ✨ Features

### Authentication & Authorization

- JWT-based authentication with access and refresh tokens
- Refresh token rotation (one-time use, server-side revocation)
- Role-based access control (RBAC)
- Permission-based authorization helpers
- OAuth 2.0 integration (Google, GitHub, Facebook) with state validation

### Security

- Helmet.js for security headers
- CORS with configurable origins
- Rate limiting (global and route-specific)
- Input validation with Zod
- MongoDB injection prevention
- Password hashing with bcrypt
- httpOnly cookies for refresh tokens

### API Features

- RESTful API design
- Centralized error handling
- Consistent response format
- Pagination support
- File upload with validation
- Comprehensive logging with Winston
- Correlation IDs per request
- Request timeout guard

### Development

- Hot reload with Nodemon
- ESLint + Prettier configuration
- Code duplication detection (jscpd)
- Vitest for testing
- MongoDB Memory Server for tests
- Docker and Docker Compose support

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository-url>
cd mm-backend-core
npm install

# Setup environment
cp .env.example .env.development

# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output to JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in .env.development

# Start MongoDB (if using local)
# For macOS: brew services start mongodb-community
# For Linux: sudo systemctl start mongod
# For Windows: net start MongoDB

# Seed database
npm run seed

# Start development server
npm run dev
```

Server will be running at `http://localhost:3000`

## 📦 Installation

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** >= 6.0 (local installation or MongoDB Atlas account)

### Step-by-Step Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mm-backend-core
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup MongoDB**

   Choose one of the following options:

   **Option A: Local MongoDB**
   - Install MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Start MongoDB service:
     - macOS: `brew services start mongodb-community`
     - Linux: `sudo systemctl start mongod`
     - Windows: `net start MongoDB`

   **Option B: MongoDB Atlas (Cloud)**
   - Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster (M0 free tier)
   - Create database user
   - Add your IP to whitelist (or 0.0.0.0/0 for development)
   - Get connection string

4. **Configure environment variables**

   ```bash
   cp .env.example .env.development
   ```

   Generate secure JWT secrets:

   ```bash
   # Run this twice to get two different secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Update `.env.development` with your values (see [Configuration](#-configuration))

5. **Seed the database**

   ```bash
   npm run seed
   ```

   This creates roles, permissions, and test users.

6. **Start the server**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

### Environment Variables

Create `.env.development` (for development) or `.env` (for production):

```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/my_app_db
MONGO_MAX_POOL_SIZE=20
MONGO_MIN_POOL_SIZE=2

# JWT Secrets (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Password Reset
PASSWORD_RESET_EXPIRES_IN=1h
PASSWORD_RESET_EXPIRES_IN_MS=3600000
PASSWORD_RESET_TOKEN_SECRET=your_generated_secret_here

# Cookies
COOKIE_SECURE=false          # Set to true in production with HTTPS
COOKIE_SAME_SITE=lax

# CORS (comma-separated origins)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# URLs
API_URL=http://localhost:3000/api/v1
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000          # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MS=900000     # 15 minutes
AUTH_RATE_LIMIT_MAX_REQUESTS=10
REFRESH_RATE_LIMIT_WINDOW_MS=900000
REFRESH_RATE_LIMIT_MAX_REQUESTS=10
PASSWORD_CHANGE_RATE_LIMIT_WINDOW_MS=900000
PASSWORD_CHANGE_RATE_LIMIT_MAX_REQUESTS=5
FORGOT_PASSWORD_RATE_LIMIT_WINDOW_MS=3600000
FORGOT_PASSWORD_RATE_LIMIT_MAX_REQUESTS=3
OAUTH_RATE_LIMIT_WINDOW_MS=900000
OAUTH_RATE_LIMIT_MAX_REQUESTS=20

# Request Timeout
REQUEST_TIMEOUT_MS=30000

# File Upload
MAX_FILE_SIZE=5242880                # 5MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Logging
LOG_LEVEL=info

# OAuth (Optional - leave empty if not using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
```

### MongoDB Connection Strings

**Local MongoDB:**

```
mongodb://localhost:27017/my_app_db
```

**MongoDB Atlas:**

```
mongodb+srv://username:password@cluster.mongodb.net/my_app_db?retryWrites=true&w=majority
```

### OAuth Setup (Optional)

To enable OAuth providers, you need to create OAuth applications:

**Google:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `http://localhost:3000/api/v1/auth/google/callback`

**GitHub:**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Authorization callback URL: `http://localhost:3000/api/v1/auth/github/callback`

**Facebook:**

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create App → Add Facebook Login
3. Valid OAuth Redirect URIs: `http://localhost:3000/api/v1/auth/facebook/callback`

## 🌱 Database Seeding

The seed script creates default roles, permissions, and test users:

```bash
npm run seed
```

### Default Roles & Permissions

| Role    | Permissions                                                                 |
| ------- | --------------------------------------------------------------------------- |
| admin   | All permissions (full system access)                                        |
| manager | users.read, users.create, users.update, roles.read, upload.create, health.read |
| editor  | users.read, users.update, upload.create                                     |
| support | users.read, health.read                                                     |
| user    | health.read, auth.refresh, auth.logout                                      |

### Test Users

All users have password: `Password123!`

| Email               | Role    | Use Case                         |
| ------------------- | ------- | -------------------------------- |
| admin@example.com   | admin   | Full system administration       |
| manager@example.com | manager | User and role management         |
| editor@example.com  | editor  | Content editing and file uploads |
| support@example.com | support | Read-only support access         |
| user1@example.com   | user    | Regular user with basic access   |

Additional user accounts `user2@example.com` through `user6@example.com` are also seeded with the same password and role.

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Flow

```
1. Register → Account created; Login → Receive access token + refresh token (httpOnly cookie)
2. Use access token in Authorization header for protected routes
3. When access token expires → Call /auth/refresh to get new access token
4. Refresh token is rotated on each refresh; the old token is revoked and reuse returns 401
```

### Authentication Endpoints

#### Register New User

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

**Response (200):**

```json
{
  "success": true,
  "data": null,
  "message": "Check your email"
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

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": {
        "name": "Admin",
        "permissions": ["*"]
      }
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Note:** Refresh token is set as httpOnly cookie automatically.

#### Refresh Access Token

```http
POST /api/v1/auth/refresh
Cookie: refreshToken=<refresh_token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
```
**Note:** Refresh tokens are one-time use. On refresh, the old token is revoked and reuse returns 401.

#### Get Current User Profile

```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

#### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
Cookie: refreshToken=<refresh_token>
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

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

#### Update Profile

```http
PUT /api/v1/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "+1 555 123 4567",
  "profilePicture": "https://example.com/avatar.png",
  "bio": "Short bio",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "ST",
    "zipCode": "12345",
    "country": "US"
  }
}
```

#### OAuth Endpoints

```http
GET /api/v1/auth/google          # Initiates Google OAuth
GET /api/v1/auth/google/callback # Google OAuth callback

GET /api/v1/auth/github          # Initiates GitHub OAuth
GET /api/v1/auth/github/callback # GitHub OAuth callback

GET /api/v1/auth/facebook          # Initiates Facebook OAuth
GET /api/v1/auth/facebook/callback # Facebook OAuth callback
```

### User Management Endpoints

All user management endpoints require authentication.

#### List Users (with Pagination)

```http
GET /api/v1/users?page=1&limit=10
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
**Response (200):**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "isActive": true,
        "role": {
          "name": "User"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "totalCount": 50
    }
  },
  "message": "Users retrieved successfully"
}
```

#### Get User by ID

```http
GET /api/v1/users/:id
Authorization: Bearer <access_token>
```

#### Create User

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

**Required Role:** `admin`

#### Update User

```http
PUT /api/v1/users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name",
  "isActive": false
}
```

**Required Permission:** `users:update`

#### Delete User

```http
DELETE /api/v1/users/:id
Authorization: Bearer <access_token>
```

**Required Role:** `admin` plus `users:delete` permission

### File Upload

```http
POST /api/v1/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <binary file data>
```

**Constraints:**

- Maximum file size: 5MB
- Allowed types: JPEG, PNG, GIF, PDF
- Requires authentication

**Response (201):**

```json
{
  "success": true,
  "data": {
    "filename": "file-1704369600000-123456789.jpg",
    "originalname": "file.jpg",
    "size": 1234567,
    "mimetype": "image/jpeg",
    "path": "/uploads/file-1704369600000-123456789.jpg"
  },
  "message": "File uploaded successfully"
}
```

### Health Check

```http
GET /api/v1/health
```

No authentication required.

**Response (200):**

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

### Response Format

#### Success Response

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Operation successful"
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      /* additional error details */
    }
  }
}
```

### Error Codes

| HTTP Status | Error Code              | Description                  |
| ----------- | ----------------------- | ---------------------------- |
| 400         | `VALIDATION_ERROR`      | Input validation failed      |
| 400         | `DUPLICATE_RESOURCE`    | Resource already exists      |
| 400         | `FILE_UPLOAD_ERROR`     | File upload failed           |
| 400         | `FILE_TOO_LARGE`        | File exceeds size limit      |
| 400         | `INVALID_FILE_TYPE`     | File type not allowed        |
| 401         | `AUTHENTICATION_ERROR`  | Authentication failed        |
| 401         | `INVALID_CREDENTIALS`   | Invalid email or password    |
| 401         | `TOKEN_EXPIRED`         | JWT token expired            |
| 401         | `INVALID_TOKEN`         | Invalid JWT token            |
| 401         | `REFRESH_TOKEN_INVALID` | Invalid refresh token        |
| 401         | `REFRESH_TOKEN_EXPIRED` | Refresh token expired        |
| 403         | `AUTHORIZATION_ERROR`   | Insufficient permissions     |
| 404         | `RESOURCE_NOT_FOUND`    | Requested resource not found |
| 429         | `RATE_LIMIT_EXCEEDED`   | Too many requests            |
| 503         | `REQUEST_TIMEOUT`       | Request timed out            |
| 500         | `SERVER_ERROR`          | Internal server error        |
| 500         | `DATABASE_ERROR`        | Database operation failed    |

## 📁 Project Structure

```
mm-backend-core/
├── src/
│   ├── config/              # Configuration files
│   │   ├── db.js            # MongoDB connection
│   │   ├── env.js           # Environment validation
│   │   ├── oauth.js         # Passport strategy wiring
│   │   └── oauth/           # OAuth provider strategies
│   │       └── oauth-utils.js
│   ├── constants/           # Application constants
│   │   └── api-error-codes.js
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── upload.controller.js
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.js      # JWT verification + authZ helpers
│   │   ├── correlationId.js        # Correlation IDs
│   │   ├── errorHandler.js         # Global error handler
│   │   ├── rateLimiter.js          # Rate limiting
│   │   ├── requestLogger.js        # HTTP request logging
│   │   ├── requestSanitizer.js     # Mongo sanitize
│   │   ├── requestTimeout.js       # Request timeout guard
│   │   ├── upload.js               # File upload handling
│   │   └── notFound.js             # 404 handler
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Role.js
│   │   ├── Permission.js
│   │   └── RefreshToken.js
│   ├── routes/              # Route definitions
│   │   ├── auth.routes.js
│   │   ├── health.routes.js
│   │   ├── oauth.routes.js
│   │   ├── user.routes.js
│   │   ├── upload.routes.js
│   │   └── index.js
│   ├── services/            # Business logic
│   │   ├── auth/
│   │   │   ├── core.service.js
│   │   │   ├── password.service.js
│   │   │   ├── profile.service.js
│   │   │   └── token.service.js
│   │   ├── user.service.js
│   ├── utils/               # Utility functions
│   │   ├── auth-helpers.js        # Auth helpers
│   │   ├── cookie-options.js      # Cookie defaults
│   │   ├── error-factories.js     # Error helpers
│   │   ├── jwt.js                 # JWT helpers
│   │   ├── asyncHandler.js        # Async wrapper
│   │   ├── logger.js              # Winston logger
│   │   ├── pagination.js          # Pagination helpers
│   │   ├── password.js            # Password helpers
│   │   ├── permission-utils.js    # Permission helpers
│   │   ├── response.js            # Response formatter
│   │   └── role-utils.js          # Role helpers
│   ├── validators/          # Input validation schemas
│   │   ├── authValidate.js
│   │   ├── uploadValidate.js
│   │   ├── userValidate.js
│   │   └── validatorUtils.js
│   ├── app.js               # Express app setup
│   ├── server.js            # Entry point
│   └── seed.js              # Database seeder
├── tests/                   # Test files
│   └── setup.js             # Test configuration
├── uploads/                 # Uploaded files (gitignored)
├── logs/                    # Application logs (gitignored)
├── .env.example             # Environment template
├── .env.docker              # Docker environment defaults
├── .dockerignore
├── .gitignore
├── docker-compose.yml       # Docker Compose setup
├── Dockerfile               # Docker image definition
├── eslint.config.cjs        # ESLint configuration
├── package.json
├── readme.md
└── vitest.config.js         # Test configuration
```

## 🔒 Security Features

- ✅ **Password Security**
  - Bcrypt hashing with 12 salt rounds
  - Password complexity requirements
  - Secure password change flow

- ✅ **JWT Token Security**
  - Access tokens (short-lived, 15 minutes)
  - Refresh tokens (longer-lived, 7 days)
  - Refresh token rotation (one-time use with reuse detection)
  - Token blacklisting on logout

- ✅ **Cookie Security**
  - httpOnly cookies for refresh tokens
  - Secure flag in production (HTTPS only)
  - SameSite policy (CSRF protection)

- ✅ **Request Security**
  - Rate limiting (global and route-specific)
  - Request body size limits
  - Input validation with Zod
  - MongoDB injection prevention
  - XSS protection via Helmet
  - Correlation IDs for tracing
  - Request timeout guard

- ✅ **CORS Configuration**
  - Whitelisted origins only
  - Credentials support
  - Configurable per environment

- ✅ **File Upload Security**
  - File type validation
  - File size limits
  - Secure filename generation

- ✅ **Auto-Cleanup**
  - TTL indexes for expired tokens
  - Automatic token expiration

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Environment

Tests use MongoDB Memory Server, so no MongoDB instance is required. The test database is created in memory and destroyed after tests complete.

### Example Test

```javascript
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "test@example.com",
      password: "Test123!@#",
      firstName: "Test",
      lastName: "User",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe("test@example.com");
  });
});
```

## 🐳 Docker Support

### Using Docker Compose (Recommended)

```bash
# Start all services (API + MongoDB)
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build
```

Services:

- API: `http://localhost:3000`
- MongoDB: `localhost:27017`

### Using Docker Only

```bash
# Build image
docker build -t express-api .

# Run container (requires external MongoDB)
docker run -p 3000:3000 --env-file .env.development express-api
```

### Docker Environment

The Docker setup uses `.env.docker` which is configured for container networking:

```bash
MONGODB_URI=mongodb://mongo:27017/my_app_db
```

Note: Use service name `mongo` instead of `localhost` when running in Docker Compose.

## 🚀 Deployment

### Environment Setup for Production

```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=<your_production_mongodb_uri>
JWT_ACCESS_SECRET=<your_production_access_secret>
JWT_REFRESH_SECRET=<your_production_refresh_secret>
COOKIE_SECURE=true
CORS_ORIGIN=https://your-frontend-domain.com
```

### MongoDB Atlas (Recommended for Production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (M0 free tier available)
3. Create database user with strong password
4. Network Access: Add your application's IP address
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

### Deployment Platforms

**Heroku:**

```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your_atlas_uri>
# Set other environment variables
git push heroku main
```

**Railway:**

1. Connect GitHub repository
2. Add MongoDB Atlas connection string
3. Set environment variables
4. Deploy automatically on push

**DigitalOcean App Platform:**

1. Create new app from GitHub
2. Add environment variables
3. Configure build command: `npm install`
4. Configure run command: `npm start`

## 📜 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run dev:env      # Start dev server with NODE_ENV=development
npm start            # Start production server
npm run start:prod   # Start production server with NODE_ENV=production
npm run seed         # Seed database with test data
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Check code formatting
npm run format:fix   # Fix code formatting
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run jscpd        # Detect code duplication
```

## 🛠️ Development Tools

### Code Quality

- **ESLint**: Linting with standard Node.js configuration
- **Prettier**: Code formatting
- **JSCPD**: Copy-paste detection

### Logging

Winston logger with multiple transports:

- Console output (development)
- File output (production)
- JSON formatting for easy parsing

### Request Logging

Morgan middleware for HTTP request logging in development.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Contribution Guidelines

- Follow existing code style (ESLint + Prettier)
- Add tests for new features
- Update documentation
- Keep commits atomic and well-described

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 Tips & Best Practices

### Security Checklist for Production

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS (set `COOKIE_SECURE=true`)
- [ ] Whitelist CORS origins
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Set up rate limiting
- [ ] Enable security headers (Helmet)
- [ ] Regular dependency updates
- [ ] Monitor logs for suspicious activity

### Performance Tips

- [ ] Enable MongoDB indexes
- [ ] Use connection pooling
- [ ] Implement caching (Redis)
- [ ] Enable gzip compression
- [ ] Use PM2 cluster mode
- [ ] Monitor memory usage
- [ ] Set up CDN for static files

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/mm-backend-core/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mm-backend-core/discussions)

## 🙏 Acknowledgments

Built with:

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Passport.js](http://www.passportjs.org/)
- [Winston](https://github.com/winstonjs/winston)
- [Zod](https://zod.dev/)

---

**Happy Coding! 🚀**
