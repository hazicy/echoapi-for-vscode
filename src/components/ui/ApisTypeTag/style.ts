import moduleStyles from './style.module.css';
import { withStyles } from '@/components/ui/base/withStyles';
import { Tag } from '@/components/ui/base';

export const ApisTypeTag = withStyles<typeof Tag, {}>(
  Tag,
  moduleStyles['ApisTypeTag'],
  { selector: 'ui_b2e93a14_ApisTypeTag' },
);
