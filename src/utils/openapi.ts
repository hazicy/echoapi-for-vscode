import { DEBUG_REQUEST_BODY_MODE_ENUM, OPENAPI_REQUEST_BODY_MODE_ENUM } from '@/constants/apis';
import { CONTENT_TYPES } from '@/constants/common';
import { ApiDetailsData, echoapiResult, OpenApiData, openapiResult } from '@/types/apis/api';
import { ApisBaseDataItem, TypeFiledType } from '@/types/apis/base';
import { RequestBodyContentType } from '@/types/apis/request';
import { snowflakeId } from 'apipost-tools';
import { forEach, isArray, isEmpty, isPlainObject, isString, toLower, upperCase } from 'lodash';
import { capitalizeFirstLetter } from './apis';
import { parseModelToJsonSchema } from '@/utils/dataModel';
import { areKeysOneToOne, EditFormat, isJSON } from '@/utils/common';
import { useProjectSetting } from '@/store';
import { JSONSchemaType } from '@/types/jsonSchema';
import Type from 'type-of-is';
import { AnyObject } from '@/types/common';

const getProxyMockRulesList = () => {
  const { mockInfo, mockList, mockInnerList } = useProjectSetting.getState();
  const mockConfig = mockInfo || {};
  const mock_rule_switch = mockConfig?.mock_rule_switch === 1 ? 1 : -1;

  let result = mockList;
  if (mock_rule_switch === 1) {
    result = result.concat(mockInnerList);
  }

  return result?.map((e) => ({
    ...e,
    type: e?.field_type,
    mock: e?.mock_rule_content,
  }));
};

export const handleAutoGeneration = async (json: any) => {
  try {
    const { default: MockSchema } = await import('apipost-mock-schema');
    const jsonSchema = await parseModelToJsonSchema(
      json?.schema || {},
      [],
      {}
    );
    const mockRules = getProxyMockRulesList();
    // 7.2.3 default required field related bug fix
    const mockDataRequired: any = {};

    if (isPlainObject(jsonSchema)) {
      const mockSchema = new (MockSchema as any)({ app: 'echoapi' });
      await mockSchema.mock(jsonSchema, mockRules);
      const mockList = mockSchema.getMockDataList();

      if (isArray(mockList)) {
        mockList.forEach((item) => {
          if (isArray(item?.path)) {
            const descKey = item.path.filter((item: any) => !/^[0-9]$/.test(item)).join('.');
            if (!isEmpty(descKey)) {
              mockDataRequired[descKey] = item.is_required;
            }
          }
        });
      }
    }
    let jsonExample = '';
    const mockSchema = new (MockSchema as any)({ app: 'echoapi' });
    jsonExample = await mockSchema.mock(jsonSchema || {}, mockRules);

    jsonExample = JSON.stringify(jsonExample);

    const formatValue = EditFormat(jsonExample || '').value;
    const raw = !formatValue || formatValue === '{}' ? '' : formatValue;

    return raw;
  } catch (err) {

    return '';
  }
};

export const tryMock = async (val: string) => {
  try {
    const { default: mockModule } = await import('mockjs5-pro');
    const { Mockjs } = mockModule;
    let replaceStr = val.replace(/\$/g, '@');
    let mockStr = Mockjs.mock(replaceStr);
    if (mockStr !== replaceStr) {
      return mockStr;
    }
  } catch (error) { }
  return val;
};

async function createEmptyObject(obj:any) {
  const result:any = {};
  
  for (const key in obj.properties) {
    if (obj.properties.hasOwnProperty(key)) {
      const property = obj.properties[key];
      
      if (property.type === "string") {
        result[key] = property?.mock?.mock ? await tryMock(property?.mock?.mock) : property?.example || property?.default || '';
      } else if (property.type === "object") {
        result[key] = await createEmptyObject(property); // recursive call
      }
    }
  }
  
  return result;
}

