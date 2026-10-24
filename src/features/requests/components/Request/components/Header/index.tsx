import { FC, memo } from "react";

import { isEqual } from "lodash";

import RequestTable from "@/shared/components/RequestTable";
import { useTableColumnSwitchConfig } from "@/shared/hooks";

import { ApisBaseDataItem } from "@/features/requests/types/base";

import { RequestTabsItemProps } from "../../types";

type Props = RequestTabsItemProps & {
  dataSource: ApisBaseDataItem[];
  onChange: (params: ApisBaseDataItem[]) => void;
  isSystem?: boolean;
};

const RequestHeader: FC<Props> = memo(
  (props) => {
    const { dataSource, onChange, ...otherProps } = props;

    const { columnSwitchConfig, onColumnSwitchConfig } =
      useTableColumnSwitchConfig("request_header_column_switch");

    return (
      <RequestTable
        dataSource={dataSource}
        onChange={onChange}
        {...otherProps}
        columnSwitchConfig={columnSwitchConfig}
        onColumnSwitchConfig={onColumnSwitchConfig}
      />
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
);

export default RequestHeader;
