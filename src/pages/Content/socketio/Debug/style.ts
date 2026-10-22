import styled from 'styled-components';

import { ellipsisStyle } from '@/assets/css/style';

export const WsDebugContainer = styled.div`
  width: 100%;
  height: 100%;
  height: calc(100% - 40px);

  display: flex;
  flex-direction: column;
  flex: 1;

  .beautify-dropdown-trigger{
    border-color: var(--vscode-settings-headerBorder);
  }
  & > * {
    /* padding: 0 16px; */
  }

  .beautify-tabs{
    width: 100%;
    height: 100%;
  }

  .url-panel {
    .beautify-flex {
      .url-group {
        flex: 1;
      }
    }

    /* .beautify-btn {
      margin-left: 8px;

      &:last-child,
      .beautify-dropdown-open {
        margin-left: 0;
        width: 24px;
      }
    } */
    .actions-btn-wrap {
      margin-left: 8px;

      .beautify-dropdown-menu {
        .beautify-dropdown-menu-item,
        .beautify-dropdown-menu-submenu {
          font-size: 14px;

          .beautify-dropdown-menu-title-content {
            font-size: 14px;
          }
        }
      }
    }

    .beautify-btn {
      height: 36px;
      font-size: var(--font-size-14);

      &:first-child {
        width: 70px;
      }
    }
  }

  .beautify-tabs-content {
    height: 100%;

    /* height: calc(100% - 60px); */
  }

  .ws-header {
    margin-bottom: 16px;

    .icon-color {
      margin-left: 4px;
      font-size: var(--font-size-12);
      line-height: 1;
      color: var(--icon-color);
    }

    .beautify-input-outlined {
      height: 32px;
      font-size: var(--font-size-12);
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-settings-numberInputBorder, transparent);
    }

    .beautify-select {
      height: 32px;

      &-selector {
        font-size: var(--font-size-12);
      }
    }

    .beautify-select-dropdown {
      .beautify-select-item {
        font-size: var(--font-size-12) !important;
      }
    }
  }
`;

export const LineBarContainer = styled.div`
  height: 100%;

  .beautify-tabs-nav {
    margin-bottom: 0;
  }
`;
export const ExampleModalContainer = styled.div`
  width: 100%;

  .raw-editor-example {
    margin-top: 12px;
    min-height: 400px;

    /* overflow-y: auto; */
  }
`;

export const SaveDropDownContainer = styled.div`
  padding: 8px;
  padding-right: 0;
  width: 200px;
  height: 100%;
  border-radius: 4px;
  background-color: var(--popover-select-bg-color);
  box-shadow:
    0 6px 16px 0 rgb(0 0 0 / 8%),
    0 3px 6px -4px rgb(0 0 0 / 12%),
    0 9px 28px 8px rgb(0 0 0 / 5%);

  .beautify-tree {
    width: 100%;
    background-color: var(--popover-select-bg-color);

    .beautify-tree-list {
      padding-right: 12px;
    }

    .beautify-tree-node-content-wrapper {
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 0;
      height: 100%;

      .beautify-tree-title {
        display: flex;
        width: 100%;

        .dropdown-tree-title {
          width: 100%;
          ${ellipsisStyle}
        }
      }
    }
  }
`;

export const ExampleLabelContainer = styled.div`
  display: flex;
  max-width: 200px;

  .name {
    flex: 1;
    ${ellipsisStyle}
  }
`;

export const ExampleListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  min-width: 240px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--popover-select-bg-color);
  box-shadow: 0 12px 18px -4px var(--box-shadow-modal-color);

  .beautify-dropdown-menu {
    margin-top: 8px;
    padding: 0;
    box-shadow: none;
    max-height: 260px;
    overflow-y: auto;
  }
`;

export const SocketIoLeftPanelContainer = styled.div`
  height: 100%;
  padding: 8px;
  padding-left: 0;
  .beautify-btn{
    border: none;
    padding: 4px 0;
  }
  .beautify-select{
    .beautify-select-selector{
    display: flex;
    gap: 4px;
    align-items: center;
    background: transparent;
    font-size: 12px;
    padding: 0 4px;
    padding-left: 6px;
  }
  }
`;