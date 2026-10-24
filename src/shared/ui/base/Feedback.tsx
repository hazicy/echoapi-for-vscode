import slots from "@/shared/ui/base/slots.module.css";
import React, { useSyncExternalStore, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Toast } from "@base-ui/react/toast";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import { Button } from "./Controls";
import type {
  MessageInstance,
  NotificationInstance,
  ModalFuncProps,
  ModalHandle,
  ModalProps,
  ModalStaticFunctions,
  UIProps,
} from "./types";
import css from "./base.module.css";
const toastManager = Toast.createToastManager();
const toastKeys = new Map<React.Key, string>();
function showToast(
  type: string,
  body: any,
  duration = 3,
  onClose?: () => void,
) {
  const config =
    body && typeof body === "object" && !React.isValidElement(body)
      ? body
      : { content: body };
  const data = {
    title: config.message ?? config.content,
    description: config.description,
    type,
    timeout: (config.duration ?? duration) * 1000,
    onClose: () => {
      if (config.key !== undefined) {
        toastKeys.delete(config.key);
      }
      (config.onClose ?? onClose)?.();
    },
  };
  const old = toastKeys.get(config.key);
  const id = old
    ? (toastManager.update(old, data), old)
    : toastManager.add(data);
  if (config.key !== undefined) {
    toastKeys.set(config.key, id);
  }
  return () => {
    toastManager.close(id);
    if (config.key !== undefined) {
      toastKeys.delete(config.key);
    }
  };
}
export const message: MessageInstance = {
  success: (b, d, c) => showToast("success", b, d, c),
  error: (b, d, c) => showToast("error", b, d, c),
  warning: (b, d, c) => showToast("warning", b, d, c),
  info: (b, d, c) => showToast("info", b, d, c),
  loading: (b, d = 0, c) => showToast("loading", b, d, c),
  open: (c) => showToast(c.type ?? "info", c),
  destroy: (key) => {
    toastManager.close(key === undefined ? undefined : toastKeys.get(key));
    if (key === undefined) {
      toastKeys.clear();
    } else {
      toastKeys.delete(key);
    }
  },
};
export const notification: NotificationInstance = {
  success: (c) => {
    showToast("success", c);
  },
  error: (c) => {
    showToast("error", c);
  },
  info: (c) => {
    showToast("info", c);
  },
  warning: (c) => {
    showToast("warning", c);
  },
  open: (c) => {
    showToast(c.type ?? "info", c);
  },
  destroy: message.destroy,
};
function Toasts() {
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Portal>
      <Toast.Viewport className={css.toastViewport}>
        {toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast} className={css.toast}>
            <Toast.Content>
              <Toast.Title />
              <Toast.Description />
            </Toast.Content>
            <Toast.Close aria-label="Close">×</Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}
