import { test } from "node:test";
import assert from "node:assert/strict";
import load from "./helpers/swaggerImportFixture.mjs";
const plain = (value) => JSON.parse(JSON.stringify(value));
test("Swagger import preserves nested folder parents, API fields and response defaults", async () => {
  const api = await load();
  const result = { config: { folder: "chosen" } };
  api.completionSwaggerApis(
    result,
    [
      {
        target_type: "folder",
        name: "Folder",
        children: [
          {
            target_type: "api",
            name: "Get",
            url: "/users",
            method: "GET",
            request: { body: { mode: "json", raw: "{}" } },
            response: { example: [{ example_id: "custom" }] },
          },
        ],
      },
    ],
    "project",
  );
  const [folder, request] = plain(result.apis);
  assert.equal(folder.parent_id, "chosen");
  assert.equal(request.parent_id, folder.target_id);
  assert.equal(request.project_id, "project");
  assert.equal(request.request.body.mode, "json");
  assert.equal(request.request.body.raw, "{}");
  assert.equal(request.url, "/users");
  assert.equal(request.method, "GET");
  assert.deepEqual(
    request.response.example.map((item) => item.example_id),
    ["1", "2", "custom"],
  );
});
test("Swagger import retains existing response defaults without inserting duplicates", async () => {
  const api = await load();
  const result = {};
  api.completionSwaggerApis(
    result,
    [
      {
        target_type: "api",
        response: { example: [{ example_id: "1" }, { example_id: "2" }] },
      },
    ],
    "project",
  );
  assert.deepEqual(plain(result.apis[0].response.example), [
    { example_id: "1" },
    { example_id: "2" },
  ]);
  assert.equal(result.apis[0].name, "supplement.new_api");
});
test("Swagger environment completion preserves variables and optional server URL", async () => {
  const api = await load();
  const result = { global: {} };
  api.completionSwaggerEnv(result, [
    {
      name: "Local",
      url: "https://example.com",
      env_var_list: { token: { value: "secret" } },
    },
    { name: "Empty" },
  ]);
  const envs = plain(result.global.envs);
  assert.equal(envs[0].env_var_list.token.value, "secret");
  assert.equal(envs[0].server_list[0].uri, "https://example.com");
  assert.equal(envs[0].server_list[0].server_id, "1");
  assert.equal(envs[1].server_list, undefined);
  assert.deepEqual(envs[1].env_var_list, {});
});
test("response completion preserves imported arrays and isolates requests from shared defaults", async () => {
  const api = await load();
  const input = [
    { target_type: "api", response: { example: [{ example_id: "custom" }] } },
    { target_type: "api" },
    { target_type: "api" },
  ];
  const original = structuredClone(input);
  const result = {};
  api.completionSwaggerApis(result, input, "project");
  assert.deepEqual(input, original);
  for (const request of result.apis.slice(1)) {
    assert.deepEqual(
      plain(request.response.example).map((item) => item.example_id),
      ["1", "2"],
    );
  }
  result.apis[1].request.auth.type = "bearer";
  assert.equal(result.apis[2].request.auth.type, "noauth");
  result.apis[1].response.example[0].name = "Edited";
  assert.equal(result.apis[2].response.example[0].name, "Success");
  const next = {};
  api.completionSwaggerApis(next, [{ target_type: "api" }], "project");
  assert.equal(next.apis[0].response.example[0].name, "Success");
  assert.equal(next.apis[0].response.example.length, 2);
});
