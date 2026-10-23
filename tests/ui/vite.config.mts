import { generateScopedName, sharedSlots } from '../../scripts/css-modules.mjs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  css: { modules: { generateScopedName }, postcss: { plugins: [sharedSlots()] } },
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
  define: { __ECHOAPI_LANGUAGE__: JSON.stringify('en') },
  server: { host: '127.0.0.1', port: 4179, strictPort: true },
});
