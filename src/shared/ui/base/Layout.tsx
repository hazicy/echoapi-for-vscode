import slots from "@/shared/ui/base/slots.module.css";
import { forwardRef } from "./forwardRef";
import React from "react";
import cx from "classnames";
import { Separator } from "@base-ui/react/separator";
import type { UIProps } from "./types";
import css from "./base.module.css";
export const Flex = forwardRef<HTMLDivElement, UIProps>(
  (
    {
      vertical,
      align,
      justify,
      gap,
      wrap,
      flex,
      component = "div",
      children,
      className,
      rootClassName,
      style,
      ...props
    },
    ref,
  ) =>
    React.createElement(
      component,
      {
        ...props,
        ref,
        className: cx(css.flex, slots["beautify-flex"], className, rootClassName),
        style: {
          flexDirection: vertical ? "column" : "row",
          alignItems: align,
          justifyContent: justify,
          gap:
            typeof gap === "number"
              ? gap
              : gap === "small"
                ? 8
                : gap === "middle"
                  ? 16
                  : gap === "large"
                    ? 24
                    : gap,
          flexWrap: wrap === true ? "wrap" : wrap,
          flex,
          ...style,
        },
      },
      children,
    ),
);
export const Space = Object.assign(
  forwardRef<HTMLDivElement, UIProps>(
    ({ size = 8, direction, split, children, ...props }, ref) => (
      <Flex
        {...props}
        ref={ref}
        gap={Array.isArray(size) ? size[0] : size}
        vertical={direction === "vertical"}
      >
        {React.Children.toArray(children).map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && split}
            {c}
          </React.Fragment>
        ))}
      </Flex>
    ),
  ),
  { Compact: Flex },
);
export const Row = ({ gutter, children, ...props }: UIProps) => (
  <Flex {...props} wrap gap={Array.isArray(gutter) ? gutter[0] : gutter}>
    {children}
  </Flex>
);
export const Col = ({ span = 24, offset = 0, style, ...props }: UIProps) => (
  <div
    {...props}
    style={{
      width: `${(span / 24) * 100}%`,
      marginLeft: `${(offset / 24) * 100}%`,
      ...style,
    }}
  />
);
export const Divider = ({
  type,
  children,
  dashed,
  orientation,
  className,
  style,
  ...props
}: UIProps) =>
  children ? (
    <div className={cx(css.divider, className)} style={style}>
      <span />
      {children}
      <span />
    </div>
  ) : (
    <Separator
      {...props}
      orientation={type === "vertical" ? "vertical" : "horizontal"}
      className={cx(css.separator, slots["beautify-divider"], className)}
      style={style}
    />
  );
