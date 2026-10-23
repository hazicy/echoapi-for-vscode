import slots from "@/shared/ui/base/slots.module.css";
import { FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, Collapse, Flex, Input, Select, Space, Tag } from '@/shared/ui/base';

import cn from 'classnames';
import { concat, filter, isEqual, map, size, trim } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import BasicTable from '@/shared/components/BasicTable';
import IconFont from '@/shared/ui/IconFont';
import Tooltip from '@/shared/ui/Tooltip';
import { FIELD_TYPES, STATUS_CODE } from '@/shared/constants/common';
import { useProjectConfig, useSystemConfig } from '@/app/store';
import { ApisBaseDataItem } from '@/features/requests/types/base';
import { DefaultRequestSystemHeaders } from '@/features/requests/types/request';
import { GlobalParamsHeaderItem } from '@/features/project/types';

import { RequestTableProps } from '../../types';

import { BasicTableContainer } from './style';
import { ENV_MANAGE_ENUM } from '@/features/environment/components/Environment/constants';
import { openEnvPage } from '@/features/requests/events/env';

type Props = Pick<
  RequestTableProps,
  'globalParams' | 'folderParams' | 'paramsType' | 'tabType' | 'isSystem' | 'columnSwitchConfig' | 'target_type'
>;

const PublicParamsTable: FC<Props> = memo(
  ({
    globalParams = [],
    folderParams = [],
    paramsType,
    tabType,
    isSystem = false,
    columnSwitchConfig,
    target_type
  }) => {
    const { t } = useTranslation();
    const systemConfig = useSystemConfig((state) => state.systemConfig);
    const systemRequestHeader = systemConfig?.systemRequestHeader || [];
    const systemRequestHeaderWs2 = systemConfig?.systemRequestHeaderWs2 || [];

    const updateSystemConfig = useSystemConfig((state) => state.updateSystemConfig);

    const lastDataSource = useMemo(() => {
      let commonParameters: (GlobalParamsHeaderItem | ApisBaseDataItem)[] = [];

      const newGlobalParams = map(globalParams, (it) => ({ ...it, type: 'global' }));
      const newFolderParams = map(folderParams, (it) => ({ ...it, type: 'folder' }));

      if (paramsType !== 'global') {
        commonParameters = concat(commonParameters, newGlobalParams);
      }

      commonParameters = concat(commonParameters, newFolderParams);
      if (tabType === 'header') {
        commonParameters = concat(
          commonParameters,
          map(isEqual(target_type, 'socketio')
            ? []
            : isEqual(target_type, 'websocket2')
              ? (systemRequestHeaderWs2 as GlobalParamsHeaderItem[])
              : (systemRequestHeader as GlobalParamsHeaderItem[]),
            (it) => ({
              ...it,
              type: 'system',
            }))
        );
      }
      return filter(commonParameters, (item) => trim(item?.key) !== '') || [];
    }, [globalParams, folderParams, paramsType, systemRequestHeader]);
    const { updateEnvOpen, updateEnvSettingKeys } = useProjectConfig(
      useShallow(({ updateEnvOpen, updateEnvSettingKeys }) => ({
        updateEnvOpen,
        updateEnvSettingKeys,
      }))
    );

    const columns = [
      {
        key: 'handle',
        dataIndex: 'handle',
        title: '',
        width: 34,
        render: (_text: string) => {
          return null;
        },
      },
      {
        key: 'is_checked',
        dataIndex: 'is_checked',
        title: '',
        width: 24,
        render: (text: number, rowData: any) => {
          return (
            <Checkbox
              onChange={(e) => {
                const systemHeader: DefaultRequestSystemHeaders[] = map(
                  isEqual(target_type, 'websocket2') ? systemRequestHeaderWs2 : systemRequestHeader,
                  (el) => {
                    if (el?.key === rowData?.key) {
                      return { ...el, is_checked: e?.target?.checked ? 1 : -1 };
                    }
                    return el;
                  }
                );

                isEqual(target_type, 'websocket2')
                ? updateSystemConfig({ ...systemConfig, systemRequestHeaderWs2: systemHeader })
                : updateSystemConfig({ ...systemConfig, systemRequestHeader: systemHeader });

                window?.vscode.postMessage({
                  action: 'setSystemConfig',
                  data: { systemRequestHeader: systemHeader }
                });

              }}
              disabled={rowData?.type !== 'system'}
              checked={text === 1}
            />
          );
        },
      },
      {
        key: 'key',
        dataIndex: 'key',
        title: t('common.request_table.param_name'),
        width: '35%',
        render: (text: string, rowData: any) => {
          return (
            <Flex>
              <Input style={{ paddingLeft: 11 }} disabled variant="borderless" value={text} />
              {!isEqual(columnSwitchConfig?.parameter_type, STATUS_CODE.DISABLE) && (
                <Select
                  style={{ minWidth: 120 }}
                  disabled
                  suffixIcon={
                    <div>
                      <IconFont type="icon-drop-down" style={{ pointerEvents: 'none' }} />
                      <div
                        style={{ pointerEvents: 'visible' }}
                        className={cn({
                          [slots.required]: true,
                          [slots.checked]: rowData?.not_null == 1,
                        })}
                      >
                        <Tooltip title={t('supplement.required')} placement="top">
                          <IconFont style={{ fontSize: 14 }} type="icon-fuhao" />
                        </Tooltip>
                      </div>
                    </div>
                  }
                  value={rowData?.field_type || ''}
                >
                  {FIELD_TYPES?.map((item: string) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Flex>
          );
        },
      },
      {
        key: 'value',
        dataIndex: 'value',
        title: t('common.request_table.param_value'),
        width: '33%',
        render: (text: string) => {
          return <Input disabled variant="borderless" value={text} />;
        },
      },

      {
        key: 'description',
        dataIndex: 'description',
        title: t('common.request_table.param_desc'),
        width: '33%',
        render: (text: string, row: any) => {
          return (
            <Flex align="center">
              <Input
                disabled
                variant="borderless"
                value={
                  !isEqual(columnSwitchConfig?.parameter_description, STATUS_CODE.DISABLE)
                    ? text
                    : ''
                }
              />
              <Space size={8} style={{ padding: '0 10px' }}>
                {row?.type !== 'system' && (
                  <IconFont
                    onClick={() => {
                      if (row?.type === 'global') {
                        openEnvPage({ env_id: ENV_MANAGE_ENUM.globalParm });
                      } else {
                        
                        window?.vscode.postMessage({
                          action: 'openTagPanelById',
                          data: row?.target_id
                        });
                      }
                    }}
                    className={slots["global-param-edit"]}
                    type="icon-edit"
                  />
                )}

                {row?.type === 'global' || row?.type === 'system' ? (
                  <Tag bordered={false} color="processing">
                    {t('common.request_table.global')}
                  </Tag>
                ) : (
                  <Tag bordered={false} color="orange">
                    {t('common.request_table.folder')}
                  </Tag>
                )}
              </Space>
            </Flex>
          );
        },
      },
    ];

    if (size(lastDataSource) <= 0) {
      return null;
    }
    return (
      <BasicTableContainer>
        {size(lastDataSource) > 0 && (
          <Collapse
            ghost
            expandIcon={(panelProps) => {
              return (
                <>
                  {panelProps.isActive ? (
                    <IconFont type="icon-preview" />
                  ) : (
                    <IconFont type="icon-not-show" />
                  )}
                </>
              );
            }}
            className={[slots["table-collapse"], slots["table-collapse-public"]].join(" ")}
            style={{ marginTop: -12 }}
            items={[
              {
                key: 'description',
                label: `${isSystem
                  ? `${t('common.request_table.system')}（header）`
                  : `${t('common.request_table.public_param')}（${tabType}）`
                  }`,
                children: (
                  <BasicTable
                    tableLayout="fixed"
                    rowKey="param_id"
                    bordered
                    showHeader={false}
                    cellPadding={0}
                    dataSource={lastDataSource}
                    columns={columns}
                  />
                ),
              },
            ]}
          />
        )}
      </BasicTableContainer>
    );
  }
);

export default PublicParamsTable;
