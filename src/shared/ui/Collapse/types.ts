import type { CollapseProps as AntdCollapseProps } from '@/shared/ui/base';

export type CollapseProps = {
  /**header background color */
  headerBg?: string;
  /**ItemBottom */
  marginBottom?: number;
  /**borderRadius */
  borderRadius?: number;
  /**headerPadding */
  headerPadding?: string;
} & AntdCollapseProps;
