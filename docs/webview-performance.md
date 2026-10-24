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

The production startup regression is in `tests/ui/startup.spec.ts`. Run it after
building Webviews:

```sh
yarn build:webviews
yarn playwright test --config tests/ui/playwright.config.ts tests/ui/startup.spec.ts
```
