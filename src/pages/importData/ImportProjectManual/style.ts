import styled from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';

export const ImportProjectManualWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  .import-project-item {
    margin-top: 16px;
    border-bottom: 1px solid var(--color-table-border);
    font-size: var(--font-size-14);
    display: flex;
    flex-direction: column;
    &-title {
      margin-bottom: 16px;
    }

    &-content {
      /* ${flexStyles('row', 'center', 'flex-start')}; */
      width: 100%;
      flex: 1;
      border-radius: 4px;

      .margin-bottom-20 {
        margin-bottom: 20px;
      }

      .swagger-input {
        padding: 0 0 20px;
        width: 100%;
      }

      .beautify-upload-wrapper {
        padding: 0 0 20px;
        width: 100%;
        font-size: var(--font-size-14);

        .ant-upload-drag-icon {
          margin-bottom: 12px;
          font-size: var(--font-size-24);
        }
      }

      .beautify-upload-icon {
        font-size: var(--font-size-14);
      }

      .beautify-upload-list {
        &-item {
          padding: 0 12px;
          height: 22px;
          color: var(--color-primary);
        }
      }

      .beautify-select {
        margin-bottom: 20px;
      }
    }
  }

  .import-project-curl {
    width: 100%;
    height: 218px;
    ${flexStyles('row', 'center', 'center')};
  }

  .import-now {
    float: right;
    margin-top: 20px;
  }

  .switch-panel {
    ${flexStyles('row', 'center', 'flex-start')};
    margin-top: 20px;
    font-size: var(--font-size-14);

    & > span {
      margin-right: 24px;

      .beautify-switch {
        margin-left: 8px;
      }
    }
  }
`;

export const ImportExportWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  padding: 0;
  height: 100%;
width: 100%;
padding: 16px;
  display: flex;
  flex-direction: column;
  .import-project-item {
    margin-top: 16px;
    border-bottom: 1px solid var(--color-table-border);
    font-size: var(--font-size-14);
    display: flex;
    flex-direction: column;
    &-title {
      margin-bottom: 16px;
    }

    &-content {
      /* ${flexStyles('row', 'center', 'flex-start')}; */
      width: 100%;
      /* height: 100%; */
      border-radius: 4px;

      .margin-bottom-20 {
        margin-bottom: 20px;
      }

      .beautify-radio-group {
        flex-wrap: wrap;

        .radio-card {
          margin: 0 16px 20px 0;
          width: 170px;
          height: 48px;
          border-radius: 4px;
          border: 1px solid var(--color-border);

          & > div {
            height: 100%;
          }

          &:hover {
            .beautify-radio-inner {
              border: 1px solid var(--color-border);
            }
          }

          &.active {
            border-color: var(--color-primary);

            .beautify-radio-inner {
              border: 1px solid var(--color-primary);
            }
          }

          label {
            ${flexStyles('row', 'center', 'center')};
            margin: 0;
            width: 100%;
            height: 100%;
          }

          .beautify-radio-wrapper::after{
              display: none !important;
            }

          .beautify-radio-wrapper {
            flex-direction: row-reverse !important;
            height: 100%;
            justify-content: space-between;
            padding: 0 12px;
            span.beautify-radio + * {
              padding-inline: 0;
            }

            .radio-card-content {
              ${flexStyles('row', 'center', 'flex-start')};
              margin-right: 12px;
              padding: 0;

              svg {
                margin-right: 12px;
                width: 20px;
                height: 20px;
              }
            }
          }
        }
      }
    }
  }

  .import-project-curl {
    ${flexStyles('row', 'center', 'center')};
    flex-direction: column;
    width: 100%;
    height: 218px;
    background-color: var(--color-bg-page);

    .import-project-curl-tip {
      margin-bottom: 12px;
      font-size: 14px;
      color: var(--font-content-color);
    }
  }

  .import-export-now {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: var(--font-size-14);
  }

  .switch-panel {
    ${flexStyles('row', 'flex-start', 'flex-start')};
    flex-direction: column;
    margin-top: 20px;
    font-size: var(--font-size-14);

    .switch-panel-title {
      margin-bottom: 16px;

      /* font-size: var(--font-size-14); */
      color: var(--font-content-color);
    }
  }

  .import-project-full {
    .beautify-tabs-nav {
      margin-bottom: 16px;
    }

    .import-project-full-select {
      .beautify-select-tree-node-content-wrapper {
        display: inline-block;
        ${ellipsisStyle}
      }
    }

    .import-project-full-title {
      display: flex;
      min-width: 120px;
      font-size: var(--font-size-14);
      color: var(--font-content-color);
    }

    .import-project-full-tip {
      margin-left: 10px;
      font-size: var(--font-size-14);
      color: var(--font-light-color);
    }
  }

  .import-project-upload-content {
    .beautify-upload-list {
      padding-bottom: 20px;
    }
   
    .beautify-upload-list-item-container .beautify-upload-list-item .beautify-upload-list-item-name{
      font-size: 12px;
    }
    .beautify-upload{
      margin-bottom: 20px;
      border-color: var(--color-table-border);
    }
  }
`;

