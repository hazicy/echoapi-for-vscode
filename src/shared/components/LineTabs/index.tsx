import styles from "./style.module.css";
import { FC, ReactNode, useMemo } from "react";

import { TabPaneProps, Tabs, TabsProps } from "@/shared/ui/base";

import { map } from "lodash";

import HeaderCount from "./HeaderCount";

type LineTabsItems = Omit<TabPaneProps, "tab"> & {
  key: string;
  label: ReactNode;
  countParams?: {
    dataSource?: any;
    showDot?: boolean;
    customCalcFun?: (dataSource: any) => number;
  };
};

type Props = TabsProps & {
  items?: LineTabsItems[];
  wrapStyle?: any;
};

const LineTabs: FC<Props> = ({ items, wrapStyle, ...resetProps }) => {
  const finalItems = useMemo(() => {
    return map(items, (item) => {
      return {
        ...item,
        label: item?.countParams ? (
          <>
            <HeaderCount label={item.label} {...item.countParams} />
          </>
        ) : (
          item.label
        ),
      };
    });
  }, [items]);

  return (
    <div style={{ ...wrapStyle }} className={styles.container}>
      <Tabs items={finalItems} {...resetProps} animated={false} />
    </div>
  );
};

export default LineTabs;
