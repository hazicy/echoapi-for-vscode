# Webview startup performance

The request editor loads its selected protocol with `React.lazy`. Code generation
and CSV parsing load on demand. The editor requests `getInitialData` after
registering its message listener; the host replies with the active request and
configuration in one message. The full collection is requested after the selected
protocol commits and has a paint opportunity. Collection-dependent controls still
receive the complete collection.

To inspect startup in VS Code, open **Developer: Open Webview Developer Tools**,
select the request Webview's console context, and run:

```js
console.table(
  performance.getEntriesByType('measure')
    .filter(entry => entry.name.startsWith('okapi:'))
    .map(({ name, duration }) => ({ name, milliseconds: duration.toFixed(1) })),
);
```

- `okapi:html-to-react`: HTML bootstrap to the root's first effect, including
  static module loading and execution.
- `okapi:react-to-data`: initialization request and state updates.
- `okapi:data-to-content`: selected protocol loading and React commit.
- `okapi:html-to-content`: overall time between HTML bootstrap and protocol commit.

These measures exclude extension activation and panel creation before HTML
bootstrap. A commit does not guarantee that every nested asynchronous editor has
finished loading or that the browser has painted. Compare cold opens separately
from existing panel reveals, which retain their context.

The extension uses ESM code splitting; import/export converters and Mock expression
libraries load when used. The variable insertion editor also loads on opening its
popover. Shared host utilities must import individual stores, rather than the
application store barrel, to avoid pulling UI initialization into the extension.

Both build tools use `scripts/faker-locales.mjs`. Faker v9 keeps the seven locales
supported by the expression parser, including its English fallback. The legacy
Mock adapter retains its v6 English instance and API; it no longer includes every
locale. Do not force the legacy dependency to v9 without migrating its removed
APIs. `tests/mockBundling.test.mjs` checks legacy generators, expression languages,
Schema generation, and request-body generation against the optimized bundle.

To measure the extension, build with `yarn tsup --minify --metafile` and inspect
`dist/metafile-esm.json`. Count the entry and its recursive static imports as the
startup payload; a smaller entry alone does not prove that startup loads less.
The separate HTTP Worker runtime is excluded from these extension bundle totals.

The production startup regression is in `tests/ui/startup.spec.ts`. Run it after
building Webviews:

```sh
yarn build:webviews
yarn playwright test --config tests/ui/playwright.config.ts tests/ui/startup.spec.ts
```
