import { defineConfig } from 'tsup';
import { loadEnv } from 'vite';
import path from 'node:path';

export default defineConfig(options => {
  const production = !options.watch && options.minify === true;
  const env = loadEnv(production ? 'production' : 'development', process.cwd(), 'ECHOAPI_');
  const language = env.ECHOAPI_LANGUAGE || 'auto';
  if (!['auto', 'en', 'zh-cn'].includes(language)) {
    throw new Error('ECHOAPI_LANGUAGE must be auto, en, or zh-cn.');
  }
  return {
    entry: { extension: 'src/extension.ts' },
    outDir: 'dist',
    outExtension: () => ({ js: '.js' }),
    format: ['cjs'],
    platform: 'node',
    target: 'node16',
    external: ['vscode'],
    noExternal: [/^(?!vscode$)/],
    splitting: false,
    clean: false,
    publicDir: 'public',
    sourcemap: !production,
    define: {
      __ECHOAPI_LANGUAGE__: JSON.stringify(language),
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      'process.env.ECHOAPI_DEV_SERVER': JSON.stringify(options.env?.ECHOAPI_DEV_SERVER || 'false'),
    },
    esbuildOptions(build) {
      build.mainFields = ['main', 'module'];
      build.drop = production ? ['console', 'debugger'] : [];
      build.alias = {
        '@': path.resolve('src'),
        '@/locale/runtime': path.resolve('src/locale/runtime.extension.ts'),
        'jsonc-parser': path.resolve('node_modules/jsonc-parser/lib/esm/main.js'),
      };
    },
  };
});
