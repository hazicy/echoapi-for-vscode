import styles from "./style.module.css";
import { Flex } from "@/shared/ui/base";

import Export from "@/features/export/components/Export";

const exportData = () => {
  return (
    <Flex vertical className={styles.container}>
      <Export />
    </Flex>
  );
};
export default exportData;
