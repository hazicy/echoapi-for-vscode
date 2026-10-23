import TeamProjectManage from '@/shared/ui/TeamProjectManage';
import { useUserConfig } from '@/app/store';
import { TreeMenuHeaderWarp } from './style';

const TreeMenuHeader = () => {
  const currentProject = useUserConfig(store => store.currentProject);
  const currentTeam = useUserConfig(store => store.currentTeam);
  return (
    <TreeMenuHeaderWarp>
      <TeamProjectManage currentProject={currentProject} currentTeam={currentTeam} />
    </TreeMenuHeaderWarp>
  );
};

export default TreeMenuHeader;
