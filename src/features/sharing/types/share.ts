import { ApiDetailsData } from "../../requests/types/api";

export type ShareInfo = {
  netUrl: string;
  apiName: string;
  apiData: ApiDetailsData | null;
};

export type ShareInfoData = {
  target_id: string;
  share_time: number;
};

export type DocPageData = {
  net_url: string;
  fileName: string;
  openApiStr: string;
};
