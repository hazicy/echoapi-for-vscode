import styled from 'styled-components';

export const ReportWrapper = styled.div`
  width: 100%;
  height: 100%;

  .operate {
    .beautify-btn {
      padding: 0;
      font-size: var(--font-size-14);
    }

    .btn-divider {
      line-height: 1;
      color: var(--color-border);
    }
  }

  .beautify-pagination {
    position: fixed;
    bottom: 22px;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .beautify-table-body{
    overflow-y: hidden !important;
  }
`;
