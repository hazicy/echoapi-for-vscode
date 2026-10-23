import slots from "@/components/ui/base/slots.module.css";
import { moduleClassNames } from "@/components/ui/base/moduleClassNames";
import { forwardRef } from "./forwardRef";
import React, {
  createContext,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { Input as BaseInput } from "@base-ui/react/input";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { NumberField } from "@base-ui/react/number-field";
import { Accordion } from "@base-ui/react/accordion";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import cx from "classnames";
import type {
  ButtonProps,
  InputProps,
  InputRef,
  TextAreaProps,
  CheckboxProps,
  SwitchProps,
  RadioGroupProps,
  RadioProps,
  InputNumberProps,
  CollapseProps,
  TabsProps,
  UIProps,
  SegmentedProps,
} from "./types";
import css from "./base.module.css";
const eventFor = (value: any, checked: boolean, event: Event) => ({
  target: { value, checked },
  nativeEvent: event,
  stopPropagation: () => event.stopPropagation(),
  preventDefault: () => event.preventDefault(),
});
export const Button = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      type = "default",
      htmlType = "button",
      size = "middle",
      loading = false,
      icon,
      children,
      className,
      rootClassName,
      danger,
      ghost,
      block,
      shape,
      ...props
    },
    ref,
  ) => (
    <BaseButton
      {...props}
      ref={ref}
      type={htmlType}
      disabled={props.disabled || !!loading}
      className={cx(
        css.button,
        slots["beautify-btn"],
        moduleClassNames(slots, `beautify-btn-${type}`),
        size === "small"
          ? slots["beautify-btn-sm"]
          : size === "large"
            ? slots["beautify-btn-lg"]
            : undefined,
        className,
        rootClassName,
        { [css.danger]: danger, [css.block]: block, [css.ghost]: ghost },
      )}
    >
      {loading ? (
        <span className={css.spinner} aria-label="Loading" />
      ) : (
        icon && <span className={slots["beautify-btn-icon"]}>{icon}</span>
      )}
      {children}
    </BaseButton>
  ),
);
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ onPressEnter, autoSize, rootClassName, className, ...props }, ref) => (
    <textarea
      {...props}
      ref={ref}
      rows={props.rows ?? autoSize?.minRows ?? 2}
      className={cx(css.input, slots["beautify-input"], className, rootClassName)}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (event.key === "Enter") {
          onPressEnter?.(event);
        }
      }}
    />
  ),
);
const InputControl = forwardRef<InputRef, InputProps>(
  (
    {
      prefix,
      suffix,
      addonBefore,
      addonAfter,
      allowClear,
      onPressEnter,
      rootClassName,
      className,
      bordered = true,
      status,
      variant,
      size,
      style,
      ...props
    },
    ref,
  ) => {
    const input = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      input: input.current,
      focus: (options) => input.current?.focus(options),
      blur: () => input.current?.blur(),
      select: () => input.current?.select(),
    }));
    const field = (
      <BaseInput
        {...props}
        ref={input}
        style={!(addonBefore || addonAfter || prefix || suffix || allowClear) ? style : undefined}
        className={cx(
          css.input,
          slots["beautify-input"],
          bordered && variant !== "borderless" && slots["beautify-input-outlined"],
          !prefix && !suffix && !allowClear && className,
          { [css.borderless]: !bordered || variant === "borderless" },
        )}
        onKeyDown={(e) => {
          props.onKeyDown?.(e);
          if (e.key === "Enter") {
            onPressEnter?.(e);
          }
        }}
      />
    );
    return addonBefore || addonAfter || prefix || suffix || allowClear ? (
      <span
        className={cx(
          css.inputGroup,
          css.affix,
          slots["beautify-input-affix-wrapper"],
          className,
          rootClassName,
        )}
        style={style}
      >
        {addonBefore}
        {prefix}
        {field}
        {allowClear && props.value && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              const setter = Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                "value",
              )?.set;
              setter?.call(input.current, "");
              input.current?.dispatchEvent(
                new Event("input", { bubbles: true }),
              );
            }}
          >
            ×
          </button>
        )}
        {suffix}
        {addonAfter}
      </span>
    ) : (
      field
    );
  },
);
export const Input = Object.assign(InputControl, {
  TextArea,
  Password: forwardRef<InputRef, InputProps>((props, ref) => (
    <InputControl {...props} ref={ref} type="password" />
  )),
  Search: forwardRef<InputRef, InputProps>(({ onSearch, ...props }, ref) => (
    <InputControl
      {...props}
      ref={ref}
      onPressEnter={(e) => {
        props.onPressEnter?.(e);
        onSearch?.(e.currentTarget.value, e);
      }}
    />
  )),
});
const CheckboxControl = forwardRef<HTMLElement, CheckboxProps>(
  (
    {
      children,
      onChange,
      value,
      className,
      rootClassName,
      indeterminate,
      ...props
    },
    ref,
  ) => (
    <label
      className={cx(
        css.checkLabel,
        slots["beautify-checkbox-wrapper"],
        className,
        rootClassName,
      )}
    >
      <BaseCheckbox.Root
        {...props}
        ref={ref}
        indeterminate={indeterminate}
        className={cx(css.checkbox, slots["beautify-checkbox"])}
        onCheckedChange={(checked, details) =>
          onChange?.(eventFor(value, checked, details.event))
        }
      >
        <BaseCheckbox.Indicator className={slots["beautify-checkbox-inner"]}>
          {indeterminate ? "−" : "✓"}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {children}
    </label>
  ),
);
function CheckboxGroup({
  options = [],
  value,
  defaultValue = [],
  onChange,
  children,
  ...props
}: UIProps) {
  const [internal, set] = useState(defaultValue);
  const selected = value ?? internal;
  return (
    <div
      {...props}
      className={cx(css.flex, props.className, slots["beautify-checkbox-group"])}
    >
      {children ??
        options.map((raw: any) => {
          const option =
            typeof raw === "object" ? raw : { value: raw, label: raw };
          return (
            <CheckboxControl
              key={option.value}
              checked={selected.includes(option.value)}
              disabled={option.disabled || props.disabled}
              onChange={(e) => {
                const next = e.target.checked
                  ? [...selected, option.value]
                  : selected.filter((v: any) => v !== option.value);
                set(next);
                onChange?.(next);
              }}
            >
              {option.label}
            </CheckboxControl>
          );
        })}
    </div>
  );
}
export const Checkbox = Object.assign(CheckboxControl, {
  Group: CheckboxGroup,
});
export const Switch = forwardRef<HTMLElement, SwitchProps>(
  (
    {
      onChange,
      checkedChildren,
      unCheckedChildren,
      loading,
      className,
      rootClassName,
      ...props
    },
    ref,
  ) => (
    <BaseSwitch.Root
      {...props}
      ref={ref}
      disabled={props.disabled || loading}
      className={cx(css.switch, slots["beautify-switch"], className, rootClassName)}
      onCheckedChange={(checked, details) => onChange?.(checked, details.event)}
    >
      <span>{props.checked ? checkedChildren : unCheckedChildren}</span>
      <BaseSwitch.Thumb className={css.thumb} />
    </BaseSwitch.Root>
  ),
);
const RadioContext = createContext(false);
const RadioControl = forwardRef<HTMLElement, RadioProps>(
  (
    {
      children,
      className,
      rootClassName,
      onChange,
      checked,
      defaultChecked,
      value = true,
      ...props
    },
    ref,
  ) => {
    const grouped = useContext(RadioContext);
    const radio = (
      <BaseRadio.Root
        {...props}
        value={value}
        ref={ref}
        className={cx(css.radio, slots["beautify-radio"])}
        onClick={(e) => {
          props.onClick?.(e);
          onChange?.(eventFor(value, true, e.nativeEvent));
        }}
      >
        <BaseRadio.Indicator className={slots["beautify-radio-inner"]} />
      </BaseRadio.Root>
    );
    return (
      <label
        className={cx(
          css.checkLabel,
          slots["beautify-radio-wrapper"],
          className,
          rootClassName,
        )}
      >
        {grouped ? (
          radio
        ) : (
          <RadioGroup
            value={checked === undefined ? undefined : checked ? value : null}
            defaultValue={defaultChecked ? value : null}
          >
            {radio}
          </RadioGroup>
        )}
        {children}
      </label>
    );
  },
);
const Group = ({
  options,
  children,
  onChange,
  optionType,
  buttonStyle,
  className,
  rootClassName,
  ...props
}: RadioGroupProps) => (
  <RadioContext.Provider value={true}>
    <RadioGroup
      {...props}
      className={cx(css.flex, slots["beautify-radio-group"], className, rootClassName)}
      onValueChange={(value, details) =>
        onChange?.(eventFor(value, true, details.event))
      }
    >
      {options
        ? options.map((raw: any) => {
            const o =
              typeof raw === "object" ? raw : { label: raw, value: raw };
            return (
              <RadioControl
                key={o.value}
                value={o.value}
                disabled={o.disabled || props.disabled}
              >
                {o.label}
              </RadioControl>
            );
          })
        : children}
    </RadioGroup>
  </RadioContext.Provider>
);
export const Radio = Object.assign(RadioControl, {
  Group,
  Button: RadioControl,
});
export const InputNumber = forwardRef<HTMLDivElement, InputNumberProps>(
  (
    {
      onChange,
      className,
      rootClassName,
      controls,
      precision,
      formatter,
      parser,
      stringMode,
      ...props
    },
    ref,
  ) => (
    <NumberField.Root
      {...props}
      ref={ref}
      className={cx(
        css.number,
        slots["beautify-input-number"],
        className,
        rootClassName,
      )}
      onValueChange={(value) =>
        onChange?.(
          stringMode && value !== null ? (String(value) as never) : value,
        )
      }
    >
      <NumberField.Group className={css.inputGroup}>
        <NumberField.Input
          className={css.input}
          aria-label={props["aria-label"]}
          placeholder={props.placeholder}
        />
        {controls !== false && (
          <span className={css.steppers}>
            <NumberField.Increment aria-label="Increase">
              +
            </NumberField.Increment>
            <NumberField.Decrement aria-label="Decrease">
              −
            </NumberField.Decrement>
          </span>
        )}
      </NumberField.Group>
    </NumberField.Root>
  ),
);
const array = (v: any) =>
  v === undefined ? undefined : Array.isArray(v) ? v : [v];
