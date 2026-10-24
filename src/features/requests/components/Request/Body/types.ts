import { ApiRequest } from "@/features/requests/types/request";
import { ChangeFuncType } from "@/shared/types/common";

import { RequestTabsItemProps } from "../types";
import { ApiDetailsData } from "@/features/requests/types/api";

export type RequestBodyProps = RequestTabsItemProps & {
  apiData?: ApiDetailsData;
  value: ApiRequest["body"];
  onChange: ChangeFuncType<ApiRequest>;
};
