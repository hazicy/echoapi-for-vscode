import styled from 'styled-components';

export const RestfulQueryContainer = styled.div`
  .beautify-table-thead {
    .beautify-table-cell {
      padding: 4px 10px;
    }
  }

  .beautify-table-tbody {
    tr {
      .row-description-operation {
        visibility: hidden;
      }

      &:hover {
        .row-description-operation {
          visibility: visible;
        }
      }
    }
  }

  .table-custom-empty-wrap {
    .beautify-table-tbody {
      display: none;
    }
  }
`;
