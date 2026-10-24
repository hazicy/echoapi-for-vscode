import path from "node:path";

const modern = path.resolve("node_modules/@faker-js/faker/dist");
const legacy = path.resolve(
  "node_modules/mockjs5-pro/node_modules/@faker-js/faker",
);
const languages = {
  en: "fakerEN",
  zh_CN: "fakerZH_CN",
  zh_TW: "fakerZH_TW",
  ja: "fakerJA",
  id_ID: "fakerID_ID",
  de: "fakerDE",
  fr: "fakerFR",
};

// exp-mock supports these seven languages and uses English for every other value.
// Preserve that public behavior while avoiding the all-locales package entry.
function modernSource() {
  return (
    Object.entries(languages)
      .map(
        ([locale, name]) =>
          `import { faker as ${name} } from ${JSON.stringify(path.join(modern, "locale", locale + ".js"))}; export { ${name} };`,
      )
      .join("\n") + "\nexport { fakerEN as faker };"
  );
}

function replacement(filename) {
  const normalized = filename.split("?")[0];
  if (
    [path.join(modern, "index.js"), path.join(modern, "index.cjs")].includes(
      normalized,
    )
  )
    return modernSource();
  if (
    [
      path.join(legacy, "dist/cjs/index.js"),
      path.join(legacy, "dist/esm/index.mjs"),
    ].includes(normalized)
  ) {
    // mockjs5-pro only reads the default English faker instance, never other locales.
    return `import faker from ${JSON.stringify(path.join(legacy, "locale/en.js"))}; export { faker };`;
  }
}

export function fakerLocalesEsbuild() {
  return {
    name: "faker-used-locales",
    setup(build) {
      build.onLoad(
        {
          filter:
            /[\\/]@faker-js[\\/]faker[\\/]dist[\\/](?:cjs[\\/]|esm[\\/])?index\.(?:c?js|mjs)$/,
        },
        (args) => {
          const contents = replacement(args.path);
          return contents === undefined
            ? undefined
            : { contents, loader: "js", resolveDir: path.dirname(args.path) };
        },
      );
    },
  };
}

export function fakerLocalesVite() {
  return {
    name: "faker-used-locales",
    enforce: "pre",
    transform(source, id) {
      const code = replacement(id);
      return code === undefined ? undefined : { code, map: null };
    },
    config() {
      return {
        optimizeDeps: { esbuildOptions: { plugins: [fakerLocalesEsbuild()] } },
      };
    },
  };
}
