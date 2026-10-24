import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { fakerLocalesEsbuild } from "./faker-locales.mjs";
import { spawnSync } from "node:child_process";
import path from "node:path";

async function main() {
  const protocol = process.argv.includes("--socketio")
    ? "socketio"
    : "websocket";
  const outfile = path.resolve(
    fileURLToPath(new URL(".", import.meta.url)),
    `../test-results/${protocol}.test.mjs`,
  );
  await build({
    entryPoints: [
      path.resolve(
        fileURLToPath(new URL(".", import.meta.url)),
        `../src/test/${protocol}.test.ts`,
      ),
    ],
    outfile,
    bundle: true,
    plugins: [fakerLocalesEsbuild()],
    packages: process.argv.includes("--bundled") ? undefined : "external",
    platform: "node",
    target: "node20",
    format: "esm",
    banner: {
      js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);',
    },
  });
  const result = spawnSync(process.execPath, ["--test", outfile], {
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
