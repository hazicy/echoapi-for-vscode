import { Radio as AntdRadio } from '@/components/ui/base';
import type { RadioGroupProps, RadioProps } from '@/components/ui/base';

import { RadioGroupWrap, RadioWrap } from './style';

const Radio = (props: RadioProps) => {
  return (
    <RadioWrap>
      <AntdRadio {...props} />
    </RadioWrap>
  );
};
const Group = (props: RadioGroupProps) => {
  return (
    <RadioGroupWrap>
      <AntdRadio.Group {...props}></AntdRadio.Group>
    </RadioGroupWrap>
  );
};
Radio.Group = Group;
export default Radio;
