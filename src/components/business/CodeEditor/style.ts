import styled from 'styled-components';

export const EditorWrap = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  border-bottom: 1px solid var(--color-border);

  .code-editor-host {
    height: 100%;
    overflow: hidden;
  }
  .cm-editor {
    height: 100%;
  }
  .cm-scroller {
    scrollbar-width: thin;
  }
  .cm-scroller::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .cm-scroller::-webkit-scrollbar-thumb {
    background: var(--vscode-scrollbarSlider-background, #8886);
  }
`;
