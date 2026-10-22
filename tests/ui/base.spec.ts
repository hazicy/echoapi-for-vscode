import { expect, test } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("/?base");
});
test("controls propagate values and support keyboard selection", async ({
  page,
}) => {
  await page.getByRole("textbox", { name: "Text value" }).fill("typed");
  await page.getByRole("checkbox", { name: "Accept terms" }).check();
  await page.getByRole("switch", { name: "Enable feature" }).check();
  await page.getByRole("radio", { name: "Mode B" }).check();
  await page.getByRole("combobox", { name: "Search choice" }).fill("Second");
  await page.getByRole("option", { name: "Second option" }).click();
  await expect(
    page.getByRole("status", { name: "Control result" }),
  ).toContainText('"value":"two"');
  await expect(
    page.getByRole("status", { name: "Control result" }),
  ).toContainText('"checked":true');
  await expect(
    page.getByRole("status", { name: "Control result" }),
  ).toContainText('"radio":"b"');
});
test("multiple select adds and removes values", async ({ page }) => {
  await page.getByRole("combobox", { name: "Multiple choices" }).fill("Alpha");
  await page.getByRole("option", { name: "Alpha" }).click();
  await expect(
    page.getByRole("status", { name: "Control result" }),
  ).toContainText('"selected":["a"]');
  await page.getByRole("button", { name: "Remove Alpha" }).click();
  await expect(
    page.getByRole("status", { name: "Control result" }),
  ).toContainText('"selected":[]');
});
test("tabs and collapsible panels change visible content", async ({ page }) => {
  await page.getByRole("tab", { name: "Second tab" }).click();
  await expect(page.getByRole("tabpanel", { name: "First tab" })).toBeHidden();
  await expect(page.getByRole("tabpanel", { name: "Second tab" })).toHaveText(
    "Second panel",
  );
  await page.getByRole("button", { name: "Expand details" }).click();
  await expect(page.getByText("Expanded content")).toBeVisible();
});
test("form validates required fields and submits current input", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Save form" }).click();
  await expect(page.getByRole("alert")).toContainText("Name is required");
  await page.getByRole("textbox", { name: "Required name" }).fill("valid");
  await page.getByRole("button", { name: "Save form" }).click();
  await expect(
    page.getByRole("status", { name: "Submitted value" }),
  ).toHaveText("valid");
});
test("table selects rows and trees expose children", async ({ page }) => {
  const row = page.getByRole("row", { name: "First row" });
  await row.getByRole("checkbox").check();
  await expect(page.getByRole("status", { name: "Row selection" })).toHaveText(
    "1",
  );
  await expect(page.getByRole("treeitem", { name: "Leaf node" })).toBeVisible();
});
test("menu actions, confirmation dialogs and toast feedback work", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.getByRole("menuitem", { name: "Run menu action" }).click();
  await expect(page.getByRole("status", { name: "Menu result" })).toHaveText(
    "item",
  );
  await page.getByRole("button", { name: "Open confirmation" }).click();
  const dialog = page.getByRole("dialog", { name: "Confirm action" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "OK", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("status", { name: "Menu result" })).toHaveText(
    "confirmed",
  );
  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Saved successfully")).toBeVisible();
});
test("manual file upload reports a selected file without sending a request", async ({
  page,
}) => {
  await page.locator("input[type=file]").setInputFiles({
    name: "example.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await expect(page.getByRole("status", { name: "Uploaded name" })).toHaveText(
    "example.json",
  );
});

test("context menus open on right click and async confirmations resolve on choice", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Context target" })
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Run context action" }).click();
  await expect(page.getByRole("status", { name: "Menu result" })).toHaveText(
    "context",
  );
  await page
    .getByRole("button", { name: "Await confirmation", exact: true })
    .click();
  await page
    .getByRole("dialog", { name: "Await confirmation" })
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await expect(page.getByRole("status", { name: "Menu result" })).toHaveText(
    "false",
  );
  await page
    .getByRole("button", { name: "Await confirmation", exact: true })
    .click();
  await page
    .getByRole("dialog", { name: "Await confirmation" })
    .getByRole("button", { name: "OK", exact: true })
    .click();
  await expect(page.getByRole("status", { name: "Menu result" })).toHaveText(
    "true",
  );
});
test("tag separators and tree selection preserve their values", async ({
  page,
}) => {
  await page.getByRole("combobox", { name: "Tag values" }).fill("red,blue,");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("status", { name: "Control result" }),
  ).toContainText('"selected":["red","blue"]');
  await page.keyboard.press("Escape");
  await page.getByRole("combobox", { name: "Tree choice" }).click();
  await page.getByText("Leaf choice", { exact: true }).click();
  await expect(
    page.getByRole("status", { name: "Control result" }),
  ).toContainText('"value":"leaf"');
});
test("numeric input and clearable text update controlled state", async ({
  page,
}) => {
  await page.getByRole("textbox", { name: "Text value" }).fill("clear me");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Text value" })).toHaveValue(
    "",
  );
  await page.getByRole("button", { name: "Increase", exact: true }).click();
  await expect(
    page.getByRole("status", { name: "Control result" }),
  ).toContainText('"number":3');
});
test("theme changes update CSS variables and extracted conditional styles", async ({
  page,
}) => {
  await page.goto("/?theme");
  const state = page.getByText("Styled state", { exact: true });
  await expect(state).toHaveCSS("color", "rgb(22, 119, 255)");
  await expect(state).toHaveCSS("cursor", "not-allowed");
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(state).toHaveCSS("color", "rgb(255, 0, 0)");
  await expect(state).toHaveCSS("cursor", "auto");
  await expect(page.locator("html")).toHaveCSS("--font-size-14", "16px");
});
