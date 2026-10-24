import { createContext } from "react";

import { APIS_TARGET_TYPE_ENUM } from "@/features/requests/constants";
import { GraphQLDetailsData } from "@/features/requests/types/graphql";

type Props = {
  target_type: APIS_TARGET_TYPE_ENUM | undefined;
  apiData: GraphQLDetailsData | undefined;
  onApisDataChange: (data: GraphQLDetailsData) => void;
};

const GraphQLResponseContext = createContext<Props>({
  target_type: undefined,
  apiData: undefined,
  onApisDataChange: function () {},
});

export default GraphQLResponseContext;
