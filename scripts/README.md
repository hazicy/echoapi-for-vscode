# Building the extension

The extension host and all ten Webviews are bundled with esbuild.

- `yarn package`: minified production bundles in `dist/`, with console/debugger removed.
- `yarn compile` / `yarn package:test`: development bundles and source maps.
- `yarn watch`: rebuild extension and Webview bundles on source changes.
- `yarn start`: watch both targets and serve Webviews on port 8080, using the existing `*.bundle.js` development URLs. Reload the panel to see changes; this server does not provide React HMR.
- `yarn build`: run the production build and package the VSIX using `vsce`.

The build keeps CSS inside JavaScript, converts imported SVGs into React components,
copies `public/` and the curl parser WASM files, and preserves the existing CSS class
renaming and browser Node polyfills. Assets referenced by CSS are embedded; absolute
public URLs remain unchanged. esbuild does not type-check TypeScript; use `yarn tsc --noEmit`
separately when checking types.

Watch mode tracks imported source and styles. Restart it after editing files in
`public/` so the copied assets are refreshed.

Packaging still checks production dependencies through `vsce`. Changing bundlers does
not bypass Yarn registry or dependency-resolution failures.
