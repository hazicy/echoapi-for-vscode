import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { language } from './language';

export default language === 'zh-cn'
  ? zhCN
  : enUS;
