import styles from "./style.module.css";
import classNames from "classnames";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Flex, Popconfirm, message } from "@/shared/ui/base";

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { cloneDeep, findIndex, head, includes, isEqual, size } from "lodash";
import { useShallow } from "zustand/react/shallow";

import { Tooltip } from "@/shared/ui";
import IconFont from "@/shared/ui/IconFont";
import { copyEnv, saveProjectConfig } from "@/features/requests/events/env";
import { useProjectConfig } from "@/app/store";

import DraggableMenu from "./components/DraggableMenu";
import { DraggableMenuProps } from "./components/DraggableMenu/types";
import { ENV_MANAGE_ENUM, MENU_ITEMS, MENU_ITEMS_KEY } from "./constants";

import { EnvListItem } from "@/features/environment/types";

interface Props {
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
}

type MenuItem = {
  label: React.ReactNode;
  key: React.Key | ENV_MANAGE_ENUM;
  icon?: string;
  children?: MenuItem[];
  type?: string | undefined;
  isEnv?: boolean;
  disableDraggable?: boolean;
};

const Menus: FC<Props> = ({ selectedKeys, setSelectedKeys }) => {
  const { projectId: project_id } = useParams();
  const { t } = useTranslation();

  const { envList, envDetailKeys, updateEnvList, updateEnvDetailKeys } =
    useProjectConfig(
      useShallow((state) => ({
        envList: state.envList,
        envDetailKeys: state.envDetailKeys,
        updateEnvList: state.updateEnvList,
        updateEnvDetailKeys: state.updateEnvDetailKeys,
      })),
    );

  const getLogo = (str: string) => {
    if (str.length < 2) {
      return str;
    }
    // Get the first character
    const firstChar = str?.[0];

    // Check if the first character is a number
    if (!isNaN(+firstChar)) {
      // If it's a number, take the first two characters
      return `${str}`.substring(0, 2);
    } else {
      // If it's a letter or character, take only the first character
      return firstChar;
    }
  };

  const getItem = ({
    label,
    key,
    icon,
    children,
    type,
    isEnv,
  }: MenuItem): MenuItem => {
    return {
      label: (
        <span
          className={classNames(styles.menuChildTitle, slots["menu-item-name"])}
        >
          {label}
        </span>
      ),
      key,
      icon: icon ? (
        isEnv ? (
          <div className={styles.envIcon}>{icon}</div>
        ) : (
          <span className={styles.menuIcon}>
            <div className={icon}>
              <IconFont className={icon} type={icon} />
            </div>
          </span>
        )
      ) : null,
      children,
      type,
    } as unknown as MenuItem;
  };

  const items = useMemo(() => {
    const envItems = envList?.map(({ env_id, name, is_private, isLocal }) => ({
      key: env_id,
      icon: getLogo(name),
      label: (
        <div className={styles.envLabel}>
          <Flex
            justify="start"
            align="center"
            flex={1}
            style={{ width: "10%" }}
          >
            <Tooltip title={name}>
              <span className={[slots.name, slots["menu-item-name"]].join(" ")}>
                {name}
              </span>
            </Tooltip>
            {is_private === 1 && (
              <span className={slots.private}>{t("global_setting.type")}</span>
            )}
          </Flex>
          <div className="operation-content">
            <span className={slots.operation}>
              {env_id !== "2" && !isLocal && (
                <IconFont
                  onClick={(e) => {
                    e.stopPropagation();
                    copyEnv({ env_id, project_id: `${project_id}` });
                  }}
                  type="icon-copy"
                />
              )}
              {!includes(["1", "2"], env_id) && (
                <Popconfirm
                  title={t("supplement.confirm_del1")}
                  onConfirm={() => {
                    if (isLocal) {
                      const res = envList.filter((e) => !e.isLocal);
                      if (res.length && head(selectedKeys) === env_id) {
                        setSelectedKeys([res[res.length - 1].env_id]);
                      }
                      if (!res.length) {
                        setSelectedKeys([ENV_MANAGE_ENUM.cookie]);
                      }
                      updateEnvList(res);
                      return;
                    }
                    delEnv(env_id);
                  }}
                >
                  <IconFont type="icon-trash" />
                </Popconfirm>
              )}
            </span>
          </div>
        </div>
      ),
    }));

    return MENU_ITEMS.map(
      ({ label, key, icon, children, type, disableDraggable }: MenuItem) => ({
        label: <span className={styles.menuTitle}>{label}</span>,
        key,
        icon: icon ? <IconFont className={icon} type={icon} /> : null,
        children:
          key === MENU_ITEMS_KEY.all
            ? children && children.map((e) => getItem(e))
            : envItems.map((e) => getItem({ ...e, isEnv: true })),
        type,
        disableDraggable,
      }),
    );
  }, [envList, selectedKeys]);

  const delEnv = async (env_id: string) => {
    try {
      const res = envList?.filter((e) => e.env_id !== env_id);
      if (res.length) {
        if (head(selectedKeys) === env_id) {
          const index = envList?.findIndex((e) => e.env_id === env_id) - 1;
          if (index >= 0) {
            setSelectedKeys([res[index].env_id]);
          } else {
            setSelectedKeys([res[0].env_id]);
          }
        }
      } else {
        setSelectedKeys([ENV_MANAGE_ENUM.cookie]);
      }
      saveProjectConfig("envList", res);
      updateEnvList(res);
      if (env_id === envDetailKeys) {
        const id = res?.find((e) => e.env_id === "1")?.env_id || "";
        updateEnvDetailKeys(id);
        if (project_id) {
          // updatePreFerenceEnv({ [project_id]: id });
        }
      }
    } catch (err) {
      /* empty */
    }
  };

  const onSelect: DraggableMenuProps["onSelect"] = (selectedKeys) => {
    setSelectedKeys(selectedKeys as string[]);
  };

  const handleMoveEnv = (envList: EnvListItem[]) => {
    const newEnvList = cloneDeep(envList);
    newEnvList.forEach((item, index) => {
      item.sort = index + 1;
    });

    saveProjectConfig("envList", newEnvList);
    updateEnvList(newEnvList);
    message.success(t("supplement.move_success"));
    // multiMoveEnvRequest({
    //   project_id: project_id || '',
    //   env_ids: [activeId],
    //   before_id: beforeId,
    //   after_id: afterId,
    // }).then(async () => {
    //   message.success(t('supplement.move_success'));

    //   await getEnvList(project_id || '');
    // });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (isEqual(active.id, over?.id)) {
      return;
    }

    const activeIndex = findIndex(envList, (i) => i.env_id === active.id);
    const overIndex = findIndex(envList, (i) => i.env_id === over?.id);
    const newEnvList = arrayMove(envList || [], +activeIndex, +overIndex);
    const newActiveIndex = findIndex(newEnvList, (i) => i.env_id === active.id);

    // Move to the end
    if (isEqual(size(envList) - 1, newActiveIndex)) {
      const beforeId = newEnvList[newActiveIndex - 1].env_id;

      handleMoveEnv(newEnvList);
      return;
    }

    const afterId = newEnvList[newActiveIndex + 1].env_id;
    handleMoveEnv(newEnvList);
  };

  return (
    <DraggableMenu
      items={items}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      onDragEnd={onDragEnd}
    />
  );
};

export default Menus;
