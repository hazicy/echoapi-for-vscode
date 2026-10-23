import styles from "../style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, ReactNode, memo, useMemo } from "react";

import { Dropdown } from "@/shared/ui/base";

import { isFunction, isNumber } from "lodash";

import { TreeDataItem } from "@/features/requests/types/api";

type Props = Partial<
  TreeDataItem & {
    showChildrenCount?: boolean;
    scrollIng?: boolean;
    childrenCount?: number;
    nodeItemTitleExtraContent: (item: Props) => ReactNode;
    nodeItemDropdownContextMenu: any;
    onClick?: any;
  }
>;

const ItemTitle: FC<Props> = memo((props) => {
  const {
    name,
    showChildrenCount,
    nodeItemTitleExtraContent,
    nodeItemDropdownContextMenu,
    scrollIng,
    childrenCount,
    onClick,
  } = props;

  const dropdownContextMenu = useMemo(
    () => (!scrollIng ? nodeItemDropdownContextMenu?.(props) : undefined),
    [nodeItemDropdownContextMenu, props, scrollIng],
  );

  const extraContent = useMemo(
    () =>
      nodeItemTitleExtraContent?.({
        ...props,
        moreOperateMenu: dropdownContextMenu,
      }),
    [nodeItemTitleExtraContent, props, dropdownContextMenu],
  );

  const renderContent = (
    <div className={styles.itemTitle}>
      <div
        onClick={() => {
          if (isFunction(onClick)) {
            onClick();
          }
        }}
        className={slots.title}
        title={name}
      >
        {name}
        {showChildrenCount && isNumber(childrenCount) && childrenCount > 0 && (
          <span className={slots["children-num"]}>({childrenCount})</span>
        )}
      </div>
      {extraContent}
    </div>
  );

  if (props?.scrollIng) {
    return renderContent;
  }

  if (!dropdownContextMenu) {
    return renderContent;
  }

  return (
    <Dropdown trigger={["contextMenu"]} menu={dropdownContextMenu}>
      {renderContent}
    </Dropdown>
  );
});

export default ItemTitle;
