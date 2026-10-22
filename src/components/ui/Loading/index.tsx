import { Spin } from '@/components/ui/base';

import { LoadingWrapper } from './style';

const Loading = () => {
  return (
    <LoadingWrapper>
      <Spin size="large" />
    </LoadingWrapper>
  );
};

export default Loading;
