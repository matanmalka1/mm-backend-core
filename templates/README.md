# Templates Index

Composable Express API templates for common backend features. Pick a template, copy it, and start building.

## Quick start

```bash
cp -R templates/<template-name> my-api
cd my-api
npm install
set up environment variables (see the template readme)
npm run dev
```

## Template catalog

### Core
- `minimal` - Smallest production-ready REST API base.
- `full` - Full-stack feature set: auth, roles, OAuth, uploads, logging, and more.

## Common defaults

- Node.js: see each template `package.json` engines field
- Start scripts: `npm run dev` for development, `npm start` for production
- Environment: copy `.env.example` and fill values

## Notes

- Some templates require external services (MongoDB, Redis, OAuth provider apps).
- Templates are designed to be composable; you can merge features as needed.
