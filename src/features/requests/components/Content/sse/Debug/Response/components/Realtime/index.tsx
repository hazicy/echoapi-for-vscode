import slots from "@/shared/ui/base/slots.module.css";
import { moduleClassNames } from "@/shared/ui/base/moduleClassNames";
import { FC, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useSafeState } from 'ahooks';
import aptTools from 'apipost-tools';
import cn from 'classnames';
import i18next from 'i18next';
import { isArray, isEmpty, isEqual, isObject, isString, size } from 'lodash';

import { ResizablePanels } from '@/shared/components';
import FlowResponse from '@/features/requests/components/FlowResponse';
import ResponseResult from '@/features/requests/components/ResponseResult';

import ResponseEmpty from '@/features/requests/components/Response/components/Empty';
import ResponseRealtimeContext from '@/features/requests/components/Response/components/Realtime/context';
import { ApiSendingDataSSE, ApiStreamResponseSSEItem } from '@/features/requests/types/send';
import { DirectionType } from '@/shared/types/common';
import { TIME_FORMAT, formatTime } from '@/shared/utils/time';

import { FlowResponseRenderTitleWrap, PanelsWrap, RealtimeContainer } from './style';
import { Flex, Tooltip } from '@/shared/ui/base';

const panelProps = {
  defaultSize: 50,
  minSize: 4,
  collapsible: true,
  collapsedSize: 4,
};

const mapTips: { [x: string]: string } = {
  connect: i18next.t('grpc.grpc_debug.sent') + ':',
  // message: i18next.t('grpc.grpc_debug.received') + ':',
  complete: i18next.t('grpc.grpc_debug.completed') + ':',
  disconnect: i18next.t('grpc.grpc_debug.cancelled') + ':',
};

interface Props {
  sendingDataSSE: Partial<ApiSendingDataSSE>;
}

const Realtime: FC<Props> = ({ sendingDataSSE }) => {
  const { t } = useTranslation();

  const { direction } = useContext(ResponseRealtimeContext);

  const [curDirection, setCurDirection] = useSafeState<DirectionType>('horizontal');
  const [responseItem, setResponseItem] = useSafeState<ApiStreamResponseSSEItem>();

  useEffect(() => {
    if (!direction) return;

    if (direction === 'vertical') {
      setCurDirection('horizontal');
    }

    if (direction === 'horizontal') {
      setCurDirection('vertical');
    }
  }, [direction]);

  const isJSONString = (str: string): boolean => {
    try {
      const parsed = JSON.parse(str);
      return isObject(parsed) && !isArray(parsed);
    } catch (err) {
      return false;
    }
  };

  /**
   *
   * @param params Each item returned by SSE
   * @param parseToJsonStr DOM displays plain strings, CodeEditor displays JSON strings
   * @returns string | JSON string
   */
  const calcContent = (params?: ApiStreamResponseSSEItem, parseToJsonStr = false) => {
    try {
      const { action, data } = params || {};
      if (action === 'message') {
        
        if (!isString(data) && data?.stream?.type && data?.stream?.data) {
          
          const bufferRaw = aptTools.bufferToRaw(data?.stream?.data, {});
          
          const { raw } = bufferRaw;
          const result = parseSingleSSEMessage(raw);
         let eventData = result.data;
          if (isJSONString(result.data)) {
            eventData = result.data;
          }
          if (parseToJsonStr) {
            eventData = JSON.stringify(result.data);
          }
          
          if(isString(result.event) && !isEmpty(result?.event)){
            return (<Flex gap={4} align='center'>
              <Tooltip title={result.event}>
              <span className={moduleClassNames(slots, `event-message ${result.event}`)}>{result.event.slice(0,10)}</span>
              </Tooltip>
         
              {eventData}
            </Flex>);
          }else{
            return eventData;
          }
        }
        return parseToJsonStr ? JSON.stringify(data) : String(data);
      }

      return parseToJsonStr ? JSON.stringify(data) : String(data);
    } catch (err) {
      return '';
    }
  };

  const parseSingleSSEMessage = (sseMessage: string) => {
    try {
      const lines = sseMessage.split('\n');
      const result = {
        event: '',
        data: '',
        id: '',
      };

      lines.forEach((line) => {
        if (line.startsWith('event:')) {
          result.event = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          if (result.data) {
            result.data += `\n${line.slice(5).trim()}`;
          } else {
            result.data = line.slice(5).trim();
          }
        } else if (line.startsWith('id:')) {
          result.id = line.slice(3).trim();
        }
      });

      return result;
    } catch (err) {
      return {
        event: '',
        data: sseMessage,
        id: '',
      };
    }
  };

  const resultRaw = useMemo(() => calcContent(responseItem, true), [responseItem]);

  const customTipsContent = (data: ApiStreamResponseSSEItem) => {
    if (isString(data.data)) return {};

    return {
      size: data?.data?.size,
      time: formatTime(data?.data?.time, TIME_FORMAT.TIME_L),
    };
  };

  const renderTitle = (data: ApiStreamResponseSSEItem) => {
    const { action } = data || {};

    if (['message', 'complete', 'connect', 'disconnect', 'sse'].includes(action)) {
      return (
        <FlowResponseRenderTitleWrap className={cn({ [slots.complete]: isEqual(action, 'complete') })}>
          {mapTips[action]}
          {calcContent(data)}
        </FlowResponseRenderTitleWrap>
      );
    }

    return null;
  };

  return (
    <RealtimeContainer>
      {(size(sendingDataSSE?.streamResponse) > 0 && (
        <ResizablePanels
          showRightCollapseBtn
          panelGroupProps={{ direction: curDirection }}
          leftPanelProps={{
            ...panelProps,
            collapseTitle: t('common.response_component.title'),
          }}
          leftPanel={
            <PanelsWrap>
              <FlowResponse
                data={sendingDataSSE?.streamResponse}
                renderTitle={renderTitle}
                customTipsContent={customTipsContent}
                onItemClick={(item: ApiStreamResponseSSEItem) => {
                  setResponseItem(item);
                }}
              />
            </PanelsWrap>
          }
          rightPanelProps={{
            ...panelProps,
            collapseTitle: t('supplement.response'),
          }}
          rightPanel={
            <PanelsWrap>
              <ResponseResult isSSE resultIncludesTabs={['beautify', 'native']} rawHtml={resultRaw} />
            </PanelsWrap>
          }
        />
      )) || <ResponseEmpty />}
    </RealtimeContainer>
  );
};

export default Realtime;
