import { size } from 'lodash';

import Empty from '@/shared/ui/Empty';

import { AllListWrapper } from './style';
import { EventItem } from '@/features/testing/types';
import EventItemComponent from './EventItem';

type CommonTestingResultProps = {
  testingResult?: any[]; // Type determined at runtime
  isResult?: boolean;
  value: Array<EventItem>;
  onChange:(index:number,obj:any)=>void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const All = ({ value, onChange }: CommonTestingResultProps) => {

  return size(value) > 0 ? (
    <AllListWrapper>
      {value.map((item:EventItem,index: number) => {
        return <EventItemComponent value={{...item.data, enabled:item.enabled}} onChange={(val)=>{
          onChange(index,val);
        }}/>;
      })}
    </AllListWrapper>
  ) : (
    <Empty />
  );
};

export default All;
