import slots from "@/shared/ui/base/slots.module.css";
import { useTranslation } from "react-i18next";

import { Flex, message } from "@/shared/ui/base";

import { useDebounce, useSafeState } from "ahooks";

import cn from "classnames";

import { Button, IconFont, Tooltip } from "@/shared/ui";
import { Modal } from "@/shared/ui/Modal";
import { openUrl } from "@/shared/utils/open";

import { PanelProps } from "../types";
import TabsPanel from "./Tabs";
import {
  copyApiDocsUrlToClipboard,
  getApiDocsUrlById,
} from "@/features/sharing/utils/share";

const SharePanel = (props: PanelProps) => {
  const { t } = useTranslation();
  const { searchValue, shareList } = props || {};
  const debouncedValue = useDebounce(searchValue, { wait: 250 });
  const [modal, contextHolder] = Modal.useModal();

  const [checkedList, setCheckedList] = useSafeState<any[]>([]);

  const tabExtraContent = (
    <Flex
      className={cn(slots["share-list-delete-btn"], {
        [slots.show]: checkedList.length > 0,
      })}
    >
      <Button
        onClick={() => {
          window?.vscode.postMessage({
            action: "batchDeleteShare",
            data: checkedList,
          });
          setCheckedList([]);
        }}
        type="primary"
      >
        {"Delete"}
      </Button>
    </Flex>
  );
  const listExtraContent = (_tar: string, item: any) => (
    <>
      <Tooltip title={t("docs.document.copy_link")}>
        <Button
          onClick={() =>
            copyApiDocsUrlToClipboard(item.target_id, () =>
              message.success(t("supplement.clipboard_success")),
            )
          }
          type="text"
          icon={<IconFont type="icon-copy" />}
        ></Button>
      </Tooltip>
      <Tooltip title={t("docs.document.open_link")}>
        <Button
          onClick={() => openUrl(getApiDocsUrlById(item.target_id))}
          type="text"
          icon={<IconFont type="icon-console" />}
        ></Button>
      </Tooltip>

      <Tooltip title={t("docs.document.delete")}>
        <Button
          onClick={() => {
            window?.vscode.postMessage({
              action: "deleteShare",
              data: { target_id: item.target_id },
            });
          }}
          type="link"
          className={slots.delete}
          icon={<IconFont type="icon-delete" />}
        ></Button>
      </Tooltip>
    </>
  );
  return (
    <>
      <TabsPanel
        {...props}
        fieldKey="issue_id"
        setCheckedList={setCheckedList}
        checkedList={checkedList}
        lists={shareList}
        searchValue={debouncedValue}
        tabExtraContent={tabExtraContent}
        listExtraContent={listExtraContent}
      />
      {contextHolder}
    </>
  );
};

export default SharePanel;
