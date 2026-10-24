import load from "./loadTypeScript.mjs";
import lodash0 from "lodash";
import lodash1 from "lodash";
const types = Object.fromEntries(
  [
    "api",
    "sse",
    "folder",
    "doc",
    "grpc",
    "socket",
    "socket_method",
    "websocket2",
    "socketio",
    "graphql",
  ].map((type) => [type.toUpperCase(), type]),
);
const loadConverter = async (
  filename = "src/features/export/utils/exportutils/apiToSelf.ts",
) => {
  let nextId = 0;
  let clones = 0;
  const api = await load(filename, (id) => {
    if (id === "lodash")
      return {
        ...lodash0,
        cloneDeep: (value) => {
          clones++;
          return lodash1.cloneDeep(value);
        },
      };
    if (id === "apipost-tools") return { snowflakeId: () => `id-${++nextId}` };
    if (id === "i18next") return { t: (key) => key };
    if (id === "@/features/requests/constants")
      return { APIS_TARGET_TYPE_ENUM: types };
    if (id === "@/features/requests/constants/request")
      return { DEFAULT_WEBSOCKET2_MESSAGE: { type: "text", message: "" } };
    if (id === "@/shared/utils/common")
      return {
        getSubstring: (text, length) =>
          typeof text === "string" ? text.slice(0, length) : "",
      };
    if (id === "@/features/requests/utils/apis")
      return { genUrlByQuery: (url) => url };
    throw new Error(`Unexpected dependency: ${id}`);
  });
  return { ...api, cloneCount: () => clones };
};
const schema = {
  type: "object",
  properties: {
    child: { $ref: "#/definitions/model" },
    list: {
      type: "array",
      items: { anyOf: [{ $ref: "model" }, { type: "null" }] },
    },
  },
  ECHOAPI_REFS: {
    first: { ref: "model", description: "ref entry" },
    second: { $ref: "#/definitions/model" },
  },
  ECHOAPI_ORDERS: ["child", "list"],
  "x-schema-overrides": { child: { $ref: "model" } },
};
const request = {
  auth: { type: "bearer", bearer: { token: "secret" } },
  query: { parameter: [{ key: "q", value: "value" }] },
  header: { parameter: [{ key: "accept", value: "application/json" }] },
  body: {
    mode: "json",
    raw: '{"a":1}',
    raw_schema: schema,
    parameter: [],
    raw_parameter: [],
  },
};
const inputs = Object.values(types).map((target_type, index) => ({
  target_id: String(index),
  parent_id: "parent",
  target_type,
  name: `Example ${target_type}`,
  url: "https://example.com/path?q=value",
  request,
  response: {
    example: [{ example_id: "example", expect: { schema }, raw: "response" }],
  },
}));
export { loadConverter, schema, request, inputs };
