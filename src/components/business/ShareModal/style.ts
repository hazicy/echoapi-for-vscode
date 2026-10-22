import styled from 'styled-components';

export const ExternalContainer = styled.div`
  display: flex;
  width: 100%;
  height: 32px;
  .beautify-input {
    flex: 1;
  }

  > .beautify-input-affix-wrapper {
    .beautify-input {
      color: var(--font-light-color);
    }
  }

  .beautify-input-affix-wrapper {
    padding: 0;
  }

  .external-tips {
    display: flex;
    align-items: center;
    padding: 5px 8px;
    height: 100%;
    border-radius: 0 2px 2px 0;
    border-color: var(--color-border);
    border-color: red !important;
    background-color: var(--color-bg-page);

    &:hover {
      border-color: var(--color-primary);
    }
  }
`;
