import { getPopupContainer } from '@/utils/popupContainer';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider, Skeleton } from '@/components/ui/base';
import useGlobalTheme from '@/theme';
import antdLocale from '@/locale/antd';
import ErrorBoundary from '@/components/business/ErrorBoundary';

import '@/assets/css/reset.css';

import '@/locale';
import Environment from '@/pages/Environment';
import { ThemeProvider } from '@/components/ui/base/theme';
import GlobalThemeStyle from '../theme/global';
import GlobalStyle from '../theme/globalStyle';
import { useSystemConfig, useProjectConfig, useGlobal } from '../store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useEnv from '@/hooks/useEnv';

function EnvironmentPanel() {
  const customTheme = useGlobalTheme();

  const systemConfig = useSystemConfig((state) => state.systemConfig);
  const updateSystemConfig = useSystemConfig((state) => state.updateSystemConfig);
  const updateProjectConfig = useProjectConfig((state) => state.updateProjectConfig);
  const updateVscodeTheme = useGlobal(store => store.updateVscodeTheme);
  const updateEstablish = useProjectConfig((state) => state.updateEstablish);
  const updateEnvSettingKeys = useProjectConfig((state) => state.updateEnvSettingKeys);

  const [lodaing, setLodaing] = useState(true);
  const [environmentKey,setEnvironmentKey] = useState(1);
  const { handleProxyFetchResult }  = useEnv();

  useEffect(() => {
    // Get project information
    window?.vscode.postMessage({
      action: 'getProjectConfig',
    });

    window?.vscode.postMessage({
      action: 'getSystemConfig',
    });

    window?.vscode.postMessage({
      action: 'getVscodeTheme',
    });
  }, []);

  useEffect(() => {
    const messageHandler = async (event: { data: any; }) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.action) {
        case 'setProjectConfig':
          updateProjectConfig({ ...message.data });
          setLodaing(false);
          break;
        case 'setSystemConfig':
          updateSystemConfig({ ...systemConfig, ...message.data });
          break;
        case 'setVscodeTheme':
          updateVscodeTheme(message.data);
          break;
        case 'initCreateEnv':
          updateEstablish(true);
          break;
        case 'setEnvSettingKeys':
          updateEnvSettingKeys(message.data);
          setEnvironmentKey((lastState)=>{
            return lastState ? 0 : 1;
          });
          break;
        case 'proxyFetchResult':
          handleProxyFetchResult(message.data);
        break;
      }
    }
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  return (
    <ConfigProvider
      getPopupContainer={getPopupContainer}
      prefixCls={'beautify'}
      // theme={{ ...customTheme, cssVar: true }}
      theme={{
        token: customTheme.token,
        components: customTheme.components,
      }}
      locale={antdLocale}
    >
      <AntdApp>
        <ThemeProvider theme={customTheme}>
          <GlobalThemeStyle />
          <GlobalStyle />
          <ErrorBoundary>
          <DndProvider backend={HTML5Backend}>
            <Skeleton active paragraph={{ rows: 15, width: '100%' }} loading={lodaing}>
                <Environment key={environmentKey} open={true} />
            </Skeleton>
            </DndProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<EnvironmentPanel />);
