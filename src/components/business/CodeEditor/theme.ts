import { EditorView } from '@codemirror/view';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark';

export function editorTheme(dark: boolean, fontSize = 14, fontFamily = 'monospace') {
  return [
    syntaxHighlighting(dark ? oneDarkHighlightStyle : defaultHighlightStyle),
    EditorView.theme(
      {
        '&': {
          height: '100%',
          fontSize: `${fontSize}px`,
          color: 'var(--vscode-editor-foreground, inherit)',
          backgroundColor: 'var(--vscode-editor-background, var(--color-bg-right))',
        },
        '.cm-scroller': { overflow: 'auto', fontFamily: fontFamily || 'monospace' },
        '.cm-content': { minHeight: '100%' },
        '.cm-gutters': {
          backgroundColor: 'var(--vscode-editorGutter-background, var(--vscode-editor-background, var(--color-bg-right)))',
          color: 'var(--vscode-editorLineNumber-foreground, #888)',
          borderRight: 'none',
        },
        '.cm-activeLine': {
          backgroundColor: 'var(--vscode-editor-lineHighlightBackground, transparent)',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'transparent',
          color: 'var(--vscode-editorLineNumber-activeForeground, var(--vscode-editor-foreground))',
        },
        '.cm-selectionBackground': {
          backgroundColor: 'var(--vscode-editor-inactiveSelectionBackground, var(--vscode-editor-selectionBackground, Highlight))',
        },
        '&.cm-focused .cm-selectionBackground, .cm-content ::selection': {
          backgroundColor: 'var(--vscode-editor-selectionBackground, Highlight)',
        },
        '.cm-cursor': { borderLeftColor: 'var(--vscode-editorCursor-foreground, currentColor)' },
        '.cm-tooltip': {
          zIndex: '100',
          maxWidth: 'min(600px, 90vw)',
          color: 'var(--vscode-editorHoverWidget-foreground, var(--vscode-editor-foreground))',
          backgroundColor: 'var(--vscode-editorHoverWidget-background, var(--vscode-editor-background))',
          border: '1px solid var(--vscode-editorHoverWidget-border, transparent)',
        },
        '.cm-panels': {
          color: 'var(--vscode-editorWidget-foreground, var(--vscode-editor-foreground))',
          backgroundColor: 'var(--vscode-editorWidget-background, var(--vscode-editor-background))',
        },
        '.cm-searchMatch': {
          backgroundColor: 'var(--vscode-editor-findMatchHighlightBackground, transparent)',
        },
        '.cm-searchMatch.cm-searchMatch-selected': {
          backgroundColor: 'var(--vscode-editor-findMatchBackground, transparent)',
        },
        '&.cm-focused': { outline: 'none' },
      },
      { dark }
    ),
  ];
}

export function isDarkTheme(name: string) {
  return !/light|lighter|powershell ise/i.test(name);
}
