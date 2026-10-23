import slots from "@/shared/ui/base/slots.module.css";
import React, { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ConfigProvider, Flex, Input, Select, SelectProps, Space } from '@/shared/ui/base';

import { find, includes, isArray, isString } from 'lodash';

import IconFont from '@/shared/ui/IconFont';
import Tooltip from '@/shared/ui/Tooltip';
import { PROTOCOL_OPTIONS } from '@/features/requests/constants';
import { METHODS_MAP } from '@/shared/constants/common';
import useTheme from '@/shared/hooks/useTheme';
import { openEnvPage } from '@/features/requests/events/env';
import { useApis, useProjectConfig } from '@/app/store';

import VarInput from '../../../variables/components/VarInput';

import { OptionsItemContainer, UrrGroupWrap } from './style';
import { getCollectionServerId } from '@/features/requests/utils/apis';
import { CurlDataType } from '@/features/requests/types/other';
import styles from './style.module.css';

export interface UrlGroupProps {
  envId?: string;
  type?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  data: {
    url?: string;
    method?: string;
    protocol?: string;
    service?: string;
    func?: string;
  };
  placeholder?: string;
  maxLength?: number;
  urlGroupExtraContent?: React.ReactNode;
  supportCurlImport?: boolean;
  onChange: (key: string, value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>, isEnvOpen?: boolean) => void;
  curlChange?: (d: CurlDataType) => void;
  curServerId: string;
  SetCurServerId: (newId: string) => void;
  hideProtocol?: boolean
  hideServer?: boolean
}

type LabelRender = SelectProps['labelRender'];

