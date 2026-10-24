const load = require('./loadTypeScript.cjs');
module.exports = (filename = 'src/features/export/utils/exportutils/apiToSwagger.ts') => {
  let nextId = 0;
  const defaults = { example: [{ example_id: '1', name: 'Success' }, { example_id: '2', name: 'Error' }], is_check_result: 1 };
  return load(filename, (id) => {
    if (id === 'lodash') return require(id);
    if (id === 'i18next') return { t: key => key };
    if (id === 'apipost-tools') return { snowflakeId: () => `id-${++nextId}` };
    if (id === '@/features/requests/constants/auth') return { DEFAULT_AUTH: { type: 'noauth' } };
    if (id === '@/features/requests/constants/response') return { DEFAULT_API_RESPONSE: defaults, ERROR_RESPONSE: { example_id: '2', name: 'Error' }, SUCCESS_RESPONSE: { example_id: '1', name: 'Success' } };
    if (id === '@/shared/utils/common') return { getSubstring: (text, length) => typeof text === 'string' ? text.slice(0, length) : '' };
    if (id === '@/features/requests/utils/apis') return { genUrlByQuery: url => url };
    throw new Error(`Unexpected dependency ${id}`);
  });
};
