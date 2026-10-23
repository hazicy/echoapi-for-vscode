import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, memo, useMemo } from "react";

import cn from "classnames";

import IconFont from "@/shared/ui/IconFont";
import { REQUEST_METHOD_MAP } from "@/features/requests/constants";

import { isString } from "lodash";

interface Props {
  type: string;
  method?: string;
  wrapClassName?: string;
  style?: React.CSSProperties;
}

const PrefixIcon: FC<Props> = memo(
  ({ type, method, wrapClassName = "", style = {} }) => {
    const computed = useMemo(() => {
      const typeMap: {
        [key: string]: { icon: string | React.ReactNode; className: string };
      } = {
        sse: { icon: "SSE", className: slots.sse },
        doc: { icon: "MD", className: slots.doc },
        folder: { icon: "", className: "icon-home" },
        websocket: { icon: "WS", className: slots.ws },
        websocket2: { icon: "WS", className: slots.ws },
        socketio: { icon: "IO", className: slots.io },
        grpc: { icon: "GRPC", className: slots.grpc },
        graphql: { icon: "GQL", className: slots.gql },
        socket_method: { icon: "TCP", className: slots["socket-service"] },
        socket: { icon: <IconFont type="icon-tcp" />, className: slots.socket },
        note: { icon: <IconFont type="icon-note" />, className: slots.notes },
        testing: {
          icon: <IconFont type="icon-testing-case" />,
          className: slots.testing,
        },
        kit: {
          icon: <IconFont type="icon-testing-suite" />,
          className: slots.kit,
        },
        model: {
          icon: <IconFont type="icon-data-model" />,
          className: slots["data-model"],
        },
        sample: {
          icon: <IconFont type="icon-api-sample" />,
          className: slots["api-sample"],
        },
      };

      if (method) {
        typeMap.api = {
          icon: REQUEST_METHOD_MAP?.[method] || method,
          className: REQUEST_METHOD_MAP?.[method]
            ? slots[method.toLowerCase()]
            : slots.DEFAULT,
        };
      }

      return typeMap[type];
    }, [type, method]);

    const renderIcon = (icon: any) => {
      if (isString(icon) && icon.length > 4) {
        return icon.substring(0, 4);
      }
      return icon;
    };

    return (
      <>
        {(computed?.icon && (
          <div
            style={style}
            className={cn(
              styles.container,
              cn(computed?.className, wrapClassName),
            )}
          >
            {renderIcon(computed?.icon)}
          </div>
        )) ||
          null}
      </>
    );
  },
);

export default PrefixIcon;
