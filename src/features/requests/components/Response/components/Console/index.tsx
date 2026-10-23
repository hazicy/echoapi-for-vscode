import styles from "./style.module.css";
import { FC, memo } from "react";

import Console from "@/features/requests/components/Console";
import { useApis } from "@/app/store";
import { ApiSendingData } from "@/features/requests/types/send";

interface Props {
  sendingData?: Partial<ApiSendingData>;
}

const ResponseConsole: FC<Props> = memo(({ sendingData }) => {
  const coverApiSendingConsole = useApis(
    (state) => state.coverApiSendingConsole,
  );

  const handleClear = () => {
    coverApiSendingConsole({
      consoleList: [],
      target_id: sendingData?.target_id,
    });
  };

  return (
    <div className={styles.container}>
      <Console
        consoleList={sendingData?.consoleList || []}
        onClear={handleClear}
      />
    </div>
  );
});

export default ResponseConsole;
