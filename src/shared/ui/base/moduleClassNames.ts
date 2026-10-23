/** Resolve dynamic class tokens, preserving caller-supplied classes. */
export function moduleClassNames(
  styles: Readonly<Record<string, string>>,
  value: string,
): string {
  return value.split(/\s+/).filter(Boolean).map(name =>
    Object.prototype.hasOwnProperty.call(styles, name) ? styles[name] : name,
  ).join(" ");
}
