import TeamProjectManage from '@/components/ui/TeamProjectManage';
import { useUserConfig } from '@/store';
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
