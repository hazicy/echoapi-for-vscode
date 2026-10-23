import { theme } from '@/shared/ui/base';
import type { ButtonProps as AntdBUttonProps } from '@/shared/ui/base';

import classNames from 'classnames';
import slots from '@/shared/ui/base/slots.module.css';

import ButtonWrap from './style';

const { useToken } = theme;

export type ButtonProps = Omit<AntdBUttonProps, 'size'> & {
  /** Extension property for button type, add new className directly for new variant types */
  mode?: 'light' | 'background' | 'success' | 'error' | 'menu-item' | 'icon';
  size?: 'small' | 'middle' | 'large' | 'mini';
  btnRef?:any;
};

const Button = ({ btnRef ,mode, size, ...restProps }: ButtonProps ) => {
  const { token } = useToken();

  return <ButtonWrap ref={btnRef} $token={token} {...restProps} rootClassName={classNames(mode && slots[mode], size && slots[size])} />;
};
export default Button;
