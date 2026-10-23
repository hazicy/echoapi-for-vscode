import { ceil, size } from "lodash";

import Empty from "@/shared/ui/Empty";

import { AllListWrapper } from "./style";

import EventItemComponent from "./EventItem";
import useTesting from "@/features/testing/store/useTesting";

type CommonTestingResultProps = {
  testingResult?: any[]; // Type determined at runtime
  isResult?: boolean;
  value: Array<any>;
  execute_count: number;
  eventCount: number;
};

const ResultList = ({
  value,
  execute_count,
  eventCount,
}: CommonTestingResultProps) => {
  return size(value) > 0 ? (
    <AllListWrapper>
      {value.map((item: any, index: number) => {
        let iterationText = `${ceil((index + 1) / eventCount)}/${execute_count}`;
        return (
          <EventItemComponent
            value={item.data}
            iterationText={iterationText}
            errorMessage={item?.error?.message}
          />
        );
      })}
    </AllListWrapper>
  ) : (
    <Empty wrapStyle={{ marginTop: "40px" }} />
  );
};

export default ResultList;
