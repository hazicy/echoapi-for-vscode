import styles from "./style.module.css";
import { Radio as AntdRadio } from "@/shared/ui/base";
import type { RadioGroupProps, RadioProps } from "@/shared/ui/base";

const Radio = (props: RadioProps) => {
  return (
    <div className={styles.container}>
      <AntdRadio {...props} />
    </div>
  );
};
const Group = (props: RadioGroupProps) => {
  return (
    <div className={styles.radioGroup}>
      <AntdRadio.Group {...props}></AntdRadio.Group>
    </div>
  );
};
Radio.Group = Group;
export default Radio;
