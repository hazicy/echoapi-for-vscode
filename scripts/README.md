# Building the extension

Use Node.js 22.12+ (or 20.19+) and Yarn Classic. The extension host uses tsup;
all nine React Webviews use Vite. Build behavior lives in the root configuration
files, with no custom build runner.

- `yarn compile` / `yarn package:test`: development bundles with source maps.
- `yarn package`: production bundles, then extension module-loading and Webview output checks.
- `yarn watch`: watch both targets and rebuild local files.
- `yarn start`: watch the extension and run the Vite development server on port 8080.
  Launch the extension after its first build; React Webviews then use Vite HMR.
- `yarn build`: create the production VSIX using `vsce`.
- `yarn build:extension`: build only the CommonJS extension host.
- `yarn build:webviews`: build only the Webviews. This clears `dist/` before building,
  so run `yarn build:extension` afterwards if you need a complete extension.

Full builds run Vite before tsup so stale Webview chunks are removed without
removing the extension bundle. Watch mode preserves the shared output directory.
Run a full build before packaging or copying output.

Webviews use ESM with shared/lazy files in `dist/chunks/`, assets in `dist/assets/`,
and extracted styles in `dist/webviews.css`. Keep these alongside the entry files.
The extension-generated HTML explicitly loads the stylesheet in local mode and
Vite's client/React refresh runtime in development server mode. `yarn compile`
and `yarn watch` use local bundles; only `yarn start` enables the server URLs.

Vite handles CSS Modules (`*.module.css`), regular CSS, Less, SVG React components,
and public assets. Its plugins provide browser Node polyfills and copy the curl
parser WASM files. Public files are served directly in development and copied into
`dist/` for builds. Selector prefixes are stored explicitly in source rather than
rewritten during bundling. tsup also copies `public/` so extension icons and fonts
are available when using `yarn start`.

Both tools transpile TypeScript without checking types. Use `yarn tsc --noEmit`
separately. Existing third-party dependency/type errors may still require follow-up.

## UI migration

The target component library is `@base-ui/react`, with CSS Modules for styles.
The parameter description picker now uses Base UI Popover and Tooltip, including
keyboard selection, focus restoration, and immediate project-setting updates.
The remaining components still depend on Ant Design and styled-components until
their APIs, theme use, and styles have been migrated; these dependencies remain
installed intentionally.

Run `yarn playwright install chromium` once, then `yarn test:ui` after a full build
for picker interaction tests and production module-loading smoke tests of all nine
Webviews. The smoke tests provide a minimal VS Code bridge and check initial render;
they do not emulate the extension's backend or exercise every screen workflow.

## Embedded editors

All embedded editors use CodeMirror 6 through `src/components/business/CodeEditor`.
Language parsers and Prettier formatters load on demand. JSON formatting uses
`jsonc-parser` to preserve comments, trailing commas, and large numeric literals.
Environment history comparisons use the read-only CodeMirror merge view.

Run `yarn test:editor` for existing browser regressions covering controlled edits,
undo, variables, completion, formatting, read-only views, themes, and comparisons.
The editor fixture has isolated settings and variable lookup and needs no API server.

## Build language

By default, one build follows the VS Code display language at runtime. The extension
initializes translations before translated constants are evaluated. Webviews receive
the resolved language through their HTML `lang` attribute. Simplified Chinese
(`zh-CN`, `zh-Hans`, `zh-SG`) selects Chinese; other locales fall back to English.

To force a build language, create an untracked `.env.local` file at the project root:

```dotenv
ECHOAPI_LANGUAGE=zh-cn
```

Supported values are `auto`, `en`, and `zh-cn`. Both build configurations use the
same value. Restart watchers after changing it. Vite also supports mode-specific
files such as `.env.production.local`. Direct browser development follows the
browser language when no forced language is configured. Native command titles and
settings descriptions use VS Code `package.nls` localization.

Packaging still checks production dependencies through `vsce`; changing bundlers
does not bypass registry or dependency-resolution failures.