export function Collapse({
  items = [],
  activeKey,
  defaultActiveKey,
  accordion,
  onChange,
  expandIcon,
  expandIconPosition,
  ghost,
  bordered = true,
  destroyInactivePanel,
  className,
  rootClassName,
  ...props
}: CollapseProps) {
  return (
    <Accordion.Root
      {...props}
      className={cx(
        css.collapse,
        slots["beautify-collapse"],
        className,
        rootClassName,
      )}
      value={array(activeKey)}
      defaultValue={array(defaultActiveKey)}
      multiple={!accordion}
      onValueChange={(v) => onChange?.(accordion ? v[0] : v)}
    >
      {items.map((item) => (
        <Accordion.Item
          key={String(item.key)}
          value={item.key}
          disabled={item.collapsible === "disabled"}
          className={cx(
            css.collapseItem,
            slots["beautify-collapse-item"],
            item.className,
          )}
          style={item.style}
        >
          <Accordion.Header className={slots["beautify-collapse-header"]}>
            <Accordion.Trigger
              className={cx(
                css.collapseTrigger,
                slots["beautify-collapse-header-text"],
              )}
            >
              {item.label}
            </Accordion.Trigger>
            {item.extra}
          </Accordion.Header>
          <Accordion.Panel
            keepMounted={!destroyInactivePanel && !item.destroyOnHidden}
            className={cx(css.collapsePanel, slots["beautify-collapse-content"])}
          >
            <div className={slots["beautify-collapse-content-box"]}>{item.children}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
export function Tabs({
  items = [],
  activeKey,
  defaultActiveKey,
  onChange,
  onEdit,
  tabBarExtraContent,
  type,
  destroyInactiveTabPane,
  tabPosition,
  size,
  animated,
  className,
  rootClassName,
  ...props
}: TabsProps) {
  const [selected, setSelected] = useState(defaultActiveKey ?? items[0]?.key);
  const current = activeKey ?? selected;
  return (
    <BaseTabs.Root
      {...props}
      value={current}
      onValueChange={(key) => {
        setSelected(String(key));
        onChange?.(String(key));
      }}
      className={cx(
        css.tabs,
        slots["beautify-tabs"],
        moduleClassNames(slots, `beautify-tabs-${tabPosition || "top"}`),
        className,
        rootClassName,
      )}
    >
      <div className={slots["beautify-tabs-nav"]}>
        {tabBarExtraContent &&
        !React.isValidElement(tabBarExtraContent) &&
        typeof tabBarExtraContent === "object"
          ? tabBarExtraContent.left
          : null}
        <div className={slots["beautify-tabs-nav-wrap"]}>
          <BaseTabs.List className={cx(css.tabList, slots["beautify-tabs-nav-list"])}>
            {items.map((item) => (
              <span
                key={item.key}
                className={cx(
                  slots["beautify-tabs-tab"],
                  current === item.key && slots["beautify-tabs-tab-active"],
                )}
              >
                <BaseTabs.Tab
                  value={item.key}
                  disabled={item.disabled}
                  className={css.tab}
                >
                  {item.label}
                </BaseTabs.Tab>
                {type === "editable-card" && item.closable !== false && (
                  <button
                    type="button"
                    aria-label="Close tab"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(item.key, "remove");
                    }}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </BaseTabs.List>
        </div>
        {tabBarExtraContent &&
        !React.isValidElement(tabBarExtraContent) &&
        typeof tabBarExtraContent === "object"
          ? tabBarExtraContent.right
          : tabBarExtraContent}
      </div>
      <div className={slots["beautify-tabs-content-holder"]}>
        <div className={slots["beautify-tabs-content"]}>
          {items.map((item) => (
            <BaseTabs.Panel
              key={item.key}
              value={item.key}
              keepMounted={!destroyInactiveTabPane && !item.destroyOnHidden}
              className={cx(css.tabPanel, slots["beautify-tabs-tabpane"])}
            >
              {item.children}
            </BaseTabs.Panel>
          ))}
        </div>
      </div>
    </BaseTabs.Root>
  );
}
export function Segmented<V extends string | number = string | number>({
  options = [],
  value,
  defaultValue,
  onChange,
  className,
  ...props
}: SegmentedProps<V>) {
  return (
    <BaseTabs.Root
      {...props}
      value={value}
      defaultValue={
        defaultValue ??
        (typeof options[0] === "object"
          ? (options[0] as any).value
          : options[0])
      }
      onValueChange={(v) => onChange?.(v as V)}
      className={cx(css.segmented, slots["beautify-segmented"], className)}
    >
      <BaseTabs.List className={cx(css.tabList, slots["beautify-segmented-group"])}>
        {options.map((raw: any) => {
          const o = typeof raw === "object" ? raw : { value: raw, label: raw };
          return (
            <BaseTabs.Tab
              key={o.value}
              value={o.value}
              disabled={o.disabled}
              className={(state) =>
                cx(
                  css.tab,
                  "beautify-segmented-item",
                  state.active && "beautify-segmented-item-selected",
                )
              }
            >
              <span className={slots["beautify-segmented-item-label"]}>
                {o.icon}
                {o.label}
              </span>
            </BaseTabs.Tab>
          );
        })}
      </BaseTabs.List>
    </BaseTabs.Root>
  );
}
