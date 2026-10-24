import assert from "node:assert/strict";
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import { once } from "node:events";

// VS Code supplies this module when loading the extension through its ESM loader.
register("./vscode-loader.mjs", import.meta.url);
const entry = process.argv[2]
  ? pathToFileURL(process.argv[2])
  : new URL("../dist/extension.js", import.meta.url);
const extension = await import(entry.href);
assert.equal(typeof extension.activate, "function");
const worker = new Worker(new URL("./runtime-dist/work.js", entry));
try {
  const reply = once(worker, "message", { signal: AbortSignal.timeout(30000) });
  worker.postMessage({ method: "checkModuleLoading", args: [] });
  assert.deepEqual(await reply, ["Unknown method: checkModuleLoading"]);
} finally {
  await worker.terminate();
}
console.log("ESM extension exports activate; HTTP Worker loads and responds.");
