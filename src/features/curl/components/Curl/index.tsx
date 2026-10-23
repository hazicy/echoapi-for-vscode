import slots from "@/shared/ui/base/slots.module.css";
import { CurlWrap } from './style';
import CodeEditor from '@/shared/components/CodeEditor';
import { useSafeState } from 'ahooks';
import { Button } from '@/shared/ui/base';
import { useTranslation } from 'react-i18next';
import { parseSafeBash } from '@/features/curl/utils/curl';

const Curl = () => {
  const { t } = useTranslation();
  const [value, setValue] = useSafeState<string>('');

  const handleImportCurl = async () => {
    try {
      const parsedValue = parseSafeBash(value);
      
      window?.vscode.postMessage({
        action: 'curlImport',
        data: parsedValue
      });
    } catch (error) {
    }
  };

  return (
    <CurlWrap vertical>
      <CodeEditor className={slots["curl-code-editor"]} onChange={setValue} value={value} />
      <Button type="primary" onClick={handleImportCurl}>
        {t('supplement.import')}
      </Button>
    </CurlWrap>
  );
};
export default Curl;