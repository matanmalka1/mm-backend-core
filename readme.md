# mm-backend-core

CLI to generate the mm-backend-core backend template.

## Usage

Global install:

```sh
npm i -g mm-backend-core
mm-backend-core init my-app
```

Local install + npx:

```sh
npm i mm-backend-core
npx mm-backend-core init my-app
```

Other commands:

```sh
mm-backend-core info
mm-backend-core doctor
mm-backend-core config
mm-backend-core templates
mm-backend-core template <name>
mm-backend-core lint [dir]
mm-backend-core test [dir]
```

## Templates

List available templates and get details:

```sh
mm-backend-core templates
mm-backend-core template <name>
```

Defaults: `full` is used unless you pass `--minimal` or `--template <name>`.

Install a specific template:

```sh
# Full template (default)
mm-backend-core init my-app --template full

# Minimal template
mm-backend-core init my-app --minimal
```

## OAuth add-on

Install optional OAuth dependencies:

```sh
npm install passport passport-google-oauth20 passport-github2 passport-facebook cookie-parser
```

Import the OAuth helper and router directly:

```js
import cookieParser from "cookie-parser";
import passport from "passport";
import { configureOAuth, oauthRouter } from "mm-backend-core/oauth";

app.use(cookieParser());
configureOAuth({
  findOrCreateUser: async (profile, provider) => {
    // Connect this to your user model and return a user object.
    return { id: profile.id, provider };
  },
});
app.use(passport.initialize());
app.use("/api/v1/auth", oauthRouter);
```

Required environment variables:

```
GOOGLE_CLIENT_ID=change-me
GOOGLE_CLIENT_SECRET=change-me
GITHUB_CLIENT_ID=change-me
GITHUB_CLIENT_SECRET=change-me
FACEBOOK_CLIENT_ID=change-me
FACEBOOK_CLIENT_SECRET=change-me
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## Quick Start

```sh
npm i -g mm-backend-core
mm-backend-core init my-app
cd my-app
npm install
npm run dev
```
