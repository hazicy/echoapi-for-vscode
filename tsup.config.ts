import { defineConfig } from "tsup";
import { fakerLocalesEsbuild } from "./scripts/faker-locales.mjs";
import { loadEnv } from "vite";
import path from "node:path";
import { cp, readFile, rm } from "node:fs/promises";
import { build } from "esbuild";

// Bundled Node dependencies can still use Node's built-in CommonJS APIs.
const nodeCompatibility = `import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);`;

export default defineConfig((options) => {
  const production = !options.watch && options.minify === true;
  const env = loadEnv(
    production ? "production" : "development",
    process.cwd(),
    "ECHOAPI_",
  );
  const language = env.ECHOAPI_LANGUAGE || "auto";
  if (!["auto", "en", "zh-cn"].includes(language)) {
    throw new Error("ECHOAPI_LANGUAGE must be auto, en, or zh-cn.");
  }
  return {
    entry: { extension: "src/extension.ts" },
    outDir: "dist",
    outExtension: () => ({ js: ".js" }),
    format: ["esm"],
    platform: "node",
    target: "node20",
    external: ["vscode"],
    noExternal: [/^(?!vscode$)/],
    splitting: true,
    esbuildPlugins: [fakerLocalesEsbuild()],
    clean: false,
    publicDir: false,
    banner: { js: nodeCompatibility },
    async onSuccess() {
      const output = path.resolve(options.outDir || "dist");
      await cp("public", output, { recursive: true });
      await rm(path.join(output, "package.json"), { force: true });
      // The prebuilt HTTP engine is vendored CommonJS; publish it as an ESM module.
      await build({
        stdin: {
          contents: await readFile(
            "public/runtime-dist/runtime/index.js",
            "utf8",
          ),
          sourcefile: "runtime.cjs",
          resolveDir: path.resolve("public/runtime-dist/runtime"),
        },
        outfile: path.join(output, "runtime-dist/runtime/index.js"),
        bundle: true,
        packages: "external",
        platform: "node",
        target: "node20",
        format: "esm",
        banner: { js: nodeCompatibility },
        logLevel: "warning",
      });
    },
    sourcemap: !production,
    define: {
      __ECHOAPI_LANGUAGE__: JSON.stringify(language),
      "process.env.NODE_ENV": JSON.stringify(
        production ? "production" : "development",
      ),
      "process.env.ECHOAPI_DEV_SERVER": JSON.stringify(
        options.env?.ECHOAPI_DEV_SERVER || "false",
      ),
    },
    esbuildOptions(build) {
      // Keep extension chunks beside the entry: runtime asset URLs are relative
      // to import.meta.url, and Webview chunks use their own chunks/ directory.
      build.chunkNames = "extension-[name]-[hash]";
      build.mainFields = ["module", "main"];
      build.drop = production ? ["console", "debugger"] : [];
      build.alias = {
        "@": path.resolve("src"),
        "@/shared/locale/runtime": path.resolve(
          "src/shared/locale/runtime.extension.ts",
        ),
        "jsonc-parser": path.resolve(
          "node_modules/jsonc-parser/lib/esm/main.js",
        ),
      };
    },
  };
});
