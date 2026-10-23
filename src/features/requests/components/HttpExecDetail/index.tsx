import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Alert, Flex } from "@/shared/ui/base";

import { isEmpty, map, size } from "lodash";

import ResponseSize from "@/features/requests/components/ResponseSize";
import GhostCollapse from "@/shared/ui/GhostCollapse";
import IconFont from "@/shared/ui/IconFont";
import PrefixIcon from "@/shared/ui/PrefixIcon";
import useTheme from "@/shared/hooks/useTheme";
import { hexToRGBA } from "@/shared/utils/common";

import Request from "./Request";
import Response from "./Response";

import { RuntimeResponse } from "@/features/testing/types";

export type HttpExecDetailProps = {
  httpExecDetail: RuntimeResponse;
};

const HttpExecDetail = ({ httpExecDetail }: HttpExecDetailProps) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const { assertions, request, response } = httpExecDetail || {};

  const renderAssert = () => {
    return (
      <>
        {map(assertions, (item) => {
          const errorMessage = item?.error?.message;

          return (
            <Alert
              className={slots["assert-item"]}
              style={{
                color: item.passed
                  ? themeToken.colorSuccess
                  : themeToken.colorError,
                backgroundColor: item.passed
                  ? hexToRGBA("#26CEA4", 0.1)
                  : hexToRGBA("#FF583E", 0.1),
              }}
              icon={
                item.passed ? (
                  <IconFont type="icon-checked" />
                ) : (
                  <IconFont type="icon-error" />
                )
              }
              key={item.name}
              type={item.passed ? "success" : "error"}
              message={
                errorMessage ? `${item.name}: ${errorMessage}` : item.name
              }
              banner
            />
          );
        })}
      </>
    );
  };

  const items = useMemo(() => {
    const result = [
      {
        key: "2",
        label: t("supplement.req_detail"),
        children: <Request httpExecDetail={httpExecDetail} />,
      },
      {
        key: "3",
        label: t("supplement.res_detail"),
        children: <Response httpExecDetail={httpExecDetail} />,
      },
    ];

    if (size(assertions) > 0) {
      result.unshift({
        key: "1",
        label: t("supplement.assert"),
        children: renderAssert(),
      });
    }

    return result;
  }, []);

  return (
    <div className={styles.container}>
      <Flex vertical gap={12} style={{ marginBottom: 16 }} flex={1}>
        {request?.url && (
          <Flex align="flex-start" className={slots["url-container"]}>
            <PrefixIcon
              type="api"
              method={request?.method}
              style={{ width: "auto", marginTop: 4 }}
            />
            <div className={slots.url}>{request?.url}</div>
          </Flex>
        )}
        {!isEmpty(response) && (
          <ResponseSize
            response={response}
            showLine={false}
            showIcon={false}
            showProxy={true}
          />
        )}
      </Flex>
      <GhostCollapse defaultActiveKey={["1", "2", "3"]} items={items} />
    </div>
  );
};

export default HttpExecDetail;
