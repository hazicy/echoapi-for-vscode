import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { Dispatch, useMemo } from "react";

import produce from "immer";
import { cloneDeep, keys } from "lodash";

import Collapse from "@/shared/ui/Collapse";
import Empty from "@/shared/ui/Empty";
import IconFont from "@/shared/ui/IconFont";
import { DomainInfoProps } from "@/features/project/types/cookie";

import { ICookie } from "../../types";
import CookieTab from "./components/CookieTab";

interface Props {
  value: DomainInfoProps;
  onChange: Dispatch<DomainInfoProps>;
  project_id: string | undefined;
}

const Index = (props: Props) => {
  const { value, onChange, project_id } = props;

  const handleChangeValue = (type: string, val: any) => {
    const newVal = produce(value, (draft: any) => {
      draft[type] = val;
    });
    onChange(newVal);
  };

  const removerDomain = (domain: string) => {
    const newCookieObj = cloneDeep(value?.cookieObj);
    const cookie_ids: any = [];
    newCookieObj[domain].forEach((item: ICookie) => {
      cookie_ids.push(item.cookie_id);
    });
    if (cookie_ids.length) {
      delete newCookieObj[domain];
      handleChangeValue("cookieObj", newCookieObj);
    }
  };

  const renderLabel = (key: string) => (
    <div className={styles.container}>
      <div className={slots.domin}>{key}</div>
      <span className={slots["title-cookie"]}>Cookie</span>
      <span className={slots.num}>
        {Object.keys(value?.cookieObj[key]).length}
      </span>
      <IconFont
        onClick={(e) => {
          e.stopPropagation();
          removerDomain(key);
        }}
        style={{ color: "var(--icon-color)" }}
        type="icon-delete"
      />
    </div>
  );

  const items = useMemo(() => {
    return Object.keys(value?.cookieObj).map((key) => ({
      key,
      label: renderLabel(key),
      children: <CookieTab domain={key} value={value} onChange={onChange} />,
    }));
  }, [value]);

  return (
    <>
      {keys(value?.cookieObj)?.length ? (
        <Collapse
          defaultActiveKey={Object.keys(value?.cookieObj)[0]}
          items={items}
        />
      ) : (
        <Empty />
      )}
    </>
  );
};

export default Index;
