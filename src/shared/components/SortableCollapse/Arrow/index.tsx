import styles from "./style.module.css";
import IconFont from "@/shared/ui/IconFont";
import useTheme from "@/shared/hooks/useTheme";

const Arrow = ({
  activeKey,
  show,
}: {
  activeKey: string | undefined;
  show: boolean;
}) => {
  const { themeToken } = useTheme();
  return (
    <div className={styles.container}>
      {show && (
        <IconFont
          style={{ fontSize: themeToken.fontSize, color: themeToken.iconColor }}
          type="icon-arrow-down"
          rotate={activeKey ? 0 : -90}
        />
      )}
    </div>
  );
};

export default Arrow;
