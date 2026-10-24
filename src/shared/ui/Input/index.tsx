import { Input as AntdInput, InputProps } from "@/shared/ui/base";

import { MAX_INPUT_LENGTH } from "@/shared/constants/form";

const Input = (props: InputProps) => {
  return <AntdInput maxLength={MAX_INPUT_LENGTH} {...props} />;
};

export default Input;
