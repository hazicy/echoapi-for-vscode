/* eslint-disable quotes */
import slots from "@/components/ui/base/slots.module.css";
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { message } from '@/components/ui/base';

import classNames from 'classnames';
import { isObject, isUndefined, omit } from 'lodash';

import { Tooltip } from '@/components/ui';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import CustomPopover from '@/components/ui/Popover';
import useTheme from '@/hooks/useTheme';
import { copyStringToClipboard } from '@/utils/common';

import context from './context';
import ErrorTag from './errorTag';
import FixedTag from './fixedTag';

import { ContainerWrap } from './style';

const EnvTag = (props: { decoratedText: string; children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const { decoratedText } = props;
  const targetRef = useRef(null);

  const { envVars, globalVars, varClick } = React.useContext(context);
  const varName = `${decoratedText}`.replace(/^\{\{|\}\}$/g, '')?.split('|')?.[0];

  const envInfo = envVars?.[varName];
  const globalInfo = globalVars?.[varName];

  const calcValue = (value: unknown) => {
    if (isObject(value)) {
      return JSON.stringify(value);
    }

    return `${value}`;
  };

  if (varName.startsWith("'") && varName.endsWith("'")) {
    return (
      <FixedTag prop={omit(props, 'children')} text={varName}>
        {props.children}
      </FixedTag>
    );
  }

  if (isUndefined(envInfo) && isUndefined(globalInfo)) {
    return <ErrorTag>{props.children}</ErrorTag>;
  }

  const both = !isUndefined(envInfo) && !isUndefined(globalInfo);

  const tipsElement = (
    <ContainerWrap $token={themeToken}>
      {!isUndefined(envInfo) && (
        <>
          <div className={slots["item-title"]}>
            <div className={slots["pop-var-icon"]}>
              <IconFont type="icon-label-environment" />
            </div>
            <div className={[slots["pop-var-title"], slots.green].join(" ")}>
              <Tooltip title={varName}>{varName}</Tooltip>
            </div>
          </div>
          <div className={slots["item-var"]}>{t('global_setting.variables_table.cloud_value')}</div>
          <div className={slots["item-content"]}>
            <div className={slots["var-value"]}>{calcValue(envInfo?.value)}</div>
            <div
              className={slots["btn-copy"]}
              onClick={() =>
                copyStringToClipboard(calcValue(envInfo?.value) || '', () => {
                  message.success(t('supplement.copy_success'));
                })
              }
            >
              <IconFont type="icon-copy" />
            </div>
          </div>
          <div className={slots["item-var"]}>{t('global_setting.variables_table.local_value')}</div>
          <div className={slots["item-content"]}>
            <div className={slots["var-value"]}>{calcValue(envInfo?.current_value)}</div>

            <div
              className={slots["btn-copy"]}
              onClick={() =>
                copyStringToClipboard(calcValue(envInfo?.current_value) || '', () => {
                  message.success(t('supplement.copy_success'));
                })
              }
            >
              <IconFont type="icon-copy" />
            </div>
          </div>
          <div className={slots["item-var"]}>{t('supplement.scope')}</div>
          <div className={slots["item-desc"]}>{t('supplement.env_var')}</div>
          {!both && (
            <div className={slots["item-edit"]}>
              <Button
                size="small"
                type="primary"
                onClick={() => varClick(props, targetRef.current, varName)}
              >
                {t('supplement.edit')}
              </Button>
            </div>
          )}
        </>
      )}
      {!isUndefined(globalInfo) && (
        <>
          <div className={classNames(slots["item-title"], both && slots.margin)}>
            <div className={slots["pop-var-icon"]}>
              <IconFont type="icon-label-global-var" />
            </div>
            <div className={[slots["pop-var-title"], slots.global].join(" ")}>
              <Tooltip title={varName}>{varName}</Tooltip>
            </div>
          </div>
          <div className={slots["item-var"]}>{t('global_setting.variables_table.cloud_value')}</div>
          <div className={slots["item-content"]}>
            <div className={slots["var-value"]}>{calcValue(globalInfo?.value)}</div>
            <div
              className={slots["btn-copy"]}
              onClick={() =>
                copyStringToClipboard(calcValue(globalInfo?.value) || '', () => {
                  message.success(t('supplement.copy_success'));
                })
              }
            >
              <IconFont type="icon-copy" />
            </div>
          </div>
          <div className={slots["item-var"]}>{t('global_setting.variables_table.local_value')}</div>
          <div className={slots["item-content"]}>
            <div className={slots["var-value"]}>{calcValue(globalInfo?.current_value)}</div>

            <div
              className={slots["btn-copy"]}
              onClick={() =>
                copyStringToClipboard(calcValue(globalInfo?.current_value) || '', () => {
                  message.success(t('supplement.copy_success'));
                })
              }
            >
              <IconFont type="icon-copy" />
            </div>
          </div>
          <div className={slots["item-var"]}>{t('supplement.scope')}</div>
          <div className={slots["item-desc"]}>{t('supplement.global')}</div>
          <div className={slots["item-edit"]}>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                varClick(props, targetRef.current, varName);
              }}
            >
              {t('supplement.edit')}
            </Button>
          </div>
        </>
      )}
    </ContainerWrap>
  );

  return (
    <>
      <CustomPopover placement="bottomLeft" content={tipsElement}>
        <span
          ref={targetRef}
          className={classNames(slots["tag-env"], !isUndefined(globalInfo) && !both && slots.global)}
        >
          {props.children}
        </span>
      </CustomPopover>
    </>
  );
};

export default EnvTag;
