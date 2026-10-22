import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

const admonitionColorNote = "#9373ee";
const admonitionColorTip = "#52c41a";
const admonitionColorInfo = "#1890ff";
const admonitionColorCaution = "#fa8c16";
const admonitionColorDanger = "#ff4d4f";
const mdTheme: any = {
  dark: {
    "--color-bg-down": "#2C3038",
    "--color-bg-tr": "#1b1e2d",
    "--color-border-td": "#33373f",
    "--color-bg-code": "#2c3038",
    "--color-code-text-base": "#b9bbc0",
    "--color-code-text-1": "#d36873",
    "--color-code-text-2": "#a084d7",
    "--color-code-text-3": "#44a145",
    "--color-code-text-4": "#78b6fd",
    "--color-prettylights-syntax-comment": "#8b949e",
    "--color-prettylights-syntax-constant": "#79c0ff",
    "--color-prettylights-syntax-entity": "#d2a8ff",
    "--color-prettylights-syntax-storage-modifier-import": "#c9d1d9",
    "--color-prettylights-syntax-entity-tag": "#7ee787",
    "--color-prettylights-syntax-keyword": "#ff7b72",
    "--color-prettylights-syntax-string": "#a5d6ff",
    "--color-prettylights-syntax-variable": "#ffa657",
    "--color-prettylights-syntax-brackethighlighter-unmatched": "#f85149",
    "--color-prettylights-syntax-invalid-illegal-text": "#f0f6fc",
    "--color-prettylights-syntax-invalid-illegal-bg": "#8e1519",
    "--color-prettylights-syntax-carriage-return-text": "#f0f6fc",
    "--color-prettylights-syntax-carriage-return-bg": "#b62324",
    "--color-prettylights-syntax-string-regexp": "#7ee787",
    "--color-prettylights-syntax-markup-list": "#f2cc60",
    "--color-prettylights-syntax-markup-heading": "#1f6feb",
    "--color-prettylights-syntax-markup-italic": "#c9d1d9",
    "--color-prettylights-syntax-markup-bold": "#c9d1d9",
    "--color-prettylights-syntax-markup-deleted-text": "#ffdcd7",
    "--color-prettylights-syntax-markup-deleted-bg": "#67060c",
    "--color-prettylights-syntax-markup-inserted-text": "#aff5b4",
    "--color-prettylights-syntax-markup-inserted-bg": "#033a16",
    "--color-prettylights-syntax-markup-changed-text": "#ffdfb6",
    "--color-prettylights-syntax-markup-changed-bg": "#5a1e02",
    "--color-prettylights-syntax-markup-ignored-text": "#c9d1d9",
    "--color-prettylights-syntax-markup-ignored-bg": "#1158c7",
    "--color-prettylights-syntax-meta-diff-range": "#d2a8ff",
    "--color-prettylights-syntax-brackethighlighter-angle": "#8b949e",
    "--color-prettylights-syntax-sublimelinter-gutter-mark": "#484f58",
    "--color-prettylights-syntax-constant-other-reference-link": "#a5d6ff",
    "--color-fg-default": "#c9d1d9",
    "--color-fg-muted": "#8b949e",
    "--color-fg-subtle": "#484f58",
    "--color-canvas-default": "#0d1117",
    "--color-canvas-subtle": "#161b22",
    "--color-border-default": "#30363d",
    "--color-border-muted": "#21262d",
    "--color-neutral-muted": "rgba(110, 118, 129, 0.4)",
    "--color-accent-fg": "#58a6ff",
    "--color-accent-emphasis": "#1f6feb",
    "--color-attention-subtle": "rgba(187, 128, 9, 0.15)",
    "--color-danger-fg": "#f85149",
    "--color-gray-bg-md": "#1e1f2a",
    "--color-gray-md": "#20222d",
  },
  light: {
    "--color-bg-down": "#F8F8F8",
    "--color-border-td": "#f2f2f4",
    "--color-bg-tr": "#f9fafb",
    "--color-bg-code": "#f7f9fb",
    "--color-code-text-base": "#404349",
    "--color-code-text-1": "#d4606c",
    "--color-code-text-2": "#8561ca",
    "--color-code-text-3": "#44a145",
    "--color-code-text-4": "#408ae0",
    "--color-prettylights-syntax-comment": "#6e7781",
    "--color-prettylights-syntax-constant": "#0550ae",
    "--color-prettylights-syntax-entity": "#8250df",
    "--color-prettylights-syntax-storage-modifier-import": "#24292f",
    "--color-prettylights-syntax-entity-tag": "#116329",
    "--color-prettylights-syntax-keyword": "#cf222e",
    "--color-prettylights-syntax-string": "#0a3069",
    "--color-prettylights-syntax-variable": "#953800",
    "--color-prettylights-syntax-brackethighlighter-unmatched": "#82071e",
    "--color-prettylights-syntax-invalid-illegal-text": "#f6f8fa",
    "--color-prettylights-syntax-invalid-illegal-bg": "#82071e",
    "--color-prettylights-syntax-carriage-return-text": "#f6f8fa",
    "--color-prettylights-syntax-carriage-return-bg": "#cf222e",
    "--color-prettylights-syntax-string-regexp": "#116329",
    "--color-prettylights-syntax-markup-list": "#3b2300",
    "--color-prettylights-syntax-markup-heading": "#0550ae",
    "--color-prettylights-syntax-markup-italic": "#24292f",
    "--color-prettylights-syntax-markup-bold": "#24292f",
    "--color-prettylights-syntax-markup-deleted-text": "#82071e",
    "--color-prettylights-syntax-markup-deleted-bg": "#ffebe9",
    "--color-prettylights-syntax-markup-inserted-text": "#116329",
    "--color-prettylights-syntax-markup-inserted-bg": "#dafbe1",
    "--color-prettylights-syntax-markup-changed-text": "#953800",
    "--color-prettylights-syntax-markup-changed-bg": "#ffd8b5",
    "--color-prettylights-syntax-markup-ignored-text": "#eaeef2",
    "--color-prettylights-syntax-markup-ignored-bg": "#0550ae",
    "--color-prettylights-syntax-meta-diff-range": "#8250df",
    "--color-prettylights-syntax-brackethighlighter-angle": "#57606a",
    "--color-prettylights-syntax-sublimelinter-gutter-mark": "#8c959f",
    "--color-prettylights-syntax-constant-other-reference-link": "#0a3069",
    "--color-fg-default": "#24292f",
    "--color-fg-muted": "#57606a",
    "--color-fg-subtle": "#6e7781",
    "--color-canvas-default": "#ffffff",
    "--color-canvas-subtle": "#f6f8fa",
    "--color-border-default": "#d0d7de",
    "--color-border-muted": "hsla(210, 18%, 87%, 1)",
    "--color-neutral-muted": "rgba(175, 184, 193, 0.2)",
    "--color-accent-fg": "#0969da",
    "--color-accent-emphasis": "#0969da",
    "--color-attention-subtle": "#fff8c5",
    "--color-danger-fg": "#cf222e",
    "--color-gray-bg-md": "#f9fafb",
    "--color-gray-md": "#f2f4f7",
  },
};
export const ByteMdWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["ByteMdWrap"], { selector: "ui_34df9e44_ByteMdWrap" });
export const ThemeModeWrap = withStyles<"div", { theme_mode: string }>(
  "div",
  moduleStyles["ThemeModeWrap"],
  {
    selector: "ui_34df9e44_ThemeModeWrap",
    variables: {
      "--style-34df9e44-ThemeModeWrap-0": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-fg-default"],
      "--style-34df9e44-ThemeModeWrap-1": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-accent-fg"],
      "--style-34df9e44-ThemeModeWrap-2": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-border-muted"],
      "--style-34df9e44-ThemeModeWrap-3": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-attention-subtle"],
      "--style-34df9e44-ThemeModeWrap-4": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-canvas-default"],
      "--style-34df9e44-ThemeModeWrap-5": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-border-muted"],
      "--style-34df9e44-ThemeModeWrap-6": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-border-default"],
      "--style-34df9e44-ThemeModeWrap-7": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-neutral-muted"],
      "--style-34df9e44-ThemeModeWrap-8": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-neutral-muted"],
      "--style-34df9e44-ThemeModeWrap-9": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-fg-default"],
      "--style-34df9e44-ThemeModeWrap-10": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-canvas-subtle"],
      "--style-34df9e44-ThemeModeWrap-11": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-neutral-muted"],
      "--style-34df9e44-ThemeModeWrap-12": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-border-muted"],
      "--style-34df9e44-ThemeModeWrap-13": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-fg-muted"],
      "--style-34df9e44-ThemeModeWrap-14": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-border-default"],
      "--style-34df9e44-ThemeModeWrap-15": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-fg-muted"],
      "--style-34df9e44-ThemeModeWrap-16": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-bg-code"],
      "--style-34df9e44-ThemeModeWrap-17": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-neutral-muted"],
      "--style-34df9e44-ThemeModeWrap-18": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-fg-subtle"],
      "--style-34df9e44-ThemeModeWrap-19": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-comment"],
      "--style-34df9e44-ThemeModeWrap-20": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-variable"],
      "--style-34df9e44-ThemeModeWrap-21": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-constant"],
      "--style-34df9e44-ThemeModeWrap-22": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-entity"],
      "--style-34df9e44-ThemeModeWrap-23": ({ theme_mode }) =>
        mdTheme[theme_mode][
          "--color-prettylights-syntax-storage-modifier-import"
        ],
      "--style-34df9e44-ThemeModeWrap-24": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-entity-tag"],
      "--style-34df9e44-ThemeModeWrap-25": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-keyword"],
      "--style-34df9e44-ThemeModeWrap-26": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-string"],
      "--style-34df9e44-ThemeModeWrap-27": ({ theme_mode }) =>
        mdTheme[theme_mode][
          "--color-prettylights-syntax-brackethighlighter-unmatched"
        ],
      "--style-34df9e44-ThemeModeWrap-28": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-invalid-illegal-text"],
      "--style-34df9e44-ThemeModeWrap-29": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-invalid-illegal-bg"],
      "--style-34df9e44-ThemeModeWrap-30": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-carriage-return-text"],
      "--style-34df9e44-ThemeModeWrap-31": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-carriage-return-bg"],
      "--style-34df9e44-ThemeModeWrap-32": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-string-regexp"],
      "--style-34df9e44-ThemeModeWrap-33": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-list"],
      "--style-34df9e44-ThemeModeWrap-34": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-heading"],
      "--style-34df9e44-ThemeModeWrap-35": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-italic"],
      "--style-34df9e44-ThemeModeWrap-36": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-bold"],
      "--style-34df9e44-ThemeModeWrap-37": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-deleted-text"],
      "--style-34df9e44-ThemeModeWrap-38": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-deleted-bg"],
      "--style-34df9e44-ThemeModeWrap-39": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-inserted-text"],
      "--style-34df9e44-ThemeModeWrap-40": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-inserted-bg"],
      "--style-34df9e44-ThemeModeWrap-41": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-changed-text"],
      "--style-34df9e44-ThemeModeWrap-42": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-changed-bg"],
      "--style-34df9e44-ThemeModeWrap-43": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-ignored-text"],
      "--style-34df9e44-ThemeModeWrap-44": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-markup-ignored-bg"],
      "--style-34df9e44-ThemeModeWrap-45": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-prettylights-syntax-meta-diff-range"],
      "--style-34df9e44-ThemeModeWrap-46": ({ theme_mode }) =>
        mdTheme[theme_mode][
          "--color-prettylights-syntax-brackethighlighter-angle"
        ],
      "--style-34df9e44-ThemeModeWrap-47": ({ theme_mode }) =>
        mdTheme[theme_mode][
          "--color-prettylights-syntax-sublimelinter-gutter-mark"
        ],
      "--style-34df9e44-ThemeModeWrap-48": ({ theme_mode }) =>
        mdTheme[theme_mode][
          "--color-prettylights-syntax-constant-other-reference-link"
        ],
      "--style-34df9e44-ThemeModeWrap-49": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-danger-fg"],
      "--style-34df9e44-ThemeModeWrap-50": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-fg-default"],
      "--style-34df9e44-ThemeModeWrap-51": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-bg-down"],
      "--style-34df9e44-ThemeModeWrap-52": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-border-td"],
      "--style-34df9e44-ThemeModeWrap-53": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-bg-down"],
      "--style-34df9e44-ThemeModeWrap-54": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-canvas-subtle"],
      "--style-34df9e44-ThemeModeWrap-55": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-border-default"],
      "--style-34df9e44-ThemeModeWrap-56": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-fg-default"],
      "--style-34df9e44-ThemeModeWrap-57": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-bg-code"],
      "--style-34df9e44-ThemeModeWrap-58": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-canvas-default"],
      "--style-34df9e44-ThemeModeWrap-59": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-canvas-subtle"],
      "--style-34df9e44-ThemeModeWrap-60": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-border-default"],
      "--style-34df9e44-ThemeModeWrap-61": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-fg-muted"],
      "--style-34df9e44-ThemeModeWrap-62": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-accent-emphasis"],
      "--style-34df9e44-ThemeModeWrap-63": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-fg-default"],
      "--style-34df9e44-ThemeModeWrap-64": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-code-text-base"],
      "--style-34df9e44-ThemeModeWrap-65": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-bg-code"],
      "--style-34df9e44-ThemeModeWrap-66": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-code-text-1"],
      "--style-34df9e44-ThemeModeWrap-67": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-code-text-4"],
      "--style-34df9e44-ThemeModeWrap-68": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-code-text-3"],
      "--style-34df9e44-ThemeModeWrap-69": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-code-text-2"],
      "--style-34df9e44-ThemeModeWrap-70": ({ theme_mode }) =>
        mdTheme[theme_mode]["--color-code-text-1"],
    },
  },
);
