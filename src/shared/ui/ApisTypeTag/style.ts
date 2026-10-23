import moduleStyles from './style.module.css';
import { withStyles } from '@/shared/ui/base/withStyles';
import { Tag } from '@/shared/ui/base';

export const ApisTypeTag = withStyles<typeof Tag, {}>(
  Tag,
  moduleStyles['ApisTypeTag'],
  { selector: 'ui_b2e93a14_ApisTypeTag' },
);
