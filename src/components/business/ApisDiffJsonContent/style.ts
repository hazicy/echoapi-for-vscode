import styled from 'styled-components';

export const ContentWrap = styled.div`
  height: 500px;
  overflow: auto;

  .beautify-collapse-content-box {
    padding: 0 !important;
  }
`;

export const VersionEditWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 320px;

  .code-diff-host { height: 100%; min-height: 0; }
  .cm-mergeView { height: 100%; }
  .cm-mergeViewEditors { height: 100%; }
  .cm-mergeViewEditor { min-width: 0; overflow: hidden; }
  .cm-editor { height: 100%; }
`;
