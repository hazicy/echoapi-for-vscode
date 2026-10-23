import { forwardRef } from "./forwardRef";
import { createElement } from "react";
import type { ComponentPropsWithRef, CSSProperties, ElementType } from "react";
import { useThemeConfig } from "./Theme";

/** Static CSS Module wrapper. Only dynamic CSS variable values are computed at render time. */
export function withStyles<C extends ElementType, P extends object = {}>(
  Component: C,
  moduleClass: string,
  options: {
    selector?: string;
    attrs?: Partial<ComponentPropsWithRef<C> & P>;
    variables?: Record<
      string,
      (
        props: ComponentPropsWithRef<C> &
          P & { theme: ReturnType<typeof useThemeConfig> },
      ) => unknown
    >;
  } = {},
) {
  return forwardRef<HTMLElement, ComponentPropsWithRef<C> & P>((input, ref) => {
    const theme = useThemeConfig();
    const props = { ...options.attrs, ...input } as ComponentPropsWithRef<C> &
      P & { className?: string; style?: CSSProperties; as?: ElementType };
    const variables: Record<string, string | number | undefined> = {};
    for (const [name, getValue] of Object.entries(options.variables ?? {})) {
      const value = getValue({ ...props, theme });
      variables[name] =
        typeof value === "string" || typeof value === "number"
          ? value
          : undefined;
    }
    const forwarded = Object.fromEntries(
      Object.entries(props).filter(
        ([name]) =>
          !name.startsWith("$") &&
          !["as", "theme", "theme_mode", "forwardedAs"].includes(name),
      ),
    );
    return createElement(props.as ?? Component, {
      ...forwarded,
      ref,
      className: [
        moduleClass,
        options.selector,
        options.attrs && "className" in options.attrs
          ? options.attrs.className
          : "",
        props.className,
      ]
        .filter(Boolean)
        .join(" "),
      style: { ...variables, ...props.style },
    });
  });
}
