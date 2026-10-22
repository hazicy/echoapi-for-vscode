// Distinct injection names avoid collisions with vendor-local process/Buffer
// bindings when esbuild emits unminified shared ESM chunks.
export { default as __echoApiProcess } from 'node:process';
export { Buffer as __echoApiBuffer } from 'node:buffer';
