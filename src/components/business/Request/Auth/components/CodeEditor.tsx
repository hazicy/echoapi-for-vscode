import CodeEditor from '@/components/business/CodeEditor';

import { CodeContainer } from '../style';

const AuthCodeEditor = (props: any) => {
  return (
    <CodeContainer>
      <CodeEditor
        language="json"
        height="100%"
        value={props?.value || ''}
        onChange={props?.onChange}
      />
    </CodeContainer>
  );
};

export default AuthCodeEditor;