function ModalControl({
  open = false,
  title,
  children,
  footer,
  okText,
  cancelText,
  onOk,
  onCancel,
  confirmLoading,
  okCancel = true,
  closable = true,
  closeIcon,
  mask = true,
  maskClosable = false,
  keyboard = true,
  centered = true,
  width = 520,
  destroyOnClose,
  destroyOnHidden,
  forceRender,
  afterClose,
  afterOpenChange,
  focusTriggerAfterClose = true,
  styles,
  className,
  rootClassName,
  style,
  zIndex = 1100,
  okButtonProps,
  cancelButtonProps,
  wrapClassName,
  ...rest
}: ModalProps) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [visited, setVisited] = useState(open);
  React.useEffect(() => {
    if (open) {
      setVisited(true);
    }
  }, [open]);
  const cancel = (e?: any) => onCancel?.(e);
  const buttons = (
    <>
      {okCancel && (
        <Button {...cancelButtonProps} onClick={cancel}>
          {cancelText ?? t("base.cancel")}
        </Button>
      )}
      <Button
        type="primary"
        {...okButtonProps}
        loading={busy || confirmLoading}
        onClick={async (e) => {
          setBusy(true);
          try {
            await onOk?.(e);
          } finally {
            setBusy(false);
          }
        }}
      >
        {okText ?? t("base.confirm", "OK")}
      </Button>
    </>
  );
  return (
    <Dialog.Root
      open={open}
      modal={mask}
      disablePointerDismissal={!maskClosable}
      onOpenChange={(v, d) => {
        if (v) {
          return;
        }
        if (d.reason === "escape-key" && !keyboard) {
          d.cancel();
          return;
        }
        cancel(d.event);
      }}
      onOpenChangeComplete={(v) => {
        afterOpenChange?.(v);
        if (!v) {
          afterClose?.();
        }
      }}
    >
      <Dialog.Portal
        keepMounted={
          forceRender || (visited && !(destroyOnClose || destroyOnHidden))
        }
        className={cx(css.modalRoot, rootClassName, wrapClassName)}
        style={{ zIndex }}
      >
        {mask && (
          <Dialog.Backdrop className={css.modalMask} style={styles?.mask} />
        )}
        <Dialog.Popup
          aria-describedby={undefined}
          finalFocus={focusTriggerAfterClose}
          className={cx(css.modal, slots["beautify-modal-content"], className)}
          style={{
            width,
            maxWidth: "calc(100vw - 32px)",
            ...styles?.content,
            ...style,
          }}
        >
          {closable && (
            <Dialog.Close
              className={css.modalClose}
              aria-label={t("base.close")}
            >
              {closeIcon ?? "×"}
            </Dialog.Close>
          )}
          <Dialog.Title
            className={slots["beautify-modal-header"]}
            style={styles?.header}
          >
            {title ?? t("base.tip")}
          </Dialog.Title>
          <div className={slots["beautify-modal-body"]} style={styles?.body}>
            {children}
          </div>
          {footer !== null && (
            <div
              className={cx(css.actions, slots["beautify-modal-footer"])}
              style={styles?.footer}
            >
              {typeof footer === "function"
                ? footer(buttons, {
                    OkBtn: () => buttons,
                    CancelBtn: () => null,
                  })
                : (footer ?? buttons)}
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function createPool() {
  let entries: {
    id: number;
    config: ModalFuncProps;
    resolve: (confirmed: boolean) => void;
  }[] = [];
  let id = 0;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((l) => l());
  const remove = (key: number, confirmed = false) => {
    const entry = entries.find((e) => e.id === key);
    entries = entries.filter((e) => e.id !== key);
    entry?.resolve(confirmed);
    notify();
  };
  const confirm = (config: ModalFuncProps): ModalHandle => {
    const key = ++id;
    let resolve!: (confirmed: boolean) => void;
    const result = new Promise<boolean>((done) => {
      resolve = done;
    });
    entries = [...entries, { id: key, config, resolve }];
    notify();
    return {
      destroy: () => remove(key),
      update: (next) => {
        entries = entries.map((e) =>
          e.id === key ? { ...e, config: { ...e.config, ...next } } : e,
        );
        notify();
      },
      then: result.then.bind(result),
    };
  };
  const info = (config: ModalFuncProps) =>
    confirm({ okCancel: false, ...config });
  const api = {
    confirm,
    info,
    success: info,
    error: info,
    warning: info,
    warn: info,
  };
  return {
    api,
    subscribe: (f: () => void) => {
      listeners.add(f);
      return () => {
        listeners.delete(f);
      };
    },
    get: () => entries,
    remove,
  };
}
const pool = createPool();
export const modal = pool.api;
function ModalHost({
  source = pool,
}: {
  source?: ReturnType<typeof createPool>;
}) {
  const entries = useSyncExternalStore(
    source.subscribe,
    source.get,
    source.get,
  );
  return (
    <>
      {entries.map(({ id, config }) => (
        <ModalControl
          key={id}
          {...config}
          open
          onOk={async (e) => {
            const result = await config.onOk?.(e);
            if (result !== false) {
              source.remove(id, true);
            }
          }}
          onCancel={(e) => {
            config.onCancel?.(e);
            source.remove(id);
          }}
        >
          {config.content ?? config.children}
        </ModalControl>
      ))}
    </>
  );
}
function useModal(): [ModalStaticFunctions, React.ReactElement] {
  const [source] = useState(createPool);
  return [source.api, <ModalHost key="modal-holder" source={source} />];
}
export const Modal = Object.assign(ModalControl, {
  ...pool.api,
  useModal,
  destroyAll: () => pool.get().forEach((e) => pool.remove(e.id)),
});
export const App = Object.assign(
  ({ children, className, style }: UIProps) => (
    <Toast.Provider toastManager={toastManager}>
      <div
        className={cx(css.app, slots["beautify-app"], className)}
        style={style}
      >
        {children}
      </div>
      <Toasts />
      <ModalHost />
    </Toast.Provider>
  ),
  { useApp: () => ({ message, notification, modal: pool.api }) },
);
