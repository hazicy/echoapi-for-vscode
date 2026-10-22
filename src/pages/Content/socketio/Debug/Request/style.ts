import styled from 'styled-components';

export const SettingWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  .beautify-input {
    /* width: 120px; */
    width: 100%;
  }

  .beautify-input-number {
    width: 100%;
  }

  .beautify-select {
    width: 100%;
  }

  .setting-desc {
    color: var(--font-light-color);
  }
`;

export const RawEditorWrap =  styled.div`
  flex: 1;
  height: 0;
  .code-editor-wrapper{
    width: 97%;
  }
`;

export const MessageHeaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
  .beautify-select-selector{
    font-size: 12px !important;
  }
  .beautify-select .beautify-select-arrow{
    font-size: 10px;
  }
`;