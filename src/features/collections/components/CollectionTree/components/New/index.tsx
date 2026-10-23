import slots from "@/shared/ui/base/slots.module.css";
import { IconFont } from '@/shared/ui';
import { Dropdown, MenuProps } from '@/shared/ui/base';
import i18next from 'i18next';
import { find } from 'lodash';
import { NewBtnsContainer } from './style';
import React from 'react';

type NewProps = {
  createMenus?: MenuProps['items'];
}

 const NewBtns=({createMenus}:NewProps)=> {
  return (
    <NewBtnsContainer>
        <Dropdown.Button
          getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          menu={{ items: createMenus }}
          placement="bottomRight"
          trigger={['click']}
          type="default"
          size='small'
          className={slots["beautify-new-http-more"]}
          title={i18next.t('common.folder_operate.new_http_request')}
          aria-label={i18next.t('common.folder_operate.new_http_request')}
          icon={<IconFont type="icon-drop-down" />}
          onClick={() => {
            const apiMenu = find(createMenus,(im)=>im?.key === 'api');
            apiMenu && (apiMenu as any)?.onClick({ key:'api' });
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M10 4v12M4 10h12" />
          </svg>
          <span>{i18next.t('common.folder_operate.new_short')}</span>
        </Dropdown.Button>
      </NewBtnsContainer>
  )
};

export default NewBtns;
