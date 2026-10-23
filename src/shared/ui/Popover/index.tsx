import { Popover as AntdPopover, PopoverProps as AntdPopoverProps } from '@/shared/ui/base';

export type PopoverProps = AntdPopoverProps;

const Popover = (props: PopoverProps) => {
  const { overlayInnerStyle = {}, ...restProps } = props;

  const defaultOverlayInnerStyle = {
    padding: '16px 20px',
  };

  return (
    <AntdPopover
      overlayInnerStyle={{ ...defaultOverlayInnerStyle, ...overlayInnerStyle }}
      {...restProps}
    />
  );
};

Popover.defaultProps = {
  destroyTooltipOnHide: true,
};

export default Popover;
