import styled from 'styled-components';

export const LineTabsContainer = styled.div`
  width: 100%;
  height: 100%;

  .params-count {
    color: #26cea4;
  }

  .beautify-tabs-nav-wrap {
    .beautify-tabs-tab {
      font-size: var(--font-size-14);
    }
  }

  > .beautify-tabs {
    > .beautify-tabs-content-holder {
      > .beautify-tabs-content {
        height: 100%;

        .beautify-tabs-tabpane {
          height: 100%;
          overflow: auto;
        }
      }
    }
  }
`;

export const TabsHeaderCountContainer = styled.span`
  /* margin-left: 4px;
  font-size: 12px;
  font-weight: normal; */

  /* color: var(--color-success); */
  /* color: #26cea4; */
  .tabs-count-badge{
    font-size: 10px;
    box-shadow:none;
    background:none;
    color: var(--color-primary);
  }
  .tabs-count-badge-root{
    font-size: 14px;
    color: inherit;
  }
`;

export const TabsHeaderDotContainer = styled.em`
  display: inline-block;
  margin-left: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--color-primary);
  position: absolute;
  top: 16px;
  right: 2px;
`;
