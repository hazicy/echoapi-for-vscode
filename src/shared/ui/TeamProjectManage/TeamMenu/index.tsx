import slots from "@/shared/ui/base/slots.module.css";
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { MenuProps } from '@/shared/ui/base';
import { Flex, Menu } from '@/shared/ui/base';

import { filter, isEmpty, map, size } from 'lodash';

import IconFont from '@/shared/ui/IconFont';
import { Modal } from '@/shared/ui/Modal';
import { MIGRATE_RESULT_STATUS } from '@/features/import/constants/migrate';
import useTheme from '@/shared/hooks/useTheme';
import { useApis, useGlobal, useUserConfig } from '@/app/store';
import { Project, TeamItem } from '@/features/auth/types';

import { MenuItemContainer, TeamMenuWrapper } from './style';
import { getTeamAndProjectByProjectId } from '@/features/project/events';

type MenuItem = Required<MenuProps>['items'][number];

type AntdTeamItem = {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

type TeamMenuProps = {
  searchValue: string;
  teamProjectList: TeamItem[];
  setIsOpen: (newOpen: boolean) => void;
  handleMenuChange?: (key: string) => void;
};

enum UP_STATUS_ENUM {
  project,
  team,
}

const TeamMenu = ({ searchValue, teamProjectList, setIsOpen, handleMenuChange }: TeamMenuProps) => {
  const { themeToken } = useTheme();
  const [, contextHolder] = Modal.useModal();

  const currentTeam = useUserConfig((state) => state.currentTeam);
  const currentProject = useUserConfig((state) => state.currentProject);
  const updateCurrentTeam = useUserConfig((state) => state.updateCurrentTeam);
  const updateCurrentProject = useUserConfig((state) => state.updateCurrentProject);
  const updateApiOriginDetailsList = useApis((store) => store.updateApiOriginDetailsList);
  const updateSwitchingProject = useGlobal((store) => store.updateSwitchingProject);
  const [teamProject, setTeamProject] = useState<TeamItem[]>([]);

  useEffect(() => {
    if (!searchValue) {
      setTeamProject(filter(teamProjectList, (t) => !isEmpty(t.project)));
    }

    const filterTeamProject = (): TeamItem[] => {
      return filter(
        map(teamProjectList, (team) => {
          return {
            ...team,
            project: filter(team.project, (project) => project.name.includes(searchValue)),
          };
        }),
        (t) => !isEmpty(t.project)
      );
    };

    setTeamProject(filterTeamProject);
  }, [searchValue, teamProjectList]);


  const menuItems = useMemo(() => {
    const renderProjectLabel = (project: Project) => {
      return (
        <MenuItemContainer>
          <Flex align="center" justify="space-between">
            <span className={slots["project-name"]}>{project.name}</span>
          </Flex>
        </MenuItemContainer>
      );
    };

    const getProject = (project: Project[]): AntdTeamItem[] => {
      return map(project, (item: Project) => {
        return {
          key: item.project_id,
          label: renderProjectLabel(item),
          disabled: item.upgrade_status !== MIGRATE_RESULT_STATUS.NORMAL,
        };
      });
    };

    return map(teamProject, (team: TeamItem) => {
      const disabled = isEmpty(team.project);

      return {
        key: team.team_id,
        disabled,
        label: (
          <Flex justify="space-between" className={slots.title} align="center">
            <Flex gap={12} align="center">
              <div className={slots.name}>{team.name}</div>
              {size(team.project) && <div className={slots.count}>{team.project?.length}</div>}
            </Flex>
          </Flex>
        ),
        expandIcon: ({ isOpen }: { isOpen: boolean }) => {
          return (
            <IconFont type="icon-arrow-down" style={{ marginRight: 8 }} rotate={isOpen ? 0 : -90} />
          );
        },
        icon: <IconFont type="icon-team" style={{ fontSize: themeToken.fontSize14 }} />,
        children: team.project && size(team.project) > 0 ? getProject(team.project) : null,
      };
    });
  }, [teamProject]);

  const onMenuChange = async (key: string) => {

    if (handleMenuChange) {
      handleMenuChange(key);
      // close team project list popup
      setIsOpen(false);
      return;
    }
    if (key === currentProject.project_id) {
      return;
    }

    const { team, project } =
      getTeamAndProjectByProjectId({ projectId: key, teamProjectList }) || {};
    if (team && project) {
      // clear API list
      updateApiOriginDetailsList([]);
      // switch to new project
      updateCurrentTeam(team);
      updateCurrentProject(project);
      // notify main program to execute project switch
      window?.vscode.postMessage({
        action: 'switchProject',
        data: {
          team,
          project,
          switchKey: key,
        }
      });
    
      // close team project list popup
      setIsOpen(false);

      // switch project state
      updateSwitchingProject(true);

    }
  };

  return (
    <>
      <TeamMenuWrapper>
        <Menu
          inlineIndent={12}
          selectedKeys={[currentProject.project_id]}
          defaultOpenKeys={[currentTeam.team_id]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => onMenuChange(key)}
        />
      </TeamMenuWrapper>
      {contextHolder}
    </>
  );
};

export default TeamMenu;
