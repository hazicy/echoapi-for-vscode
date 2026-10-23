import slots from "@/components/ui/base/slots.module.css";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Input, Space } from '@/components/ui/base';

import { useThrottle } from 'ahooks';

import IconFont from '@/components/ui/IconFont';
import Popover from '@/components/ui/Popover';
import useTheme from '@/hooks/useTheme';
import { useUserConfig } from '@/store';

import TeamMenu from './TeamMenu';

import { ProjectContainer, TeamWrapper } from './style';
import { DEFAULT_TEAM_PROJECT } from '@/constants/project';
import { Project, TeamItem } from '@/types/user';

const TeamProjectManage = (props: { currentTeam: TeamItem; currentProject: Project; onProjectChange?: any, from?: string }) => {
  const { currentTeam, currentProject, from, onProjectChange } = props;
  const { themeToken } = useTheme();
  const { t } = useTranslation();
  const teamProjectList = useUserConfig(store => store.teamProjectList);

  const [isOpen, setIsOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const throttledSearchValue = useThrottle(searchValue, { wait: 300 });

  const onSearchProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
  };

  const renderPopoverContent = () => {
    return (
      <ProjectContainer>
        <Flex vertical gap={12} style={{ width: '100%' }}>
          <div className={slots.header}>
            <Flex justify="space-between" align="center">
              <div className={slots["header-left"]}>{t('header.switch.team_project')}</div>
              <div className={slots["header-right"]}>

              </div>
            </Flex>
          </div>
          <div className={slots.search}>
            <Input
              className={slots["search-input-wrap"]}
              style={{ height: 32 }}
              value={searchValue}
              onChange={onSearchProject}
              prefix={
                <IconFont type="icon-search-line" style={{ fontSize: themeToken.fontSize14 }} />
              }
              placeholder={t('header.switch.search')}
            />
          </div>

          <TeamMenu
            searchValue={throttledSearchValue}
            teamProjectList={from !== 'push' ? [{ ...DEFAULT_TEAM_PROJECT }, ...teamProjectList] : teamProjectList}
            setIsOpen={setIsOpen}
            handleMenuChange={onProjectChange}
          />


        </Flex>
      </ProjectContainer>
    );
  };

  return (
    <TeamWrapper>
      <Space className={slots["team-project-manage-space"]}>
        <Popover
          open={isOpen}
          placement="bottomLeft"
          content={renderPopoverContent}
          overlayInnerStyle={{ padding: '16px 0' }}
          onOpenChange={handleOpenChange}
          trigger="click"
          overlayClassName={slots["team-project-manage-popover"]}
        >
          <>
            <Flex justify='space-between'>
              <Space>
                {currentProject?.name ?
                  <>
                    <div className={slots["team-name"]}>{currentTeam?.name || t('supplement.no_team')} </div>
                    <span style={{ color: themeToken.fontLightColor }}>/</span>
                    <div className={slots["project-name"]}>
                      {currentProject?.name || t('supplement.no_project')}
                    </div>
                  </>
                  :
                  <>
                    <div className={slots["no-select-project"]}>{t('common.select_tip')}</div>
                  </>
                }
              </Space>
              <div className={slots["project-icon"]}>
                      <IconFont
                        type="icon-arrow-down"
                        style={{ color: themeToken.iconColor, fontSize: themeToken.fontSize }}
                      ></IconFont>
              </div>
            </Flex>
          </>
        </Popover>
      </Space>

    </TeamWrapper>
  );
};

export default TeamProjectManage;
