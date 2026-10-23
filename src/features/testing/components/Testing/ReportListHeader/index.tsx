import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { Flex } from "@/shared/ui/base";
import IconFont from "@/shared/ui/IconFont";

type TestingHeaderProps = {
  folderName: string;
  setShowReportList: (val: boolean) => void;
};

const ReportListHeader = ({
  folderName,
  setShowReportList,
}: TestingHeaderProps) => {
  return (
    <div className={styles.container}>
      <Flex align="center" gap={6}>
        <IconFont
          style={{ fontSize: 20 }}
          type="icon-back1"
          onClick={() => setShowReportList(false)}
        />
        <div className={slots["folder-name"]}>{folderName}</div>
      </Flex>
    </div>
  );
};
export default ReportListHeader;
