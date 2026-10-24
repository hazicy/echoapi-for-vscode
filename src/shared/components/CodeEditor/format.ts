import { applyEdits, format, parse, type ParseError } from "jsonc-parser";
import { normalizeLanguage } from "./languages";

/** Invalid/unsupported input stays untouched. JSON formatting preserves comments and numeric literals. */
export async function formatDocument(
  value: string,
  language: string,
): Promise<string> {
  if (!value.trim()) {
    return value;
  }
  const name = normalizeLanguage(language);
  if (name === "json") {
    const errors: ParseError[] = [];
    parse(value, errors, { allowTrailingComma: true, disallowComments: false });
    return errors.length
      ? value
      : applyEdits(
          value,
          format(value, undefined, {
            tabSize: 2,
            insertSpaces: true,
            eol: "\n",
          }),
        );
  }
  if (
    ![
      "javascript",
      "typescript",
      "html",
      "xml",
      "css",
      "graphql",
      "yaml",
    ].includes(name)
  ) {
    return value;
  }
  try {
    const { format: prettierFormat } = await import("prettier/standalone");
    switch (name) {
      case "javascript":
      case "typescript": {
        const [parser, estree] = await Promise.all([
          name === "typescript"
            ? import("prettier/plugins/typescript")
            : import("prettier/plugins/babel"),
          import("prettier/plugins/estree"),
        ]);
        return await prettierFormat(value, {
          parser: name === "typescript" ? "typescript" : "babel",
          plugins: [parser, estree],
        });
      }
      case "html":
        return await prettierFormat(value, {
          parser: "html",
          plugins: [await import("prettier/plugins/html")],
        });
      case "xml": {
        const { default: xml } = await import("@prettier/plugin-xml");
        return await prettierFormat(value, { parser: "xml", plugins: [xml] });
      }
      case "css":
        return await prettierFormat(value, {
          parser: "css",
          plugins: [await import("prettier/plugins/postcss")],
        });
      case "graphql":
        return await prettierFormat(value, {
          parser: "graphql",
          plugins: [await import("prettier/plugins/graphql")],
        });
      case "yaml":
        return await prettierFormat(value, {
          parser: "yaml",
          plugins: [await import("prettier/plugins/yaml")],
        });
      default:
        return value;
    }
  } catch {
    return value;
  }
}
