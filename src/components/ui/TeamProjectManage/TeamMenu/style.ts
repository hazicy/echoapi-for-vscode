import styled from 'styled-components';

import { ellipsisStyle } from '@/assets/css/style';

export const TeamMenuWrapper = styled.div`
  padding: 0 20px;
  height: 290px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  .title {
    .count {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      font-size: var(--font-size-12);
      line-height: 22px;
      font-weight: 400;
      text-align: center;
      color: var(--font-content-color);
      background-color: var(--color-bg-page);
    }
  }

  .beautify-menu-inline {
    border-right: none !important;
  }

  .beautify-menu-submenu-title {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  .beautify-menu-item {
    margin: 0;
    padding-left: 36px;
    width: 100%;
  }

  .beautify-menu-submenu-selected {
    .beautify-menu-submenu-title {
      font-weight: 600;
      color: var(--font-content-color);
    }
  }

  .beautify-menu-submenu-active {
    .beautify-menu-submenu-title {
      color: var(--color-primary);
    }
  }

  .beautify-menu-title-content {
    margin-left: 14px;

    .name {
      max-width: 190px;
      ${ellipsisStyle}
    }
  }

  .beautify-menu-item-selected {
    color: var(--color-primary);
  }
`;

export const MenuItemContainer = styled.div`
  .project-name {
    max-width: 240px;
    ${ellipsisStyle}
  }

  .logout-project {
    display: none;
    color: #ff583e;
  }

  &:hover {
    .logout-project {
      display: block;
    }
  }

  .fail {
    font-size: var(--font-size-12);
    color: #ff3b27;
  }

  .pending {
    font-size: var(--font-size-12);
    color: #26cea4;
  }
`;

export const MigrateItemWrapper = styled.div`
  padding: 0 20px;

  .migrate-item {
    margin-top: 12px;
    padding-left: 12px;
    height: 32px;
    cursor: pointer;

    .migrate-text {
      font-size: var(--font-size-14);
      color: var(--color-primary);
    }
  }
`;
