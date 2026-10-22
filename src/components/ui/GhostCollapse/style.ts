import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const GhostCollapseWrapper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  .beautify-collapse {
    .beautify-collapse-item {
      &:not(:first-child) {
        margin-top: 16px;
      }
    }

    .beautify-collapse-header {
      margin-bottom: 8px;
      width: 100%;

      ${flexStyles('row', 'center', 'space-between')}
      .beautify-collapse-header-text {
        font-size: var(--font-size-14);
      }
    }

    .beautify-collapse-content {
      .beautify-collapse-content-box {
        padding: 0;
      }
    }

    &.fit-content {
      .beautify-collapse-header {
        width: fit-content;
      }
    }
  }
`;
