import { Modal, Spin } from 'antd';

import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const PreviewContainer = styled(Modal)`
  .preview-tree {
    background: transparent;
  }

  .beautify-table-body {
    overflow-y: auto !important;
  }

  .import-project-full-tip {
    font-size: var(--font-size-12);
    color: var(--font-light-color);
  }

  .beautify-tree .beautify-tree-checkbox {
    margin-top: 0;
    align-self: auto;
  }

  .import-project-append-config {
    .beautify-select-outlined:not(.beautify-select-customize-input) .beautify-select-selector {
      /* background: var(--color-bg-right); */
    }
  }
`;

export const LoadingContainer = styled(Spin)`
  width: 100%;
  min-height: 500px;
  ${flexStyles('row', 'center', 'center')}
`;
