import { has } from "lodash";

type VariableSource = Record<string, { current_value?: unknown }> | undefined;
type VariableMap = Record<string, string | undefined>;

const currentValues = (source: VariableSource): VariableMap =>
  Object.fromEntries(
    Object.entries(source || {}).map(([key, variable]) => [
      key,
      typeof variable?.current_value === "string"
        ? variable.current_value
        : JSON.stringify(variable?.current_value),
    ]),
  );

export const buildOAuth2VariableMap = (
  globals: VariableSource,
  environment: VariableSource,
): VariableMap => ({
  ...currentValues(globals),
  ...currentValues(environment),
});

export const resolveOAuth2Variables = (
  value = "",
  variables: VariableMap,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const pattern = /\{\{(?![$!])[^{}]+\}\}/g;
    const missing = value
      .match(pattern)
      ?.find((match) => !has(variables, match.slice(2, -2)));
    if (missing) {
      reject(missing.slice(2, -2));
      return;
    }
    resolve(
      value.replace(pattern, (match) => String(variables[match.slice(2, -2)])),
    );
  });

export const resolveOAuth2Parameters = async <
  T extends { key: string; value: string },
>(
  parameters: T[],
  variables: VariableMap,
): Promise<T[]> => {
  const result: T[] = [];
  for (const item of parameters) {
    if (!item?.key) {
      continue;
    }
    const key = await resolveOAuth2Variables(item.key, variables);
    const value = await resolveOAuth2Variables(item.value, variables);
    if (key) {
      result.push({ ...item, key, value });
    }
  }
  return result;
};
