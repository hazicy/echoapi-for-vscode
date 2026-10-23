import styles from "./style.module.css";
import { Flex } from "@/shared/ui/base";
import slots from "@/shared/ui/base/slots.module.css";

import CodeEditor from "@/shared/components/CodeEditor";
import { useSafeState } from "ahooks";
import { Button } from "@/shared/ui/base";
import { useTranslation } from "react-i18next";
import { parseSafeBash } from "@/features/curl/utils/curl";

const Curl = () => {
  const { t } = useTranslation();
  const [value, setValue] = useSafeState<string>("");

  const handleImportCurl = async () => {
    try {
      const parsedValue = parseSafeBash(value);

      window?.vscode.postMessage({
        action: "curlImport",
        data: parsedValue,
      });
    } catch (error) {}
  };

  return (
    <Flex vertical className={styles.container}>
      <CodeEditor
        className={slots["curl-code-editor"]}
        onChange={setValue}
        value={value}
      />
      <Button type="primary" onClick={handleImportCurl}>
        {t("supplement.import")}
      </Button>
    </Flex>
  );
};
export default Curl;
