import { createHash } from 'node:crypto';

/** Shared slots preserve cross-component overrides through module exports. */
export function generateScopedName(name, filename) {
  const normalized = filename.replaceAll('\\', '/');
  const shared = normalized.endsWith('/ui/base/slots.module.css');
  const slot = shared ? name : name.startsWith('slot-') ? name.slice(5) : undefined;
  const relative = normalized.includes('/src/')
    ? `src/${normalized.split('/src/').at(-1)}`
    : normalized;
  const identity = slot === undefined ? `${relative}:${name}` : `echoapi-slot:${slot}`;
  const hash = createHash('sha256').update(identity).digest('hex').slice(0, 8);
  return `_${slot ?? name}_${hash}`;
}

/** Let side-effect stylesheets reference exported slots without becoming modules. */
export function sharedSlots() {
  const visited = new WeakSet();
  return {
    postcssPlugin: 'echoapi-shared-slots',
    Rule(rule) {
      if (visited.has(rule)) return;
      visited.add(rule);
      const filename = rule.source?.input.file;
      if (!filename) return;
      // rc-tree-select generates these same slots internally; our Select uses
      // module exports. Both implementations share the component overrides.
      rule.selector = rule.selector.replace(/\.slot-(beautify-select(?:-[\w-]+)?)(?![\w-])/g,
        (_, name) => `:is(.slot-${name}, [class~="${name}"])`,
      );
      if (filename.endsWith('.module.css')) return;
      rule.selector = rule.selector.replace(/\.slot-([\w-]+)/g, (_, name) =>
        `.${generateScopedName(`slot-${name}`, filename)}`,
      );
    },
  };
}
