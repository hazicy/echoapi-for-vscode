import slots from "@/shared/ui/base/slots.module.css";
import { moduleClassNames } from "@/shared/ui/base/moduleClassNames";
import React from 'react';

import { TagProps } from '@/shared/ui/base';

import { APIS_TARGET_TYPE_ENUM } from '@/features/requests/constants';
import { ColorMap } from '@/features/requests/constants/common';
import { ApiTypeMethod } from '@/features/requests/types/base';

import { ApisTypeTag as Tag } from './style';

type Props = TagProps & {
  targetType: APIS_TARGET_TYPE_ENUM;
  method: ApiTypeMethod;
};

/** Tag containing apis target_type and api method */
const ApisTypeTag: React.FC<Props> = ({ targetType, method, ...resetProps }) => {
  return (
    <Tag
      className={moduleClassNames(slots, `${ColorMap(targetType, method)}`)}
      style={{ fontWeight: 700 }}
      bordered={false}
      {...resetProps}
    >
      {method}
    </Tag>
  );
};

export default ApisTypeTag;
