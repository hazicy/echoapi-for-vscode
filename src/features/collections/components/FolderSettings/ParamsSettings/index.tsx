import styles from "./style.module.css";
import { FC } from "react";

import { useMemoizedFn } from "ahooks";

import RequestGlobal from "@/features/requests/components/RequestGlobal";
import { FolderDetailsData } from "@/features/requests/types/folder";

interface Props {
  value: FolderDetailsData;
  onChange: (value: FolderDetailsData) => void;
}

const ParamsSettings: FC<Props> = ({ value, onChange }) => {
  const handleOnChange = useMemoizedFn((data: FolderDetailsData["request"]) => {
    onChange({ ...value, request: data });
  });

  return (
    <div className={styles.container}>
      <RequestGlobal
        requestData={value.request}
        onRequestDataChange={handleOnChange}
      />
    </div>
  );
};

export default ParamsSettings;
