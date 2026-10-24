import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import JSON5 from "json5";
import { fakerLocalesEsbuild } from "../scripts/faker-locales.mjs";
import originalGenerators from "mockjs5-pro/constants/faker.js";
import originalExpressions from "exp-mock";

const output = path.resolve("test-results/mock-optimized.mjs");
await fs.mkdir(path.dirname(output), { recursive: true });
await build({
  stdin: {
    contents: `export { default as expressions } from 'exp-mock';
      export { default as generators } from 'mockjs5-pro/constants/faker.js';
      export { default as MockSchema } from 'apipost-mock-schema';
      export { generateMockBody } from './src/features/requests/utils/generateMockBody';`,
    resolveDir: process.cwd(),
  },
  outfile: output,
  bundle: true,
  platform: "node",
  format: "esm",
  plugins: [fakerLocalesEsbuild()],
  banner: {
    js: `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);`,
  },
});
const optimized = await import(pathToFileURL(output));

test("locale trimming preserves every legacy Mock generator and its result type", () => {
  for (const [name, definition] of Object.entries(originalGenerators)) {
    const invoke = (generator) => {
      try {
        return { type: typeof generator() };
      } catch (error) {
        return { error: error.message };
      }
    };
    assert.deepEqual(
      invoke(optimized.generators[name].generator),
      invoke(definition.generator),
      name,
    );
  }
});

test("expression evaluation retains supported languages, variables and legacy placeholders", () => {
  for (const language of [
    "en",
    "zh-cn",
    "zh-tw",
    "ja",
    "id",
    "de",
    "fr",
    "unsupported",
  ]) {
    for (const expression of [
      "{{$fakerjs.person.firstName}}",
      "{{$fakerjs.internet.email}}",
      "{{$mockjs.integer(1,10)}}",
    ]) {
      const actual = optimized.expressions.mockExp(expression, {}, language);
      const original = originalExpressions.mockExp(expression, {}, language);
      assert.equal(
        typeof actual,
        typeof original,
        `${language}: ${expression}`,
      );
      assert.notEqual(actual, expression, `${language}: ${expression}`);
    }
    assert.equal(
      optimized.expressions.mockExp(
        "{{host|upper()}}",
        { host: "example" },
        language,
      ),
      "EXAMPLE",
    );
  }
  assert.deepEqual(
    optimized.expressions.getFakerObject(),
    originalExpressions.getFakerObject(),
  );
});

test("Schema mock generation still respects field types, arrays and required properties", async () => {
  const result = await new optimized.MockSchema({ lang: "en" }).mock({
    type: "object",
    required: ["name", "age", "tags"],
    properties: {
      name: { type: "string" },
      age: { type: "integer", minimum: 20, maximum: 30 },
      tags: {
        type: "array",
        minItems: 2,
        maxItems: 2,
        items: { type: "string" },
      },
    },
  });
  assert.equal(typeof result.name, "string");
  assert.ok(
    Number.isInteger(result.age) && result.age >= 20 && result.age <= 30,
  );
  assert.equal(result.tags.length, 2);
  assert.ok(result.tags.every((value) => typeof value === "string"));
});

test("body generation preserves JSON5 structure and leaves invalid input untouched", async () => {
  const result = JSON.parse(
    await optimized.generateMockBody(
      "{ name: 'example', age: 20, tags: ['tag'], }",
    ),
  );
  assert.equal(typeof result.name, "string");
  assert.equal(typeof result.age, "number");
  assert.ok(Array.isArray(result.tags));
  for (const source of ["not JSON", "<root/>", "{broken"]) {
    assert.equal(await optimized.generateMockBody(source), source);
  }
  assert.deepEqual(
    JSON5.parse(await optimized.generateMockBody({ count: 1 })),
    { count: 1 },
  );
});
