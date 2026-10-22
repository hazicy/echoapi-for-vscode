import styled from 'styled-components';

export const VarsTableWrap = styled.div`
  .beautify-table-thead {
    .beautify-table-cell {
      padding: 4px 10px;
    }
  }

  .beautify-table-tbody {
    .beautify-table-cell {
      .beautify-input-outlined,
      .beautify-select-selector {
        border-radius: 0;
        border-color: transparent;
      }

      .beautify-input-outlined:hover,
      .beautify-input-outlined:focus {
        border-color: var(--color-primary);
      }
    }
  }

  .tool-icon {
    &:hover {
      color: var(--color-primary);
    }
  }

  .delete-vars-params-icon {
    &:hover {
      color: #ff583e;
    }
  }
`;

export const PopoverContentWrap = styled.div`
  padding: 10px;
  background-color: var(--color-bg-folder);

  pre {
    color: #fa7600;
  }
`;
