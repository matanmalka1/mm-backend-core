# Templates Index

Composable Express API templates for common backend features. Pick a template, copy it, and start building.

## Quick start

```bash
cp -R templates/<template-name> my-api
cd my-api
npm install
cp .env.example .env.development
npm run dev
```

## Template catalog

### Core
- `minimal` - Smallest production-ready REST API base.
- `full` - Full-stack feature set: auth, roles, OAuth, uploads, logging, and more.

### Auth
- `auth-basic-jwt` - JWT auth with refresh tokens.
- `auth-roles-permissions` - RBAC with roles and permissions.
- `oauth-google` - Google OAuth integration.
- `oauth-github` - GitHub OAuth integration.

### API features
- `pagination-filtering` - Pagination and query filtering helpers.
- `swagger-openapi` - OpenAPI/Swagger docs wiring.
- `validation-zod` - Zod-based request validation.

### Security
- `security-helmet-cors` - Helmet + CORS configuration.
- `sanitize-mongo` - MongoDB injection sanitization.
- `rate-limit-memory` - In-memory rate limiter.
- `rate-limit-redis` - Redis-backed rate limiter.

### Uploads
- `upload-multer-basic` - Basic file upload handling.
- `upload-multer-validation` - Uploads with file validation.

### Ops and observability
- `logging-request-correlation` - Request logging + correlation IDs.

### Utility
- `health-only` - Minimal health endpoint template.

## Feature matrix

| Template | Auth | OAuth | RBAC | Validation | Docs | Rate limit | Uploads | Logging | Health |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| minimal | - | - | - | - | - | - | - | - | - |
| full | yes | yes | yes | yes | yes | yes | yes | yes | yes |
| auth-basic-jwt | yes | - | - | - | - | - | - | - | - |
| auth-roles-permissions | yes | - | yes | - | - | - | - | - | - |
| oauth-google | yes | yes | - | - | - | - | - | - | - |
| oauth-github | yes | yes | - | - | - | - | - | - | - |
| pagination-filtering | - | - | - | - | - | - | - | - | - |
| swagger-openapi | - | - | - | - | yes | - | - | - | - |
| validation-zod | - | - | - | yes | - | - | - | - | - |
| security-helmet-cors | - | - | - | - | - | - | - | - | - |
| sanitize-mongo | - | - | - | - | - | - | - | - | - |
| rate-limit-memory | - | - | - | - | - | yes | - | - | - |
| rate-limit-redis | - | - | - | - | - | yes | - | - | - |
| upload-multer-basic | - | - | - | - | - | - | yes | - | - |
| upload-multer-validation | - | - | - | yes | - | - | yes | - | - |
| logging-request-correlation | - | - | - | - | - | - | - | yes | - |
| health-only | - | - | - | - | - | - | - | - | yes |

## Common defaults

- Node.js: see each template `package.json` engines field
- Start scripts: `npm run dev` for development, `npm start` for production
- Environment: copy `.env.example` and fill values

## Notes

- Some templates require external services (MongoDB, Redis, OAuth provider apps).
- Templates are designed to be composable; you can merge features as needed.
