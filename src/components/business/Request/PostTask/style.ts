import styled from 'styled-components';

export const RequestPostTaskContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;

  > .beautify-btn {
    width: 100%;
    font-size: var(--font-size-14);
  }

  .item-container {
    .beautify-typography {
      font-size: var(--font-size-14);
      white-space: nowrap;
    }

    .beautify-input {
      font-size: var(--font-size-14);
    }

    .beautify-collapse-header {
      .beautify-input {
        height: 24px;
      }
    }

    .beautify-select-selector {
      font-size: var(--font-size-14);
    }
  }
`;
