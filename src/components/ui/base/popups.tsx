import React, { useState } from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import cx from "classnames";
import { Button } from "./controls";
import type {
  TooltipProps,
  PopoverProps,
  DropdownProps,
  MenuProps,
  MenuItemProps,
  UIProps,
} from "./types";
import css from "./base.module.css";
const placement = (p = "top") => ({
  side: (p.startsWith("bottom")
    ? "bottom"
    : p.startsWith("left")
      ? "left"
      : p.startsWith("right")
        ? "right"
        : "top") as "top" | "bottom" | "left" | "right",
  align: (/Left|Top/.test(p)
    ? "start"
    : /Right|Bottom/.test(p)
      ? "end"
      : "center") as "start" | "end" | "center",
});
const node = (children: React.ReactNode) =>
  React.isValidElement(children) ? children : <span>{children}</span>;
const native = (children: React.ReactNode) =>
  React.isValidElement(children) && children.type === "button";
const content = (value: any) => (typeof value === "function" ? value() : value);
export function Tooltip({
  title,
  children,
  placement: position = "top",
  mouseEnterDelay = 0.5,
  mouseLeaveDelay = 0,
  open,
  defaultOpen,
  onOpenChange,
  overlayClassName,
  overlayStyle,
  overlayInnerStyle,
  destroyTooltipOnHide,
  color,
  trigger,
  ...rest
}: TooltipProps) {
  if (title === undefined || title === null || title === "") return children;
  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <BaseTooltip.Trigger
          render={node(children)}
          delay={mouseEnterDelay * 1000}
          closeDelay={mouseLeaveDelay * 1000}
          {...rest}
        />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner
            {...placement(position)}
            sideOffset={5}
            className={css.positioner}
            style={overlayStyle}
          >
            <BaseTooltip.Popup
              className={cx(css.tooltip, overlayClassName)}
              style={{ background: color, ...overlayInnerStyle }}
            >
              {content(title)}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
export function Popover({
  title,
  content: body,
  children,
  placement: position = "top",
  trigger = "hover",
  open,
  defaultOpen,
  onOpenChange,
  overlayClassName,
  overlayStyle,
  overlayInnerStyle,
  destroyTooltipOnHide = true,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  ...rest
}: PopoverProps) {
  const hover = (Array.isArray(trigger) ? trigger : [trigger]).includes(
    "hover",
  );
  return (
    <BasePopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <BasePopover.Trigger
        render={node(children)}
        nativeButton={native(children)}
        openOnHover={hover}
        delay={mouseEnterDelay * 1000}
        closeDelay={mouseLeaveDelay * 1000}
        {...rest}
      />
      <BasePopover.Portal keepMounted={!destroyTooltipOnHide}>
        <BasePopover.Positioner
          {...placement(position)}
          sideOffset={5}
          className={css.positioner}
          style={overlayStyle}
        >
          <BasePopover.Popup
            className={cx(
              css.popup,
              "beautify-popover-inner",
              overlayClassName,
            )}
            style={overlayInnerStyle}
          >
            {title && <BasePopover.Title>{content(title)}</BasePopover.Title>}
            {content(body)}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
function MenuItems({ items = [], onClick, selectedKeys = [] }: MenuProps) {
  return (
    <>
      {items.map((item, index) =>
        item?.type === "divider" ? (
          <BaseMenu.Separator key={index} className={css.separator} />
        ) : item?.type === "group" ? (
          <BaseMenu.Group key={String(item.key ?? index)}>
            <BaseMenu.GroupLabel className={css.menuGroup}>
              {item.label}
            </BaseMenu.GroupLabel>
            <MenuItems
              items={item.children ?? []}
              onClick={onClick}
              selectedKeys={selectedKeys}
            />
          </BaseMenu.Group>
        ) : item?.children ? (
          <BaseMenu.SubmenuRoot key={String(item.key ?? index)}>
            <BaseMenu.SubmenuTrigger
              className={cx(
                css.menuItem,
                "beautify-dropdown-menu-submenu",
                item.className,
              )}
              disabled={item.disabled}
            >
              {item.icon}
              {item.label}
              <span>›</span>
            </BaseMenu.SubmenuTrigger>
            <BaseMenu.Portal>
              <BaseMenu.Positioner className={css.positioner} sideOffset={2}>
                <BaseMenu.Popup
                  className={cx(css.popup, "beautify-dropdown-menu")}
                >
                  <MenuItems
                    items={item.children ?? []}
                    onClick={onClick}
                    selectedKeys={selectedKeys}
                  />
                </BaseMenu.Popup>
              </BaseMenu.Positioner>
            </BaseMenu.Portal>
          </BaseMenu.SubmenuRoot>
        ) : (
          <BaseMenu.Item
            key={String(item?.key ?? index)}
            disabled={item?.disabled}
            className={cx(
              css.menuItem,
              "beautify-dropdown-menu-item",
              selectedKeys.includes(String(item?.key)) &&
                "beautify-dropdown-menu-item-selected",
              item?.className,
            )}
            style={item?.style}
            onClick={(event) => {
              const info = {
                key: String(item?.key ?? index),
                keyPath: [String(item?.key ?? index)],
                domEvent: event,
              };
              item?.onClick?.(info);
              onClick?.(info);
            }}
          >
            {item?.icon}
            {item?.label ?? item?.children}
          </BaseMenu.Item>
        ),
      )}
    </>
  );
}
export function Dropdown({
  children,
  menu,
  open,
  defaultOpen,
  onOpenChange,
  trigger = ["hover"],
  placement: position = "bottomLeft",
  dropdownRender,
  popupRender,
  overlay,
  overlayClassName,
  overlayStyle,
  disabled,
  destroyPopupOnHide = true,
  ...rest
}: DropdownProps) {
  if (disabled) return children;
  const context = trigger.includes("contextMenu");
  const Root = context ? BaseContextMenu.Root : BaseMenu.Root;
  const body = (
    <BaseMenu.Popup
      className={cx(css.popup, "beautify-dropdown-menu", overlayClassName)}
      style={overlayStyle}
    >
      {overlay ?? <MenuItems {...menu} />}
    </BaseMenu.Popup>
  );
  return (
    <Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(v: boolean, d: { reason: string }) =>
        onOpenChange?.(v, {
          source: d.reason === "item-press" ? "menu" : "trigger",
        })
      }
    >
      {context ? (
        <BaseContextMenu.Trigger {...rest} render={node(children)} />
      ) : (
        <BaseMenu.Trigger
          {...rest}
          render={node(children)}
          nativeButton={native(children)}
          openOnHover={trigger.includes("hover")}
        />
      )}
      <BaseMenu.Portal keepMounted={!destroyPopupOnHide}>
        <BaseMenu.Positioner
          {...placement(position)}
          sideOffset={4}
          className={css.positioner}
        >
          {popupRender
            ? popupRender(body)
            : dropdownRender
              ? dropdownRender(body)
              : body}
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </Root>
  );
}
export function Menu({
  items = [],
  onClick,
  selectedKeys = [],
  className,
  ...props
}: MenuProps) {
  const [expanded, setExpanded] = useState<string[]>(
    props.defaultOpenKeys ?? [],
  );
  const render = (rows: MenuItemProps[]) => (
    <ul role="menu" className={cx(css.menu, "beautify-menu", className)}>
      {rows.map((item, index) => (
        <li key={String(item.key ?? index)} role="none">
          {item.type === "divider" ? (
            <hr />
          ) : (
            <button
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={cx(
                css.menuItem,
                "beautify-menu-item",
                selectedKeys.includes(String(item.key)) &&
                  "beautify-menu-item-selected",
              )}
              onClick={(e) => {
                if (item.children) {
                  setExpanded((v) =>
                    v.includes(String(item.key))
                      ? v.filter((k) => k !== String(item.key))
                      : [...v, String(item.key)],
                  );
                } else {
                  const info = {
                    key: String(item.key),
                    keyPath: [String(item.key)],
                    domEvent: e,
                  };
                  item.onClick?.(info);
                  onClick?.(info);
                }
              }}
            >
              {item.icon}
              {item.label}
            </button>
          )}
          {item.children &&
            expanded.includes(String(item.key)) &&
            render(item.children)}
        </li>
      ))}
    </ul>
  );
  return render(items ?? []);
}
export function Popconfirm({
  children,
  title,
  description,
  onConfirm,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  okButtonProps,
  cancelButtonProps,
  showCancel = true,
  open: controlled,
  onOpenChange,
  disabled,
  ...props
}: UIProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const change = (v: boolean) => {
    setOpen(v);
    onOpenChange?.(v);
  };
  if (disabled) return children;
  return (
    <Popover
      {...props}
      trigger="click"
      open={controlled ?? open}
      onOpenChange={change}
      title={title}
      content={
        <>
          <div>{description}</div>
          <div className={css.actions}>
            {showCancel && (
              <Button
                {...cancelButtonProps}
                onClick={(e) => {
                  onCancel?.(e);
                  change(false);
                }}
              >
                {cancelText}
              </Button>
            )}
            <Button
              type="primary"
              {...okButtonProps}
              loading={busy}
              onClick={async (e) => {
                setBusy(true);
                try {
                  await onConfirm?.(e);
                  change(false);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {okText}
            </Button>
          </div>
        </>
      }
    >
      {children}
    </Popover>
  );
}

Dropdown.Button = ({
  children,
  onClick,
  type,
  loading,
  disabled,
  ...props
}: DropdownProps) => (
  <div className={css.inputGroup}>
    <Button type={type} loading={loading} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
    <Dropdown {...props} disabled={disabled} trigger={["click"]}>
      <Button disabled={disabled} aria-label="More actions">
        ⌄
      </Button>
    </Dropdown>
  </div>
);
