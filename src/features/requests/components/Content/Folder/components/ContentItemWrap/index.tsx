import { FC, FunctionComponent, memo } from "react";

import { useMemoizedFn } from "ahooks";

import { SuspenseContent } from "@/shared/components";

import { updateApisActiveItem } from "@/features/requests/events/opens";
import { ApiDetailsData, ApisData } from "@/features/requests/types/api";

interface Props {
  apisData: ApiDetailsData;
  // onApisDataChange:(val:ApiDetailsData)=>void;
  contentType?: string;
  activeContentType?: string | number;
  element: FunctionComponent<{
    apisData: ApisData;
    onApisDataChange: (param: ApiDetailsData) => void;
  }>;
}

const ContentItemWrap: FC<Props> = memo((props) => {
  const { apisData } = props;

  const onApisDataChange = useMemoizedFn((data: Partial<ApisData>) => {
    updateApisActiveItem(data);
  });

  return (
    <SuspenseContent skeletonProps={{ paragraph: { rows: 6 } }}>
      <props.element
        key={apisData?.target_id}
        apisData={apisData}
        onApisDataChange={onApisDataChange}
      />
    </SuspenseContent>
  );
});

export default ContentItemWrap;
