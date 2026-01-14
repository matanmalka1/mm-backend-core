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

## Quick Start

```sh
npm i -g mm-backend-core
mm-backend-core init my-app
cd my-app
npm install
npm run dev
```
