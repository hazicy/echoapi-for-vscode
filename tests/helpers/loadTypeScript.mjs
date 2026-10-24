import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { pathToFileURL } from "node:url";

export async function nativeDependency(id) {
  const module = await import(id);
  return module.default ?? module;
}

// Execute the real ESM source with explicit mock modules at host/UI boundaries.
export default async function loadTypeScript(
  filename,
  dependencies,
  globals = {},
) {
  const source = fs.readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const context = vm.createContext({ ...globals });
  const module = new vm.SourceTextModule(compiled, {
    context,
    identifier: pathToFileURL(filename).href,
    initializeImportMeta(meta) {
      meta.url = pathToFileURL(filename).href;
    },
  });
  const parsed = ts.createSourceFile(
    filename,
    compiled,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  const requested = new Map();
  for (const statement of parsed.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const names =
      requested.get(statement.moduleSpecifier.text) ?? new Set(["default"]);
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const item of bindings.elements)
        names.add((item.propertyName ?? item.name).text);
    }
    requested.set(statement.moduleSpecifier.text, names);
  }
  await module.link(async (id) => {
    const value = await dependencies(id);
    const names = new Set([
      ...Object.keys(value ?? {}),
      ...(requested.get(id) ?? []),
      "default",
    ]);
    return new vm.SyntheticModule(
      [...names],
      function () {
        for (const name of names) {
          this.setExport(
            name,
            name === "default" ? (value?.default ?? value) : value?.[name],
          );
        }
      },
      { context },
    );
  });
  await module.evaluate();
  return module.namespace;
}
