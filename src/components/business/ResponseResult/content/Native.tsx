import CodeEditor from '@/components/business/CodeEditor';
import type { EditorOptions } from '@/components/business/CodeEditor';

interface Props {
  rawHtml?: string;
  editorOptions?: EditorOptions;
}
const Native = (props: Props) => {
  const { rawHtml, editorOptions } = props || {};

  return (
    <CodeEditor
      language="text"
      readOnly
      value={rawHtml || ''}
      options={{ ...editorOptions, lineNumbers: 'off' }}
    />
  );
};

export default Native;
