const { build } = require("esbuild");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

async function main() {
  const outfile = path.resolve(__dirname, "../test-results/websocket.test.cjs");
  await build({
    entryPoints: [path.resolve(__dirname, "../src/test/websocket.test.ts")],
    outfile,
    bundle: true,
    packages: process.argv.includes("--bundled") ? undefined : "external",
    platform: "node",
    target: "node16",
    format: "cjs",
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
