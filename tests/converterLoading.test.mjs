import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

// Loading the import/export UI must not initialize a converter or its Mock graph.
const calls = [];
globalThis.__converterCalls = calls;
const result = await build({
  entryPoints: ['src/features/export/utils/export.ts'],
  bundle: true, write: false, platform: 'node', format: 'esm',
  plugins: [{
    name: 'converter-boundary',
    setup(builder) {
      builder.onResolve({ filter: /^echoapi-converter$/ }, () => ({ path: 'converter', namespace: 'test' }));
      builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
        contents: `globalThis.__converterCalls.push('load');
          class Converter {
            constructor() { globalThis.__converterCalls.push('construct'); }
            convert(data) { return { status: 'success', data }; }
            apiToswagger(data) { return this.convert(data); }
          }
          export { Converter as ApiToSwagger, Converter as ApipostToPostman,
            Converter as PostmanToApipost, Converter as SwaggerToApipost, Converter as ThunderToApipost };`,
      }));
    },
  }],
});
const api = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));

test('converters initialize only when requested and concurrent calls share one module load', async () => {
  try {
    assert.deepEqual(calls, []);
    const input = { requests: [] };
    const results = await Promise.all([
      api.exportMethod.apiToSwagger(input, '3.0'),
      api.exportMethod.apiToPostman(input),
      api.importMethod.thunderToApipost(input, ''),
      api.importMethod.swaggerToApipost(input, null),
    ]);
    assert.equal(calls.filter(item => item === 'load').length, 1);
    assert.equal(calls.filter(item => item === 'construct').length, 4);
    for (const result of results) assert.deepEqual(result, { status: 'success', data: input });
  } finally {
    delete globalThis.__converterCalls;
  }
});
