import { StreamLanguage } from '@codemirror/language';
import type { Extension } from '@codemirror/state';

export function normalizeLanguage(language = 'text') {
  const name = language.toLowerCase();
  return (
    (
      {
        js: 'javascript',
        node: 'javascript',
        ts: 'typescript',
        jsonc: 'json',
        htm: 'html',
        yml: 'yaml',
        sh: 'shell',
        bash: 'shell',
        curl: 'shell',
        py: 'python',
        c: 'cpp',
        'c++': 'cpp',
        'c#': 'csharp',
        cs: 'csharp',
        'objective-c': 'objectivec',
        plaintext: 'text',
        txt: 'text',
      } as Record<string, string>
    )[name] || name
  );
}

// Language parsers are separate chunks, loaded only when an editor needs them.
const loaders: Record<string, () => Promise<Extension>> = {
  json: () => import('@codemirror/lang-json').then((m) => m.json()),
  javascript: () => import('@codemirror/lang-javascript').then((m) => m.javascript()),
  typescript: () =>
    import('@codemirror/lang-javascript').then((m) => m.javascript({ typescript: true })),
  xml: () => import('@codemirror/lang-xml').then((m) => m.xml()),
  html: () => import('@codemirror/lang-html').then((m) => m.html()),
  css: () => import('@codemirror/lang-css').then((m) => m.css()),
  sql: () => import('@codemirror/lang-sql').then((m) => m.sql()),
  python: () => import('@codemirror/lang-python').then((m) => m.python()),
  java: () => import('@codemirror/lang-java').then((m) => m.java()),
  php: () => import('@codemirror/lang-php').then((m) => m.php()),
  cpp: () => import('@codemirror/lang-cpp').then((m) => m.cpp()),
  graphql: () => import('cm6-graphql').then((m) => m.graphql()),
  yaml: () =>
    import('@codemirror/legacy-modes/mode/yaml').then((m) => StreamLanguage.define(m.yaml)),
  shell: () =>
    import('@codemirror/legacy-modes/mode/shell').then((m) => StreamLanguage.define(m.shell)),
  go: () => import('@codemirror/legacy-modes/mode/go').then((m) => StreamLanguage.define(m.go)),
  ruby: () =>
    import('@codemirror/legacy-modes/mode/ruby').then((m) => StreamLanguage.define(m.ruby)),
  swift: () =>
    import('@codemirror/legacy-modes/mode/swift').then((m) => StreamLanguage.define(m.swift)),
  csharp: () =>
    import('@codemirror/legacy-modes/mode/clike').then((m) => StreamLanguage.define(m.csharp)),
  objectivec: () =>
    import('@codemirror/legacy-modes/mode/clike').then((m) => StreamLanguage.define(m.objectiveC)),
  kotlin: () =>
    import('@codemirror/legacy-modes/mode/clike').then((m) => StreamLanguage.define(m.kotlin)),
  powershell: () =>
    import('@codemirror/legacy-modes/mode/powershell').then((m) =>
      StreamLanguage.define(m.powerShell)
    ),
};

export async function loadLanguage(language: string): Promise<Extension> {
  return loaders[normalizeLanguage(language)]?.() ?? [];
}
