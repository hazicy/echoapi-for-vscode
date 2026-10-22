import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@/locale';
import AiDescription from '@/components/business/AiDescription';
import useProjectSetting from '@/store/useProjectSetting';
import useUserConfig from '@/store/useUserConfig';
import DrawerFixture from './DrawerFixture';

useProjectSetting.setState({
  descriptionList: [
    { id: 'custom', project_id: 'test', key: ' name ', description: 'Custom name' },
    { id: 'other', project_id: 'test', key: 'age', description: 'Custom age' },
    { id: 'invalid', project_id: 'test', key: '', description: 'Invalid entry' },
  ],
  innerDescriptionList: [
    { id: 'builtin', project_id: 'test', key: 'name', description: 'Built-in name' },
  ],
});

function Fixture() {
  const [filterKey, setFilterKey] = useState('');
  const [value, setValue] = useState('');
  const includeBuiltIn = useUserConfig(state => state.currentProject.is_describe_library === 1);
  return (
    <main>
      <label>Filter key<input value={filterKey} onChange={event => setFilterKey(event.target.value)} /></label>
      <button onClick={() => useUserConfig.setState(state => ({
        currentProject: { ...state.currentProject, is_describe_library: includeBuiltIn ? -1 : 1 },
      }))}>Toggle built-in descriptions</button>
      <AiDescription filterKey={filterKey} onChange={setValue} />
      <output aria-label="Selected description">{value}</output>
      <button>Outside</button>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  new URLSearchParams(location.search).has('drawer') ? <DrawerFixture /> : <Fixture />
);
