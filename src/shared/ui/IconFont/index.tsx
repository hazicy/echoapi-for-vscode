import slots from "@/shared/ui/base/slots.module.css";
import { forwardRef, useEffect } from "react";
import type { HTMLAttributes } from "react";
import css from "./IconFont.module.css";
const loaded = new Set<string>();
const IconFont = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement> & {
    type: string;
    rotate?: number;
    spin?: boolean;
  }
>(({ type, rotate, spin, style, className, ...props }, ref) => {
  useEffect(() => {
    const src = `${window.resourceBaseUrl || ""}/fonts/iconfont.js`;
    if (loaded.has(src)) {return;}
    loaded.add(src);
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = () => {
      loaded.delete(src);
    };
    document.head.appendChild(script);
  }, []);
  return (
    <span
      {...props}
      ref={ref}
      className={[slots.anticon, css.icon, spin && css.spin, className]
        .filter(Boolean)
        .join(" ")}
      style={{
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...style,
      }}
    >
      {["icon-logo-primary", "icon-logo", "icon-zanwu"].includes(type) ? (
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 96 96"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M63.799 28.201a28 28 0 1 0 0 39.598"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="80" cy="48" r="5" fill="currentColor" />
        </svg>
      ) : (
        <svg width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <use href={`#${type}`} />
        </svg>
      )}
    </span>
  );
});
export default IconFont;
