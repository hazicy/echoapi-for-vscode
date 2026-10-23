import React from 'react';
import {  ApiDebugContainer } from './style';
import { useApis } from '@/app/store';
import { ApiDetailsData, ApisData } from '@/features/requests/types/api';
import ApiDebug from './api/Debug';
import SseDebug from './sse/Debug';
import Folder from './Folder';
import Websocket2Debug from './websocket2/Debug';
import SocketioDebug from './socketio/Debug';
import GraphqlDebug from './graphql/Debug';
import { APIS_TARGET_TYPE_ENUM } from '@/features/requests/constants';
import { Websocket2DetailsData } from '@/features/requests/types/websocket2';
import { SocketIoDetailsData } from '@/features/requests/types/socketio';
import { GraphQLDetailsData } from '@/features/requests/types/graphql';
import { useUpdateEffect } from 'ahooks';

interface ContentProps {
  value?: ApiDetailsData;
  curApiSendingData?: any
}

const Content: React.FC<ContentProps> = () => {
  const apisActiveData:Partial<ApisData> = useApis(store => store.apisActiveData);
  const updateApisActiveData = useApis(store => store.updateApisActiveData);

  const onApisDataChange = (newData:ApiDetailsData)=>{
    window?.vscode.postMessage({
      action: 'updateApiActiveData',
      data:newData
    });
    updateApisActiveData(newData);
  };

  const renderContainer = ()=>{
    if(apisActiveData.target_type === 'api'){
      return <ApiDebug apisData={apisActiveData as ApiDetailsData} onApisDataChange={onApisDataChange} />
    }
    if(apisActiveData.target_type === 'sse'){
      return <SseDebug apisData={apisActiveData as ApiDetailsData} onApisDataChange={onApisDataChange}/>
    }
    if(apisActiveData.target_type === APIS_TARGET_TYPE_ENUM.FOLDER){
      return <Folder apisData={apisActiveData as ApiDetailsData} onApisDataChange={onApisDataChange}/>
    }
    if(apisActiveData.target_type === 'websocket2'){
      return <Websocket2Debug apisData={apisActiveData as Websocket2DetailsData} onApisDataChange={(val)=>{
        onApisDataChange(val as unknown as ApiDetailsData);
      }}/>;
    }
    if(apisActiveData.target_type === 'socketio'){
      return <SocketioDebug apisData={apisActiveData as SocketIoDetailsData} onApisDataChange={(val)=>{
        onApisDataChange(val as unknown as ApiDetailsData);
      }}/>;
    }
    if(apisActiveData.target_type === 'graphql'){
      return <GraphqlDebug apisData={apisActiveData as GraphQLDetailsData} onApisDataChange={(val)=>{
        onApisDataChange(val as unknown as ApiDetailsData);
      }}/>
    }
    return <></>;
  }

  return (
    <>
      {<ApiDebugContainer vertical>
        {renderContainer()}
      </ApiDebugContainer>}
    </>
  );
};

export default Content;