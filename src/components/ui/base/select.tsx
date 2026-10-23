import slots from "@/components/ui/base/slots.module.css";
import { forwardRef } from "./forwardRef";
import React, { useMemo, useState } from "react";
import { Combobox } from "@base-ui/react/combobox";
import cx from "classnames";
import type { SelectProps, Option, UIProps } from "./types";
import css from "./base.module.css";
const scalar = (v: any) => (v && typeof v === "object" ? v.value : v);
const text = (v: any): string =>
  typeof v === "string" || typeof v === "number"
    ? String(v)
    : React.isValidElement<{ children?: any }>(v)
      ? text(v.props.children)
      : Array.isArray(v)
        ? v.map(text).join("")
        : "";
const SelectControl = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      options: rawOptions = [],
      children,
      value,
      defaultValue,
      onChange,
      onSelect,
      onDeselect,
      onSearch,
      mode,
      showSearch,
      allowClear,
      labelInValue,
      fieldNames,
      filterOption,
      optionFilterProp = "label",
      optionRender,
      labelRender,
      dropdownRender,
      popupRender,
      placeholder,
      disabled,
      className,
      rootClassName,
      style,
      placement,
      popupClassName,
      dropdownStyle,
      open,
      defaultOpen,
      onDropdownVisibleChange,
      onOpenChange,
      notFoundContent,
      size,
      bordered,
      variant,
      suffixIcon,
      removeIcon,
      maxTagCount,
      tagRender,
      tokenSeparators,
      autoClearSearchValue,
      loading,
      getPopupContainer,
      ...props
    },
    ref,
  ) => {
    const [search, setSearch] = useState("");
    const [internal, setInternal] = useState(defaultValue);
    const multiple = mode === "multiple" || mode === "tags";
    const options: Option[] = useMemo(
      () =>
        rawOptions.length
          ? rawOptions
              .flatMap((o) => o.options ?? [o])
              .map((o) => ({
                ...o,
                value: o[fieldNames?.value || "value"],
                label: o[fieldNames?.label || "label"],
              }))
          : React.Children.toArray(children)
              .filter(React.isValidElement)
              .flatMap((c: any) =>
                c.type === Select.OptGroup
                  ? React.Children.toArray(c.props.children)
                      .filter(React.isValidElement)
                      .map((o: any) => ({
                        ...o.props,
                        label: o.props.children,
                      }))
                  : [{ ...c.props, label: c.props.children }],
              ),
      [rawOptions, children, fieldNames],
    );
    const selected = value !== undefined ? value : internal;
    const values = multiple ? (selected ?? []) : selected;
    const current = (v: any) =>
      options.find((o) => o.value === scalar(v)) ?? {
        value: scalar(v),
        label: v?.label ?? scalar(v),
      };
    const selectedOptions = multiple
      ? values.map(current)
      : selected === undefined || selected === null
        ? null
        : current(selected);
    let filtered =
      filterOption === false
        ? options
        : options.filter((o) =>
            typeof filterOption === "function"
              ? filterOption(search, o)
              : text(o[optionFilterProp])
                  .toLowerCase()
                  .includes(search.toLowerCase()),
          );
    if (
      mode === "tags" &&
      search &&
      !options.some((o) => String(o.value) === search)
    ) {
      filtered = [...filtered, { label: search, value: search }];
    }
    const update = (next: any) => {
      const arr = multiple ? next : next ? [next] : [];
      const nextValue = multiple
        ? arr.map((o: any) =>
            labelInValue ? { value: o.value, label: o.label } : o.value,
          )
        : next
          ? labelInValue
            ? { value: next.value, label: next.label }
            : next.value
          : undefined;
      setInternal(nextValue);
      onChange?.(nextValue, multiple ? arr : next);
      for (const o of arr) {
        if (
          !(
            multiple
              ? (selectedOptions ?? [])
              : selectedOptions
                ? [selectedOptions]
                : []
          ).some((old: Option) => old.value === o.value)
        ) {
          onSelect?.(o.value, o);
        }
      }
      for (const o of multiple ? (selectedOptions ?? []) : []) {
        if (!arr.some((n: Option) => n.value === o.value)) {
          onDeselect?.(o.value, o);
        }
      }
      if (autoClearSearchValue !== false) {
        setSearch("");
      }
    };
    const list = (
      <Combobox.List className={slots["beautify-select-item-list"]}>
        {filtered.map((o, index) => (
          <Combobox.Item
            key={String(o.value)}
            value={o}
            disabled={o.disabled}
            className={cx(
              css.option,
              slots["beautify-select-item"],
              slots["beautify-select-item-option"],
            )}
          >
            <span className={slots["beautify-select-item-option-content"]}>
              {optionRender
                ? optionRender({ ...o, data: o }, { index })
                : o.label}
            </span>
            <Combobox.ItemIndicator className={css.itemIndicator}>
              ✓
            </Combobox.ItemIndicator>
          </Combobox.Item>
        ))}
        {!filtered.length && (
          <div className={css.option}>{notFoundContent ?? "No options"}</div>
        )}
      </Combobox.List>
    );
    const renderPopup = popupRender ?? dropdownRender;
    return (
      <Combobox.Root
        modal={false}
        items={filtered}
        filter={null}
        multiple={multiple}
        value={selectedOptions}
        onValueChange={update}
        inputValue={search}
        onInputValueChange={(s) => {
          if (
            mode === "tags" &&
            tokenSeparators?.some((separator: string) => s.includes(separator))
          ) {
            const parts: string[] = tokenSeparators.reduce(
              (parts: string[], separator: string) =>
                parts.flatMap((part) => part.split(separator)),
              [s],
            );
            const tags = parts.filter(Boolean).map((value) => current(value));
            update([
              ...(selectedOptions ?? []),
              ...tags.filter(
                (o) =>
                  !(selectedOptions ?? []).some(
                    (old: Option) => old.value === o.value,
                  ),
              ),
            ]);
            return;
          }
          setSearch(s);
          onSearch?.(s);
        }}
        itemToStringLabel={(o) => text(o.label)}
        itemToStringValue={(o) => String(o.value)}
        isItemEqualToValue={(a, b) => a.value === b.value}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(v) => {
          onDropdownVisibleChange?.(v);
          onOpenChange?.(v);
        }}
        disabled={disabled}
      >
        <div
          style={style}
          className={cx(
            css.select,
            (bordered === false || variant === 'borderless') && css.selectBorderless,
            slots["beautify-select"],
            multiple && slots["beautify-select-multiple"],
            className,
            rootClassName,
          )}
        >
          {multiple && (
            <Combobox.Chips className={css.chips}>
              {(selectedOptions ?? []).map((o: Option) => (
                <Combobox.Chip key={String(o.value)} className={css.chip}>
                  {o.label}
                  <Combobox.ChipRemove aria-label={`Remove ${text(o.label)}`}>
                    ×
                  </Combobox.ChipRemove>
                </Combobox.Chip>
              ))}
            </Combobox.Chips>
          )}
          {showSearch || multiple ? (
            <Combobox.Input
              {...props}
              ref={ref}
              placeholder={
                selectedOptions && !multiple
                  ? text(selectedOptions.label)
                  : placeholder
              }
              className={cx(
                css.selectInput,
                slots["beautify-select-selection-search-input"],
              )}
            />
          ) : (
            <Combobox.Trigger
              {...props}
              className={cx(css.selectTrigger, slots["beautify-select-selector"])}
            >
              <span className={slots["beautify-select-selection-item"]}>
                {selectedOptions
                  ? (labelRender?.({
                      label: selectedOptions.label,
                      value: selectedOptions.value,
                    }) ?? selectedOptions.label)
                  : placeholder}
              </span>
            </Combobox.Trigger>
          )}
          {allowClear && (
            <Combobox.Clear className={css.clear} aria-label="Clear selection">
              ×
            </Combobox.Clear>
          )}
          <Combobox.Trigger
            className={cx(css.selectArrow, slots["beautify-select-arrow"])}
            aria-label="Open options"
          >
            {loading ? "…" : (suffixIcon ?? "⌄")}
          </Combobox.Trigger>
        </div>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4} className={css.positioner}>
            <Combobox.Popup
              className={cx(
                css.popup,
                slots["beautify-select-dropdown"],
                popupClassName,
              )}
              style={dropdownStyle}
            >
              {renderPopup ? renderPopup(list) : list}
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    );
  },
);
export const Select = Object.assign(
  SelectControl as unknown as <V = any, O extends Option = Option>(
    props: SelectProps<V, O> & React.RefAttributes<HTMLInputElement>,
  ) => React.ReactElement,
  { Option: (_props: UIProps) => null, OptGroup: (_props: UIProps) => null },
);
export function AutoComplete({
  value,
  defaultValue,
  onChange,
  onSearch,
  onSelect,
  options = [],
  children,
  allowClear,
  placeholder,
  className,
  style,
  disabled,
  ...props
}: UIProps) {
  const [input, setInput] = useState(defaultValue ?? "");
  const current = value ?? input;
  return (
    <Combobox.Root
      modal={false}
      items={options}
      inputValue={current}
      onInputValueChange={(v) => {
        setInput(v);
        onChange?.(v);
        onSearch?.(v);
      }}
      onValueChange={(o: any) => {
        const v = o?.value ?? "";
        setInput(v);
        onChange?.(v);
        onSelect?.(v, o);
      }}
      itemToStringLabel={(o: any) => String(o.value ?? "")}
      disabled={disabled}
    >
      <div
        style={style}
        className={cx(css.select, slots["beautify-select"], className)}
      >
        <Combobox.Input
          {...props}
          placeholder={placeholder}
          className={css.input}
          render={
            React.isValidElement(children)
              ? (children as React.ReactElement)
              : undefined
          }
        />
        {allowClear && <Combobox.Clear aria-label="Clear">×</Combobox.Clear>}
      </div>
      <Combobox.Portal>
        <Combobox.Positioner className={css.positioner}>
          <Combobox.Popup className={css.popup}>
            <Combobox.List>
              {options.map((o: any) => (
                <Combobox.Item key={o.value} value={o} className={css.option}>
                  {o.label ?? o.value}
                </Combobox.Item>
              ))}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
