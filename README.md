<p align="center">
  <img src="./public/images/okapi-logo.png" alt="okapi" width="312" />
</p>

# okapi

A lightweight API client for Visual Studio Code. Create requests, manage environments, and inspect responses without leaving your editor.

## Features

- HTTP requests with query parameters, headers, authentication, and request bodies.
- WebSocket, Socket.IO, SSE, and GraphQL support.
- Local collections and environment variables, with no sign-in required for local use.
- Collection runs, assertions, and response inspection.
- Postman-compatible scripts and collection import/export.
- A compact interface that follows your VS Code theme.

## Install

Install the packaged `.vsix` through **Extensions → … → Install from VSIX…**. Open **okapi** in the activity bar to start a collection or create a request.

## Development

```sh
yarn install
yarn start
```

Build and check the extension:

```sh
yarn package
```

See [the development guide](./scripts/README.md) for webview builds, localization, and browser tests.
See [the source layout guide](./src/README.md) for feature ownership and component naming.

Lint and format project code with Oxlint and Oxfmt:

```sh
yarn lint
yarn lint:fix
yarn format
yarn format:check
```

Formatting excludes bundled public assets and build output. Prettier remains a
runtime dependency for formatting request content inside the API editor.
Oxlint keeps the previous curly-brace, equality, and thrown-value checks;
Oxfmt handles semicolons. The previous import naming-convention rule has no
direct Oxlint equivalent and is not enabled.

## Brand assets

- [Logo](./public/images/okapi-logo.svg)
- [Icon](./public/images/okapi-icon.svg)
- [VS Code activity icon](./public/images/okapi-activity.svg)

Regenerate the PNG icons after changing the source SVG:

```sh
node scripts/generate-brand-icons.cjs
```

Existing local data and collection format identifiers remain compatible with the upstream project.

## Feedback and license

[Report an issue](https://github.com/hazicy/echoapi-for-vscode/issues) · [Source](https://github.com/hazicy/echoapi-for-vscode)

Based on the open-source EchoAPI extension. Original copyright notices are retained in [LICENSE.txt](./LICENSE.txt).