export function Empty({
  description = "No data",
  image,
  children,
  className,
  style,
}: UIProps) {
  return (
    <div className={cx(css.empty, slots["beautify-empty"], className)} style={style}>
      {image && <div className={slots["beautify-empty-image"]}>{image}</div>}
      {description !== false && (
        <div className={slots["beautify-empty-description"]}>{description}</div>
      )}
      {children && <div className={slots["beautify-empty-footer"]}>{children}</div>}
    </div>
  );
}
Empty.PRESENTED_IMAGE_SIMPLE = null;
Empty.PRESENTED_IMAGE_DEFAULT = null;
export function Spin({
  spinning = true,
  tip,
  children,
  className,
  style,
  size,
}: UIProps) {
  return (
    <div
      className={cx(css.spinHost, slots["beautify-spin-nested-loading"], className)}
      style={style}
    >
      {spinning && (
        <div role="status" className={css.spinOverlay}>
          <span className={css.spinner} />
          {tip}
        </div>
      )}
      <div className={slots["beautify-spin-container"]} aria-busy={spinning}>
        {children}
      </div>
    </div>
  );
}
export const Skeleton = Object.assign(
  ({ loading = true, children, paragraph, active, ...props }: UIProps) =>
    loading ? (
      <div
        {...props}
        className={cx(css.skeleton, slots["beautify-skeleton"], props.className)}
        aria-label="Loading"
      >
        {Array.from({ length: paragraph?.rows ?? 3 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    ) : (
      children
    ),
  {
    Input: ({ style, ...props }: UIProps) => (
      <span
        {...props}
        className={css.skeleton}
        style={{ width: 120, height: 30, ...style }}
      />
    ),
    Button: ({ style, ...props }: UIProps) => (
      <span
        {...props}
        className={css.skeleton}
        style={{ width: 80, height: 30, ...style }}
      />
    ),
  },
);
const Text = forwardRef<HTMLElement, UIProps>(
  (
    {
      children,
      ellipsis,
      copyable,
      editable,
      type,
      strong,
      code,
      underline,
      delete: deleted,
      disabled,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const Tag = code ? "code" : strong ? "strong" : "span";
    return (
      <Tag
        {...props}
        ref={ref as any}
        title={
          typeof ellipsis === "object" && ellipsis.tooltip
            ? String(children)
            : props.title
        }
        className={cx(
          ellipsis && css.ellipsis,
          type && css[type as keyof typeof css],
          className,
        )}
        style={style}
      >
        {children}
      </Tag>
    );
  },
);
export const Typography = Object.assign(
  ({ children, ...props }: UIProps) => <div {...props}>{children}</div>,
  {
    Text,
    Paragraph: forwardRef<HTMLParagraphElement, UIProps>((props, ref) => (
      <p {...props} ref={ref}>
        <Text {...props} />
      </p>
    )),
    Title: ({ level = 1, ...props }: UIProps) =>
      React.createElement(`h${level}`, props),
    Link: forwardRef<HTMLAnchorElement, UIProps>((props, ref) => (
      <a {...props} ref={ref} />
    )),
  },
);
export const Tag = forwardRef<HTMLSpanElement, UIProps>(
  (
    {
      children,
      color,
      closable,
      onClose,
      icon,
      bordered = true,
      className,
      style,
      ...props
    },
    ref,
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(css.tag, slots["beautify-tag"], className)}
      style={{ color, ...style }}
    >
      {icon}
      {children}
      {closable && (
        <button type="button" aria-label="Remove tag" onClick={onClose}>
          ×
        </button>
      )}
    </span>
  ),
);
export const Badge = ({
  count,
  status,
  color,
  text,
  children,
  showZero,
  overflowCount = 99,
  className,
  style,
}: UIProps) => (
  <span className={cx(css.badge, slots["beautify-badge"], className)} style={style}>
    {children}
    {status ? (
      <span style={{ color }}>{text}</span>
    ) : (
      (count || showZero) && (
        <sup className={slots["beautify-badge-count"]}>
          {Number(count) > overflowCount ? `${overflowCount}+` : count}
        </sup>
      )
    )}
  </span>
);
export const Alert = ({
  message,
  description,
  type = "info",
  showIcon,
  icon,
  closable,
  onClose,
  action,
  className,
  style,
}: UIProps) => (
  <div
    role={type === "error" ? "alert" : "status"}
    className={cx(css.alert, slots["beautify-alert"], className)}
    style={style}
  >
    {showIcon && icon}
    <div>
      {message}
      {description && <div>{description}</div>}
    </div>
    {action}
    {closable && (
      <button type="button" onClick={onClose} aria-label="Close">
        ×
      </button>
    )}
  </div>
);
export function Progress({
  percent = 0,
  status,
  type,
  format,
  className,
  style,
}: UIProps) {
  return (
    <div className={cx(css.progress, className)} style={style}>
      <progress value={percent} max={100} aria-label={status ?? "Progress"} />
      {format ? format(percent) : `${Math.round(percent)}%`}
    </div>
  );
}
export const List = Object.assign(
  <T,>({
    dataSource = [],
    renderItem,
    header,
    footer,
    children,
    ...props
  }: UIProps & {
    dataSource?: T[];
    renderItem?: (item: T, index: number) => React.ReactNode;
  }) => (
    <div {...props}>
      {header}
      <ul>
        {children ??
          dataSource.map((item: any, index: number) => (
            <React.Fragment key={item.key ?? index}>
              {renderItem?.(item, index)}
            </React.Fragment>
          ))}
      </ul>
      {footer}
    </div>
  ),
  { Item: ({ children, ...props }: UIProps) => <li {...props}>{children}</li> },
);
export const DatePicker = ({
  value,
  onChange,
  format,
  showTime,
  ...props
}: UIProps) => (
  <input
    {...props}
    type={showTime ? "datetime-local" : "date"}
    value={
      value?.format?.(showTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD") ??
      value ??
      ""
    }
    onChange={async (e) => {
      const dayjs = (await import("dayjs")).default;
      onChange?.(e.target.value ? dayjs(e.target.value) : null, e.target.value);
    }}
  />
);
