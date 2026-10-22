import React, { cloneElement, useContext } from "react";
import { forwardRef } from "./forwardRef";
import RcForm, { Field, FieldContext, useForm, useWatch } from "rc-field-form";
import type { FormInstance, FormProps } from "rc-field-form";
import type { FieldProps } from "rc-field-form/es/Field";
import cx from "classnames";
import type { UIProps } from "./types";
import css from "./base.module.css";
function Item({
  children,
  label,
  noStyle,
  help,
  extra,
  required,
  tooltip,
  colon,
  labelCol,
  wrapperCol,
  className,
  style,
  validateStatus,
  ...props
}: Omit<FieldProps, "children"> &
  Omit<UIProps, "children"> & {
    children?: React.ReactNode | ((form: FormInstance) => React.ReactNode);
  }) {
  return (
    <Field {...props}>
      {(control, meta, form) => {
        let body =
          typeof children === "function"
            ? children(form)
            : React.isValidElement(children)
              ? cloneElement(children, {
                  ...control,
                  id:
                    control.id ?? (props.name ? String(props.name) : undefined),
                })
              : children;
        if (noStyle) {
          return body;
        }
        const errors = meta.errors;
        return (
          <div
            className={cx(css.formItem, "beautify-form-item", className)}
            style={style}
          >
            {label !== undefined && (
              <label
                className="beautify-form-item-label"
                htmlFor={props.name ? String(props.name) : undefined}
              >
                {required && <span aria-hidden="true">*</span>}
                {label}
              </label>
            )}
            <div className="beautify-form-item-control">
              {body}
              {(help || errors.length > 0) && (
                <div role="alert" className={css.error}>
                  {help ?? errors.join(", ")}
                </div>
              )}
              {extra}
            </div>
          </div>
        );
      }}
    </Field>
  );
}
const FormControl = forwardRef<FormInstance, FormProps & UIProps>(
  (
    {
      layout,
      colon,
      labelCol,
      wrapperCol,
      requiredMark,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <RcForm
      {...props}
      ref={ref}
      className={cx(
        css.form,
        "beautify-form",
        `beautify-form-${layout ?? "horizontal"}`,
        className,
      )}
    >
      {children}
    </RcForm>
  ),
);
export const Form = Object.assign(FormControl, {
  Item,
  List: RcForm.List,
  ErrorList: ({ errors = [] }: UIProps) => (
    <div role="alert" className={css.error}>
      {errors.join(", ")}
    </div>
  ),
  useForm,
  useWatch,
  useFormInstance: () => useContext(FieldContext),
  Provider: RcForm.FormProvider,
});
