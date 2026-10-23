# Source layout

Code is organized by product feature. Keep a feature's components, state, hooks,
types, constants, events, and utilities together instead of adding global layers.

```text
src/
  app/
    webviews/                 # React entry points and VS Code bridge setup
    store/                    # Application state and store exports
  features/
    requests/                 # HTTP, GraphQL, SSE, WebSocket and Socket.IO
    collections/              # Collection tree and folder settings
    environment/              # Environments, cookies and parameters
    testing/                  # Collection runs and reports
    schemas/                  # JSON Schema editing
    import/                   # Import and migration
    export/                   # Export formats and previews
    sync/                     # Push, conflicts and version comparison
    sharing/                  # Sharing and shared documents
    project/                  # Project configuration
    auth/                     # Login and user configuration
    settings/                 # Application settings
    variables/                # Variable inputs and insertion
    documentation/            # Documentation view
    curl/                     # cURL tools
  shared/
    ui/                       # UI primitives
    components/               # Reusable composed components and editors
    hooks/                    # Generic React hooks
    utils/                    # General utilities
    services/                 # Service transport
    assets/                   # Shared images and styles
    locale/                   # Localization
    theme/                    # Theme configuration
    contexts/                 # Shared React contexts
    types/                    # Common types
    constants/                # Common constants
  extension/                  # VS Code host, persistence and message handlers
  extension.ts                # VS Code activation entry
```

## Naming and imports

- Use PascalCase for React component names, component files and component folders:
  `SidePanel.tsx`, `EditItem.tsx`, `components/ImportData/index.tsx`.
- An `index.tsx` component entry is allowed inside a PascalCase component folder.
- Hooks keep the `useSomething` convention. Utilities, styles, contexts and barrel
  files retain names that describe their role.
- Put feature-specific code in `features/<feature>/`, with `components/`, `store/`,
  `hooks/`, `types/`, `constants/`, `events/` and `utils/` as needed.
- Import feature components and hooks from their feature paths; do not re-export
  them from shared barrels. Shared barrels expose reusable building blocks only.
- Use `@/features/...`, `@/shared/...` and `@/app/...` for cross-directory imports.
  Relative imports are suitable within a component or feature.
- Public panel IDs and generated bundle names remain camelCase. Their source
  files under `app/webviews/` use PascalCase in both Vite and development URLs.
