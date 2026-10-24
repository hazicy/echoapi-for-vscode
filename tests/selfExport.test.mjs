import { test } from "node:test";
import assert from "node:assert/strict";
import {
  loadConverter,
  schema,
  request,
} from "./helpers/selfExportFixture.mjs";
const plain = (value) => JSON.parse(JSON.stringify(value));
test("schema conversion normalizes legacy keys and remaps nested references without changing input", async () => {
  const api = await loadConverter();
  const input = structuredClone(schema);
  const result = plain(api.recursionSchema(input, { model: "new-model" }));
  assert.deepEqual(input, schema);
  assert.equal(result.properties.child.$ref, "new-model");
  assert.equal(result.properties.list.items.anyOf[0].$ref, "new-model");
  assert.equal(result["x-schema-overrides"].child.$ref, "new-model");
  assert.deepEqual(result["x-schema-refs"], {
    first: { $ref: "new-model", description: "ref entry" },
    second: { $ref: "new-model" },
  });
  assert.deepEqual(result["x-schema-orders"], ["child", "list"]);
  assert.equal("ECHOAPI_REFS" in result, false);
  assert.equal("ECHOAPI_ORDERS" in result, false);
  assert.equal(api.cloneCount(), 1);
});
test("schema conversion accepts primitives, arrays, modern extensions and missing model references", async () => {
  const api = await loadConverter();
  for (const value of [undefined, null, false, 0, "text"])
    assert.equal(api.recursionSchema(value, {}), value);
  const input = [
    { $ref: "#/definitions/unknown" },
    { "x-schema-refs": { a: { ref: "missing" } }, "x-schema-orders": ["a"] },
  ];
  const result = api.recursionSchema(input, {});
  assert.equal(result[0].$ref, "#/definitions/unknown");
  assert.equal(result[1]["x-schema-refs"].a.$ref, undefined);
  assert.equal("ref" in result[1]["x-schema-refs"].a, false);
  assert.deepEqual(plain(result[1]["x-schema-orders"]), ["a"]);
});
test("schema traversal deep-copies its input once rather than copying each subtree", async () => {
  const api = await loadConverter();
  let input = { type: "string" };
  for (let depth = 0; depth < 150; depth++)
    input = { type: "object", properties: { nested: input } };
  const result = api.recursionSchema(input, {});
  assert.deepEqual(plain(result), input);
  assert.notEqual(result, input);
  assert.equal(api.cloneCount(), 1);
});
test("HTTP and SSE share conversion behavior while retaining their target type", async () => {
  const convert = async (target_type) =>
    plain(
      (await loadConverter()).completionApis(
        [
          {
            target_id: "original",
            target_type,
            parent_id: "folder",
            name: "Example",
            request,
            response: {},
          },
        ],
        { original: "new", folder: "new-folder" },
        { model: "new-model" },
        {},
        "project",
      ),
    )[0];
  const http = await convert("api");
  const sse = await convert("sse");
  assert.equal(http.target_type, "api");
  assert.equal(sse.target_type, "sse");
  assert.deepEqual(
    { ...http, target_type: "same" },
    { ...sse, target_type: "same" },
  );
  assert.equal(http.target_id, "new");
  assert.equal(http.parent_id, "new-folder");
  assert.equal(http.request.body.raw_schema.properties.child.$ref, "new-model");
});
