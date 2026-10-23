import slots from "@/shared/ui/base/slots.module.css";
import styles from './style.module.css';
import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import {
  Button,
  Flex,
  message,
  Skeleton,
  Tree,
} from '@/shared/ui/base';
import type { GetProps, MenuItemProps, MenuProps, TreeProps } from '@/shared/ui/base';
import { TreeMenuContainer, CreateOtherIcon, TreeContainer } from './style';
import Search from './components/Search';
import {
  API_TYPE_INCLUDES,
  APIS_FOLDER_OPERATE_LIST,
  APIS_MORE_OPERATE_LIST,
  DROP_POSITION_ENUM,
  FOLDER_TYPE_INCLUDES,
  SOCKET_METHOD_FOLDER_OPERATE_LIST,
  SOCKET_SERVICE_FOLDER_OPERATE_LIST,
  SOCKETIO_METHOD_OPERATE_LIST,
  SSE_METHOD_OPERATE_LIST,
  TREE_CREATE_LIST,
  WEBSOCKET2_METHOD_OPERATE_LIST,
} from '@/features/collections/constants/tree';
import { APIS_TARGET_TYPE_ENUM } from '@/features/requests/constants';
import { useDebounceFn, useMemoizedFn, useSafeState } from 'ahooks';
import apisActionMap from '@/features/requests/events/action';
import { TreeDataFilterParams } from '@/features/collections/types/tree';
import {
  cloneDeep,
  head,
  includes,
  isArray,
  isEqual,
  isPlainObject,
  last,
  map,
  omit,
  reduce,
} from 'lodash';
import IconFont from '@/shared/ui/IconFont';
import { createOpensItem } from '@/features/requests/events/opens';
import useTreeData from '@/features/collections/hooks/useTreeData';
import ItemIcon from './components/ItemIcon';
import ItemTitle from './components/ItemTitle';

import { TreeDataItem as ApiTreeDataItem } from '@/features/requests/types/api';
import { DataNode } from '@/shared/ui/base';
import { DEFAULT_CALC_CHILDREN_COUNT_TYPES } from './constants';
import { ApisBaseData } from '@/features/requests/types/base';
import ApisColorPrefixIcon from '@/shared/ui/ApisColorPrefixIcon';
import { ApisItemActionType } from '@/features/requests/types/other';
import { moveApisRequestType } from '@/features/requests/types/services';
import useTreeSort from '@/features/collections/hooks/useTreeSort';

import TitleExtraContent from './TitleExtraContent';
import { useTranslation } from 'react-i18next';
import { useApis } from '@/app/store';
import { Empty } from '@/shared/ui';
import { SegmentedTabs } from '@/shared/components';

import NewBtns from './components/New';
import Tests from './Tests';

type TreeDataItem = ApiTreeDataItem & DataNode;

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

export interface TreeMenuProps {
  value: any[];
  createMenus?: MenuProps['items'];
  searchInputPlaceholder?: string;
}

const customFieldNames = {
  title: 'name',
  key: 'target_id',
  parentKey: 'parent_id',
  children: 'children',
  type: 'target_type',
  parentNodeType: APIS_TARGET_TYPE_ENUM.FOLDER,
};