const MEDIA_TYPE: any = {
  'form-data': 'multipart/form-data',
  urlencoded: 'application/x-www-form-urlencoded',
  json: 'application/json',
  xml: 'application/xml',
  javascript: 'application/javascript',
  plain: 'text/plain',
  html: 'text/html',
};
export const handleEchoApiToOpenApi = (apisData: ApiDetailsData): openapiResult => {
  let result: openapiResult = {
    parameters: [],
    requestBodyContent: {},
    responses:{},
    method: 'get',
    url: ''
  };
  if (isString(apisData?.url)) {
    result.url = apisData.url;
  }
  if (isString(apisData?.method)) {
    result.method = toLower(apisData.method);
  }

  if (isArray(apisData?.request?.header?.parameter)) {
    forEach(apisData.request.header.parameter, (i) => {
      result.parameters.push({
        name: i?.key || '',
        in: 'header',
        description: i?.description || '',
        required: i?.not_null === 1,
        example: i?.value || '',
        schema: {
          type: i?.field_type as JSONSchemaType || 'string'
        }
      });
    });
  }

  if (isArray(apisData?.request?.query?.parameter)) {
    forEach(apisData.request.query.parameter, (i) => {
      result.parameters.push({
        name: i?.key || '',
        in: 'query',
        description: i?.description || '',
        required: i?.not_null === 1,
        example: i?.value || '',
        schema: {
          type: i?.field_type as JSONSchemaType || 'string'
        }
      });
    });
  }

  if (isArray(apisData?.request?.restful?.parameter)) {
    forEach(apisData.request.restful.parameter, (i) => {
      result.parameters.push({
        name: i?.key || '',
        in: 'path',
        description: i?.description || '',
        required: i?.not_null === 1,
        example: i?.value || '',
        schema: {
          type: i?.field_type as JSONSchemaType || 'string'
        }
      });
    });
  }

  if (isArray(apisData?.request?.cookie?.parameter)) {
    forEach(apisData.request.cookie.parameter, (i) => {
      result.parameters.push({
        name: i?.key || '',
        in: 'cookie',
        description: i?.description || '',
        required: i?.not_null === 1,
        example: i?.value || '',
        schema: {
          type: i?.field_type as JSONSchemaType || 'string'
        }
      });
    });
  }
  let bodyMode = apisData?.request?.body?.mode as RequestBodyContentType;
  const bodyModeType = CONTENT_TYPES?.[bodyMode];
  if (bodyModeType && bodyModeType !== 'none') {
    // form-data/urlencoded
    if ([OPENAPI_REQUEST_BODY_MODE_ENUM.FORM_DATA, OPENAPI_REQUEST_BODY_MODE_ENUM.URLENCODED].includes(bodyModeType as OPENAPI_REQUEST_BODY_MODE_ENUM)) {
      result.requestBodyContent[bodyModeType] = {
        schema: {
          type: 'object',
          properties: (apisData?.request?.body?.parameter || []).reduce((pre: any, cur) => {
            if (isString(cur?.key) && cur.key.length > 0 && cur?.is_checked === 1) {
              pre[cur.key] = {
                type: toLower(cur?.field_type || 'string'),
                description: cur?.description || '',
                mock: {
                  mock: cur?.value || ''
                },
                example: cur?.value || '',
              };
            }
            return pre;
          }, {})
        }
      }
      // binary data
    } else if (OPENAPI_REQUEST_BODY_MODE_ENUM.BINARY === bodyModeType) {
      result.requestBodyContent[bodyModeType] = {
        schema: {
          type: 'string',
          properties: {},
          format: 'binary',
          example: {
            fileName: apisData?.request?.body?.binary?.file_name || '',
            file: apisData?.request?.body?.binary?.data_url || ''
          }
        }
      }
      // raw data
    } else {
      result.requestBodyContent[bodyModeType] = {
        schema: {
          type: 'object'
        },
        example: apisData?.request?.body?.raw || '',
      }
      try {
        if (isJSON(apisData?.request?.body?.raw || '')) {
          let rawObj = JSON.parse(apisData?.request?.body?.raw || '');
          let schema = transformObject(rawObj);
          result.requestBodyContent[bodyModeType].schema = schema;
        }
      } catch (error) {
      }
    }
  }
  
  if(isArray(apisData?.response?.example)){
    forEach(apisData?.response?.example,(i)=>{
      if(i?.expect?.code){
        result.responses[i?.expect?.code] ={
          description:i?.expect?.name || "",
          content:{
            [MEDIA_TYPE?.[i?.expect?.content_type] || '']:{
              example:i?.raw || '',
              schema:i?.expect?.schema || {}
            }
          }
        };
      }
    });
  }

  return result;
}

export const transformObject = (obj: AnyObject) => {
  const result: any = { type: Type.string(obj).toLowerCase(), properties: {} };

  if (result.type === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result.properties[key] = transformObject(obj[key]);
      }
    }
  } else if (result.type === 'array' && obj.length > 0) {
    result.items = transformObject(obj[0]);
  } else if (result.type === 'integer' || result.type === 'string' || result.type === 'boolean' || result.type === 'number') {
    result.example = obj;
    result.mock = { mock: String(obj) };
  }

  return result;
}
