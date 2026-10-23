import { createContext } from 'react';

import { DirectionType } from '@/shared/types/common';

type Props = {
  direction: DirectionType | '';
};

const Context = createContext<Props>({
  direction: '',
});

export default Context;