const TreeAdd: React.FC<TreeMenuProps> = ({
  value,
  searchInputPlaceholder,
}) => {
  const { t } = useTranslation();

  const treeRef = useRef<any>(null);

  const updateTreeLoading = useApis((stroe) => stroe.updateTreeLoading);

  const [treeDataFilterParams, setTreeDataFilterParams] =
    useSafeState<TreeDataFilterParams>({
      value: '',
    });
  const [treeExpandedKeys, setTreeExpandedKeys] = useSafeState<string[]>([]);
  const [tabValue, setTabValue] = useSafeState<string>('requests');
  const [scrollIng, setScrollIng] = useSafeState(false);
  const [treeHeight, setTreeHeight] = useSafeState(500);
  const containerRef = useRef<any>(null);
  const treeLoading = useApis((stroe) => stroe.treeLoading);
  const apiOriginDetailsList = useApis((store) => store.apiOriginDetailsList);
  const apisActiveKey = useApis((stroe) => stroe.apisActiveKey);
  const updateApisActiveKey = useApis((stroe) => stroe.updateApisActiveKey);

  useEffect(() => {
    if (tabValue === 'tests') {
      // Fetch the latest report data
      window?.vscode.postMessage({
        action: 'getProjectReportList',
      });
    }
  }, [tabValue]);

  const updateApiOriginDetailsList = useApis(
    (store) => store.updateApiOriginDetailsList,
  );
  useEffect(() => {
    const resizeHandler = () => {
      const containerHeight = containerRef?.current?.offsetHeight;
      setTreeHeight(containerHeight);
    };

    window.addEventListener('resize', resizeHandler);
    resizeHandler();

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [containerRef?.current, tabValue]);

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    const curKey = head(keys) as string;
    // Update the currently selected tab key
    updateApisActiveKey(curKey);
    window?.vscode.postMessage({
      action: 'openTagPanelById',
      data: curKey,
    });
  };

  const onExpand: TreeProps['onExpand'] = useMemoizedFn(
    (keys, { nativeEvent }) => {
      // NOTE: Disable auto-expand when dragging into
      if (isEqual(nativeEvent.type, 'dragenter')) {
        return;
      }
      setTreeExpandedKeys(keys as string[]);
    },
  );

  const handleCreateItemClick: MenuItemProps['onClick'] = async ({ key }) => {
    if (key === 'folder') {
      window?.vscode.postMessage({
        action: 'showInputBox',
      });
      return;
    }
    if (key === 'import_curl') {
      window?.vscode.postMessage({
        action: 'openCurlPanel',
      });
      return;
    }
    if (key === 'import_data') {
      window?.vscode.postMessage({
        action: 'openImportDataPanel',
        data: { type: 'curl' },
      });
      return;
    }

    if (key === 'import_tc_data') {
      window?.vscode.postMessage({
        action: 'openImportDataPanel',
        data: { type: 'thunderClient' },
      });
      return;
    }

    if (key === 'export_data') {
      window?.vscode.postMessage({
        action: 'openExportDataPanel',
        data: { type: 'echoapi' },
      });
      return;
    }

    const result = await createOpensItem({
      target_type: key as APIS_TARGET_TYPE_ENUM,
      project_id: '',
      parent_id: '0',
    });

    window?.vscode.postMessage({
      action: 'openTagPanel',
      data: result,
    });
  };

  const createMenus: MenuProps['items'] = map(TREE_CREATE_LIST, (item) => ({
    ...omit(item, ['gradientColor']),
    key: item.key as string,
    label: item.label,
    icon: item.gradientColor ? (
      <ApisColorPrefixIcon
        icon={item.icon || ''}
        gradientColor={item.gradientColor}
      />
    ) : (
      <CreateOtherIcon>
        <IconFont type={item.icon || ''} />
      </CreateOtherIcon>
    ),
    onClick: handleCreateItemClick,
  }));

  const { treeData } = useTreeData({
    searchIncludesField: ['name', 'url'],
    treeDataFilterParams,
    dataSource: value,
    customFieldNames,
    typeIncludes: [...API_TYPE_INCLUDES],
    folderIncludes: [...FOLDER_TYPE_INCLUDES],
    expandedKeys: treeExpandedKeys,
    setExpandedKeys: setTreeExpandedKeys,
  });

  const calcChildrenCountFunc = useMemoizedFn(
    (children: ApiTreeDataItem['children']) => {
      const includesTypes = DEFAULT_CALC_CHILDREN_COUNT_TYPES;

      function count(children: ApiTreeDataItem['children']) {
        return reduce(
          children,
          (acc, item) => {
            if (!includes(includesTypes, item[customFieldNames.type])) {
              acc += 1;
            }

            if (item.children && item.children.length > 0) {
              acc += count(item.children);
            }

            return acc;
          },
          0,
        );
      }

      return count(children);
    },
  );

  const nodeItemTitleExtraContent = useMemoizedFn((nodeItem: any) => (
    <TitleExtraContent nodeItem={nodeItem} />
  ));
  const computedMoreOperateMenus = useMemoizedFn((nodeItem: ApisBaseData) => {
    const { target_type } = nodeItem;

    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.FOLDER)) {
      return map(APIS_FOLDER_OPERATE_LIST, (it) => {
        if (it?.children) {
          return {
            ...it,
            icon: (
              <IconFont
                type={it.icon}
                style={{ fontSize: 'var(--font-size-16)' }}
              />
            ),
            children: map(
              it?.children,
              (child: { gradientColor: string[]; icon: string }) => ({
                ...child,
                icon: child.gradientColor ? (
                  <ApisColorPrefixIcon
                    icon={child.icon || ''}
                    gradientColor={child.gradientColor}
                  />
                ) : (
                  <CreateOtherIcon>
                    <IconFont type={child.icon || ''} />
                  </CreateOtherIcon>
                ),
              }),
            ),
          };
        } else {
          return {
            ...it,
            icon: (
              <IconFont
                type={it.icon}
                style={{ fontSize: 'var(--font-size-16)' }}
              />
            ),
          };
        }
      });
    }
    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.SOCKET)) {
      return map(SOCKET_SERVICE_FOLDER_OPERATE_LIST, (item) => ({
        ...item,
        icon: (
          <IconFont
            type={item.icon}
            style={{ fontSize: 'var(--font-size-16)' }}
          />
        ),
      }));
    }
    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.SOCKET_METHOD)) {
      return map(SOCKET_METHOD_FOLDER_OPERATE_LIST, (item) => ({
        ...item,
        icon: (
          <IconFont
            type={item.icon}
            style={{ fontSize: 'var(--font-size-16)' }}
          />
        ),
      }));
    }

    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.SSE)) {
      return map(SSE_METHOD_OPERATE_LIST, (item) => ({
        ...item,
        icon: (
          <IconFont
            type={item.icon}
            style={{ fontSize: 'var(--font-size-16)' }}
          />
        ),
      }));
    }

    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.WEBSOCKET2)) {
      return map(WEBSOCKET2_METHOD_OPERATE_LIST, (item) => ({
        ...item,
        icon: (
          <IconFont
            type={item.icon}
            style={{ fontSize: 'var(--font-size-16)' }}
          />
        ),
      }));
    }

    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.SOCKETIO)) {
      return map(SOCKETIO_METHOD_OPERATE_LIST, (item) => ({
        ...item,
        icon: (
          <IconFont
            type={item.icon}
            style={{ fontSize: 'var(--font-size-16)' }}
          />
        ),
      }));
    }

    return map(APIS_MORE_OPERATE_LIST, (item) => ({
      ...item,
      icon: (
        <IconFont
          type={item.icon}
          style={{ fontSize: 'var(--font-size-16)' }}
        />
      ),
    }));
  });
  const handleMoreOperateClick = useMemoizedFn(
    async (
      nodeItem: ApisBaseData,
      keyPath: string[],
      domEvent:
        | React.MouseEvent<HTMLElement>
        | React.KeyboardEvent<HTMLElement>,
    ) => {
      domEvent.stopPropagation();

      const targetType = nodeItem?.target_type;
      const actionType = last(keyPath) || '';

      const currentAction = (apisActionMap as any)[targetType];
      const actionFun = currentAction[actionType];

      const nodeDetails = value.find(
        (i: any) => i?.target_id === nodeItem.target_id,
      );
      const actionFunParams: ApisItemActionType = {
        apisData: nodeDetails,
        projectId: '',
      };

      // For folder type, need to pass in child node type
      if (isEqual(targetType, APIS_TARGET_TYPE_ENUM.FOLDER)) {
        actionFunParams.childTargetType = head(
          keyPath,
        ) as APIS_TARGET_TYPE_ENUM;
      }

      actionFun?.(actionFunParams);
    },
  );
  const nodeItemDropdownContextMenu = useMemoizedFn(
    (nodeItem: ApisBaseData): MenuProps => {
      return {
        items: computedMoreOperateMenus(nodeItem),
        onClick: ({ keyPath, domEvent }) =>
          handleMoreOperateClick(nodeItem, keyPath, domEvent),
      };
    },
  );

  const computedTreeData = useMemoizedFn(
    (data: TreeDataItem[]): TreeDataItem[] => {
      return map(data, (item) => {
        let icon: React.ReactNode = '';
        const isParentNodeType = isEqual(
          item[customFieldNames.type],
          customFieldNames.parentNodeType,
        );

        if (!isParentNodeType) {
          icon = (
            <ItemIcon
              {...item}
              {...(customFieldNames as Record<string, string>)}
            />
          );
        }

        const selectable = !isParentNodeType;

        const extendProps: any = {};

        const childrenCount = calcChildrenCountFunc(item.children);

        const baseProps = {
          key: item[customFieldNames.key as keyof TreeDataItem] as string,
          isLeaf: item.isLeaf,
          selectable,
          style: { height: 28 },
          icon,
          title: (
            <ItemTitle
              {...item}
              {...extendProps}
              fieldType={customFieldNames.type}
              childrenCount={childrenCount}
              name={
                item[customFieldNames.title as keyof TreeDataItem] as string
              }
              showChildrenCount={true}
              nodeItemTitleExtraContent={nodeItemTitleExtraContent}
              nodeItemDropdownContextMenu={nodeItemDropdownContextMenu}
            />
          ),
        };

        if (item[customFieldNames.children as keyof TreeDataItem]) {
          return {
            ...baseProps,
            children: computedTreeData(
              item[customFieldNames.children as string] as TreeDataItem[],
            ),
          };
        }

        return { ...baseProps };
      }) as TreeDataItem[];
    },
  );

  const defaultBottomNode = useMemo(
    () => (
      <div
        className="tree-bottom-node-empty"
        style={{ height: 100 }}
      ></div>
    ),
    [createMenus, t],
  );

  const renderTreeData = useMemoizedFn(
    (data: TreeDataItem[]): TreeDataItem[] => {
      const result = computedTreeData(data);

      if (defaultBottomNode) {
        result.push({
          className: slots["tree-bottom-node-wrap"],
          title: defaultBottomNode,
          key: 'tree-bottom-node-key',
          isLeaf: true,
          icon: <div />,
          selectable: false,
        } as TreeDataItem);
      }

      return result;
    },
  );

  // NOTE: Can internal computedTreeData get the latest data?
  const finalTreeData = useMemo(() => {
    return renderTreeData(treeData);
  }, [treeData, renderTreeData]);

  const titleRender = useMemoizedFn((item: TreeDataItem) => {
    return React.cloneElement(item.title as any, {
      scrollIng,
    });
  });

  const switcherIcon = useMemo(
    () => (
      <IconFont
        type="icon-drop-down"
        style={{ fontSize: 16 }}
      />
    ),
    [],
  );
  const { run: stopScrollIng } = useDebounceFn(
    () => {
      setScrollIng(false);
    },
    { wait: 100 },
  );
  const handleScroll = useMemoizedFn(() => {
    setScrollIng(true);
    stopScrollIng();
  });
  // Data processing after move
  const handleMoveApis = async (data: moveApisRequestType) => {
    try {
      window?.vscode.postMessage({
        action: 'onDrop',
        data,
      });
    } catch (err) {}
  };
  // Tree sort allow drop configuration
  const allowDrop: TreeProps['allowDrop'] = (info) => {
    const { dropNode, dropPosition, dragNode } = info;

    const dragNodeTitleProps = (dragNode?.title as ReactElement)?.props || {};
    const dropNodeTitleProps = (dropNode?.title as ReactElement)?.props || {};

    // Types that do not allow dragging inside
    if (
      includes(
        [
          APIS_TARGET_TYPE_ENUM.API,
          APIS_TARGET_TYPE_ENUM.DOC,
          APIS_TARGET_TYPE_ENUM.GRPC,
          APIS_TARGET_TYPE_ENUM.WEBSOCKET,
          APIS_TARGET_TYPE_ENUM.SOCKET_METHOD,
          APIS_TARGET_TYPE_ENUM.SSE,
          APIS_TARGET_TYPE_ENUM.WEBSOCKET2,
          APIS_TARGET_TYPE_ENUM.SOCKETIO,
          APIS_TARGET_TYPE_ENUM.GRAPHQL,
        ],
        dropNodeTitleProps?.target_type,
      ) &&
      isEqual(dropPosition, DROP_POSITION_ENUM.INSIDE)
    ) {
      return false;
    }

    // Special handling for TCP methods, only allow sorting within current TCP client
    if (
      isEqual(APIS_TARGET_TYPE_ENUM.SOCKET, dropNodeTitleProps?.target_type)
    ) {
      if (
        isEqual(dropPosition, DROP_POSITION_ENUM.INSIDE) &&
        !isEqual(
          APIS_TARGET_TYPE_ENUM.SOCKET_METHOD,
          dragNodeTitleProps?.target_type,
        )
      ) {
        return false;
      }
      if (
        isEqual(
          APIS_TARGET_TYPE_ENUM.SOCKET_METHOD,
          dragNodeTitleProps?.target_type,
        ) &&
        !isEqual(dragNodeTitleProps?.parent_id, dropNodeTitleProps?.target_id)
      ) {
        return false;
      }
    }

    if (
      isEqual(
        APIS_TARGET_TYPE_ENUM.SOCKET_METHOD,
        dropNodeTitleProps?.target_type,
      )
    ) {
      if (
        !isEqual(
          APIS_TARGET_TYPE_ENUM.SOCKET_METHOD,
          dragNodeTitleProps?.target_type,
        )
      ) {
        return false;
      }
      if (
        !isEqual(dropNodeTitleProps?.parent_id, dragNodeTitleProps?.parent_id)
      ) {
        return false;
      }
    }

    if (
      isEqual(
        APIS_TARGET_TYPE_ENUM.SOCKET_METHOD,
        dragNodeTitleProps?.target_type,
      ) &&
      !includes(
        [APIS_TARGET_TYPE_ENUM.SOCKET, APIS_TARGET_TYPE_ENUM.SOCKET_METHOD],
        dropNodeTitleProps?.target_type,
      )
    ) {
      return false;
    }

    return true;
  };
  const { genNewData, ...originTreeSortProps } = useTreeSort({
    allowDrop,
    primaryIdKeyName: 'target_id',
    onMoveApis: handleMoveApis,
    type: 'target_type',
  });


  const createApi = async () => {
    const result = await createOpensItem({
      target_type: APIS_TARGET_TYPE_ENUM.API,
      project_id: '',
      parent_id: '0',
    });
    window?.vscode.postMessage({
      action: 'openTagPanel',
      data: result,
    });
  };

  const TESTING_CONFIG_TAB_LIST = [
    {
      label: (
        <span className={styles.workspaceTabLabel} title={t('common.api_tab.run')}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h12l-1 11H5L4 6Zm-1-3h14M7 3V1.5h6V3" />
          </svg>
          <span className={styles.workspaceTabText}>{t('common.api_tab.run')}</span>
        </span>
      ),
      value: 'requests',
      children: (
        <>
          <Search
            treeDataFilterParams={treeDataFilterParams}
            setTreeDataFilterParams={setTreeDataFilterParams}
            searchInputPlaceholder={searchInputPlaceholder}
          />
          <Skeleton
            active
            paragraph={{ rows: 15, width: '100%' }}
            loading={treeLoading}
          >
            <div className={slots["tree-wrap"]}>
              <TreeContainer ref={containerRef}>
                {treeData.length <= 0 ? (
                  <Empty
                    className={slots["response-empty-wrap"]}
                    description={
                      <Flex
                        gap={6}
                        justify="center"
                        align="center"
                        vertical
                      >
                        <Flex wrap="wrap">
                          Guess you haven't created any requests yet!
                        </Flex>
                        <Flex
                          justify="center"
                          align="center"
                          wrap="wrap"
                        >
                          <Flex
                            gap={4}
                            align="center"
                          >
                            You can{' '}

                            &nbsp;{' '}
                          </Flex>
                          <Flex
                            gap={4}
                            align="center"
                          >

                            <Button
                              style={{ height: '24' }}
                              type="text"
                              onClick={createApi}
                            >
                              Create a new request
                            </Button>
                          </Flex>
                        </Flex>
                      </Flex>
                    }
                    image={
                      <IconFont
                        type="icon-zanwu"
                        className={slots["icon-empty-wrap"]}
                      />
                    }
                  />
                ) : (
                  <DirectoryTree
                    ref={treeRef}
                    height={treeHeight}
                    onSelect={onSelect}
                    selectedKeys={[apisActiveKey]}
                    onExpand={onExpand}
                    expandedKeys={treeExpandedKeys}
                    expandAction={'click'}
                    onScroll={handleScroll}
                    switcherIcon={switcherIcon}
                    titleRender={titleRender}
                    treeData={finalTreeData}
                    {...originTreeSortProps}
                  />
                )}
              </TreeContainer>
            </div>
          </Skeleton>
        </>
      ),
    },
    {
      label: (
        <span className={styles.workspaceTabLabel} title={t('menu.test')}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 2.5h14v11H3zM6 6h5v4H6zM7 17h6M10 13.5V17M14 6h.01M14 9h.01" />
          </svg>
          <span className={styles.workspaceTabText}>{t('menu.test')}</span>
        </span>
      ),
      value: 'tests',
      children: <Tests />,
    },
  ];

  return (
    <>
      <TreeMenuContainer>
        <div className={styles.workspaceToolbar}>
          <NewBtns createMenus={createMenus} />
        </div>

        <SegmentedTabs
          className={slots["tab-container"]}
          options={TESTING_CONFIG_TAB_LIST}
          value={tabValue}
          onChange={(val) => {
            setTabValue(val as string);
          }}
        />

      </TreeMenuContainer>
    </>
  );
};

export default TreeAdd;
