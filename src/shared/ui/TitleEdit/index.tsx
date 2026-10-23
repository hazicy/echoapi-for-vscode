import { FC } from 'react';

import { InputProps } from '@/shared/ui/base';

import { TitleEditInput } from './style';

type Props = InputProps;

export const TitleEdit: FC<Props> = ({ ...resetProps }) => {
  return <TitleEditInput {...resetProps} />;
};

export default TitleEdit;
