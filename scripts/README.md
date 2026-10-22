# Building the extension

The extension host and all nine Webviews are bundled with esbuild.

- `yarn package`: minified production bundles in `dist/`, with console/debugger removed, followed by extension module-loading and Webview output parsing checks.
- `yarn compile` / `yarn package:test`: development bundles and source maps.
- `yarn watch`: rebuild extension and Webview bundles on source changes.
- `yarn start`: watch both targets and serve Webviews on port 8080, using the existing `*.bundle.js` development URLs. Reload the panel to see changes; this server does not provide React HMR.
- `yarn build`: run the production build and package the VSIX using `vsce`.
- `node scripts/build.cjs --production --analyze`: print total Webview output size, each entry's initial dependency graph size, and its largest dependencies. Initial graph size includes shared static imports but excludes dynamically imported features.

Webviews use ESM and share hashed files in `dist/chunks/`. Keep that directory
alongside the entry files when packaging or copying the build. Webview HTML loads
entries with `type="module"`; relative chunk imports work with VS Code resource
URLs and the development server. The extension host remains a CommonJS bundle.

PDF previews, variable-insertion popovers, schema Mock generation, request-body
Mock generation, and expression parsing load on demand. Existing dynamic Mermaid
and other feature imports now produce separate chunks too. These features still
contribute to the package size, but their code is deferred until requested.

The build keeps CSS inside JavaScript, converts imported SVGs into React components,
copies `public/` and the curl parser WASM files, and preserves the existing CSS class
renaming and browser Node polyfills. Assets referenced by CSS are embedded; absolute
public URLs remain unchanged. esbuild does not type-check TypeScript; use `yarn tsc --noEmit`
separately when checking types.

Watch mode tracks imported source and styles. Restart it after editing files in
`public/` so the copied assets are refreshed.

Packaging still checks production dependencies through `vsce`. Changing bundlers does
not bypass Yarn registry or dependency-resolution failures.
