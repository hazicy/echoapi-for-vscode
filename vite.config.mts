import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const panels = ['sidePanel', 'tagPanel', 'environmentPanel', 'pushPanel',
  'importDataPanel', 'folderTestPanel', 'folderTestReportPanel', 'shareListPanel', 'exportDataPanel'];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'ECHOAPI_');
  const language = env.ECHOAPI_LANGUAGE || 'auto';
  if (!['auto', 'en', 'zh-cn'].includes(language)) {
    throw new Error('ECHOAPI_LANGUAGE must be auto, en, or zh-cn.');
  }
  return {
    base: './',
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    define: { __ECHOAPI_LANGUAGE__: JSON.stringify(language) },
    esbuild: { drop: mode === 'production' ? ['console', 'debugger'] : [] },
    plugins: [
      react(),
      svgr({ include: /\.svg(?:\?react)?$/ }),
      nodePolyfills(),
      viteStaticCopy({ targets: [{
        src: 'node_modules/web-curl-to-har/assets/*.wasm', dest: '.', rename: { stripBase: true },
      }] }),
    ],
    server: { port: 8080, strictPort: true, cors: true },
    build: {
      outDir: 'dist',
      // Full builds run before tsup; watchers preserve its sibling extension.js.
      emptyOutDir: !process.argv.includes('--watch'),
      target: 'es2020',
      sourcemap: mode !== 'production',
      minify: mode === 'production',
      cssCodeSplit: false,
      rollupOptions: {
        input: Object.fromEntries(panels.map(name => [name, `src/webviews/${name}.tsx`])),
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: asset => asset.names?.some(name => name.endsWith('.css'))
            ? 'webviews.css' : 'assets/[name]-[hash][extname]',
        },
      },
    },
  };
});