const UrlGroup = (props: UrlGroupProps) => {
  const {
    envId,
    type = 'api',
    data,
    readOnly = false,
    className = '',
    style = {},
    placeholder,
    maxLength,
    urlGroupExtraContent,
    onChange,
    onKeyDown,
    curServerId,
    SetCurServerId,
    hideProtocol = false,
    hideServer = false,
    supportCurlImport = false,
    curlChange,
  } = props || {};
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const envList = useProjectConfig((state) => state.envList);
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);
  const apisActiveData = useApis(store => store.apisActiveData);
  const apiOriginDetailsList = useApis((store) => store.apiOriginDetailsList);
  const updateCurrentServerId = useApis((state) => state.updateCurrentServerId);
  const customMethodList = useProjectConfig((state) => state?.customMethodList);

  const [methodSelectOpen, setMethodSelectOpen] = useState(false);
  const requestBarRef = useRef<HTMLElement>(null);

  const currentEnv = useMemo(() => {
    const env = envId || envDetailKeys;
    return find(envList, (it) => it?.env_id === env); // use passed environment id if available, otherwise use default
  }, [envList, envDetailKeys, envId]);

  const envUrl = useMemo(() => {
    if (isArray(currentEnv?.server_list)) {
      const defaultServer = currentEnv.server_list.find(i => i?.is_default === 1);
      return defaultServer?.uri || '';
    }
    return '';
  }, [currentEnv]);


  useEffect(() => {
    const tempServerId = getCollectionServerId(apisActiveData?.target_id, apiOriginDetailsList.reduce((pre: any, cur) => {
      if (cur?.target_id) {
        pre[cur.target_id] = cur;
      }
      return pre;
    }, {}));
    updateCurrentServerId(tempServerId);
    SetCurServerId(tempServerId);
  }, [apiOriginDetailsList]);

  const handleChange = (key: string, value: string) => {
    onChange(key, value);
  };

  const defaultServerId = useMemo(() => {
    if (isArray(currentEnv?.server_list)) {
      const defaultServerId = currentEnv.server_list.find(i => i?.is_default === 1)?.server_id || '';
      if(defaultServerId){
        return defaultServerId;
      }
      return currentEnv.server_list.find(i => i?.server_id == '1')?.server_id || '';
    }
    return '';
  }, [currentEnv]);

  const addServer = () => {
    openEnvPage({ env_id: currentEnv?.env_id });
  };

  const renderUri = (uri: string) => {
    if (uri.length <= 0) {
      return <span style={{ fontStyle: 'italic' }}>null</span>;
    }
    return uri;
  };

  const optionRender: SelectProps['optionRender'] = (option) => {
    return (
      <OptionsItemContainer>
        <span className={slots.label}>{option?.data?.label}</span>
        <span className={slots.uri}>{renderUri(option?.data?.uri || '')}</span>
      </OptionsItemContainer>
    );
  }

  const serverOptions = useMemo(() => {
    return currentEnv?.server_list?.map((item) => ({
      label: item.name,
      value: item.server_id,
      uri: item.uri,
    }));
  }, [currentEnv?.server_list]);

  const labelRender: LabelRender = (option) =>
    renderUri(serverOptions?.find(server => server.value === option.value)?.uri || '');

  const pasteCurlChange = (d: CurlDataType) => {
    if (supportCurlImport) {
      curlChange?.(d);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            selectorBg: themeToken.popoverSelectBgColor,
            borderRadius: themeToken.borderRadius,
            fontSize: themeToken.fontSize14,
            colorBorder: 'transparent',
          },
          Input: {
            activeShadow: 'none',
            fontSize: themeToken.fontSize14,
            hoverBg: themeToken.highlightChangeColor,
            activeBg: themeToken.highlightChangeColor,
          },
        },
      }}
    >
      <UrrGroupWrap ref={requestBarRef} $token={themeToken} className={className} style={style}>
        {['api', 'sse'].includes(type) && <>
          <Select
            bordered={false}
            open={methodSelectOpen}
            onDropdownVisibleChange={(open) => {
              setMethodSelectOpen(open);
            }}
            className={slots[data?.method?.toLowerCase() || 'DEFAULT']}
            disabled={readOnly}
            value={data?.method || METHODS_MAP[type][0]}
            suffixIcon={<IconFont style={{ pointerEvents: 'none' }} type="icon-drop-down" />}
            size='small'
            placement="bottomLeft"
            popupArrow
            popupAnchor={requestBarRef}
            popupSideOffset={12}
            popupArrowStyle={{ left: 32 }}
            popupClassName={styles.methodPopup}
            placeholder='METHOD'
            dropdownStyle={{ width: 'max-content', minWidth: 0 }}
            showSearch={false}
            onChange={(value) => handleChange('method', value)}

          >
            {Array.from(new Set(METHODS_MAP[type].concat(customMethodList))).map((item: string) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
          <div className={slots.line}></div>
        </>
        }



        <div className={slots["url-group-container"]}>
          {includes(['sse', 'api','websocket2','socketio','graphql'], type) && !hideServer && isArray(currentEnv?.server_list) && (
            <Tooltip
              overlayInnerStyle={{ wordBreak: 'break-all' }}
              title={
                <>
                  {t('supplement.from_env')}“{currentEnv?.name}“{envUrl}
                  &nbsp;
                  <span
                    style={{ color: themeToken.colorPrimary, cursor: 'pointer' }}
                    onClick={() => openEnvPage({ env_id: currentEnv?.env_id })}
                  >
                    {t('supplement.go_edit')}
                  </span>
                </>
              }
            >
              <ConfigProvider
                theme={{
                  components: {
                    Select: {
                      selectorBg: 'transparent',
                      borderRadius: themeToken.borderRadius,
                      colorText: themeToken.fontLightColor,
                    },
                  },
                }}
              >
                {isArray(currentEnv?.server_list) && currentEnv?.server_list.some(i => (isString(i?.uri) && i?.uri.length > 0)) && <Select
                  bordered={false}
                  value={curServerId || defaultServerId}
                  labelRender={labelRender}
                  optionRender={optionRender}
                  options={serverOptions}
                  suffixIcon={
                    <IconFont
                      style={{ pointerEvents: 'none', color: themeToken.fontLightColor }}
                      type="icon-drop-down"
                    />
                  }
                  popupMatchSelectWidth={450}
                  className={[slots["right-select"], slots["right-select-http"], slots["env-desc"]].join(" ")}
                  onChange={(i)=>{
                    updateCurrentServerId(i);
                    SetCurServerId(i);
                  }}
                  size='small'
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Button style={{ color: 'var(--color-primary)', padding: '5px 2px' }} type="text" icon={<IconFont type='icon-add-line' />} onClick={addServer}>
                          Add Server
                        </Button>
                      </Space>
                    </>
                  )}
                />
                }

              </ConfigProvider>
            </Tooltip>
          )}
          {includes(['api', 'sse', 'grpc', 'websocket2', 'socketio'], type) ? (
            <VarInput
              placeholder={placeholder || t('common.enter_url_placeholder')}
              maxLength={maxLength}
              enableNewRow={false}
              envId={envId}
              value={data?.url || ''}
              onKeyDown={onKeyDown}
              onChange={(v) => {
                handleChange('url', v);
              }}
              readOnly={readOnly}
              pasteCurlChange={pasteCurlChange}
            />
          ) : (
            <Input
              maxLength={maxLength}
              className={slots["url-group-input"]}
              placeholder={placeholder || t('common.enter_url_placeholder')}
              readOnly={readOnly}
              onChange={(e) => handleChange('url', e?.target?.value || '')}
              value={data?.url || ''}
            />
          )}
        </div>

        {includes(['api'], type) && !hideProtocol && (
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  selectorBg: 'transparent',
                  borderRadius: themeToken.borderRadius,
                  colorText: themeToken.fontLightColor,
                },
              },
            }}
          >
            <Select
              bordered={false}
              value={data?.protocol || 'http/1.1'}
              suffixIcon={
                <IconFont
                  style={{ pointerEvents: 'none', color: themeToken.fontLightColor }}
                  type="icon-drop-down"
                />
              }
              popupMatchSelectWidth={false}
              className={[slots["right-select"], slots["right-select-http"]].join(" ")}
              onChange={handleChange.bind(null, 'protocol')}
              size='small'
            >
              {PROTOCOL_OPTIONS.map((item: { value: string; label: string }) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                  {item.value === 'http/2' && (
                    <Tooltip title={t('api.response_labels.http2_tip')}>
                      <IconFont style={{ marginLeft: 4 }} type="icon-wenhao" />
                    </Tooltip>
                  )}
                </Select.Option>
              ))}
            </Select>
          </ConfigProvider>
        )}
        {urlGroupExtraContent}
      </UrrGroupWrap>
    </ConfigProvider>
  );
};

export default UrlGroup;
