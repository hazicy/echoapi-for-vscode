import { EditorView } from '@codemirror/view';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';

export function editorTheme(dark: boolean, fontSize = 14, fontFamily = 'monospace') {
  return [
    dark ? oneDark : syntaxHighlighting(defaultHighlightStyle),
    EditorView.theme(
      {
        '&': {
          height: '100%',
          fontSize: `${fontSize}px`,
          color: 'var(--vscode-editor-foreground, inherit)',
          backgroundColor: 'var(--color-bg-right)',
        },
        '.cm-scroller': { overflow: 'auto', fontFamily: fontFamily || 'monospace' },
        '.cm-content': { minHeight: '100%' },
        '.cm-gutters': {
          backgroundColor: 'var(--color-bg-right)',
          color: 'var(--vscode-editorLineNumber-foreground, #888)',
          borderRight: '1px solid var(--color-border)',
        },
        '.cm-activeLine, .cm-activeLineGutter': {
          backgroundColor: 'var(--vscode-editor-lineHighlightBackground, transparent)',
        },
        '.cm-cursor': { borderLeftColor: 'var(--vscode-editorCursor-foreground, currentColor)' },
        '.cm-tooltip': { zIndex: '100', maxWidth: 'min(600px, 90vw)' },
        '&.cm-focused': { outline: 'none' },
      },
      { dark }
    ),
  ];
}

export function isDarkTheme(name: string) {
  return !/light|lighter|powershell ise/i.test(name);
}
