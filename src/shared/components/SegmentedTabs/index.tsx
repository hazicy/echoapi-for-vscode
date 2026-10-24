import styles from "./style.module.css";
import classNames from "classnames";
import slots from "@/shared/ui/base/slots.module.css";
import {
  FC,
  forwardRef,
  FunctionComponent,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
} from "react";

import { Flex, Segmented, SegmentedProps } from "@/shared/ui/base";

import { useSafeState } from "ahooks";
import { isEqual, map } from "lodash";

type Props = SegmentedProps & {
  ref?: Ref<HTMLDivElement> | undefined;
  options: Array<{
    label: string | ReactNode;
    value: string;
    children: FunctionComponent | ReactNode | any;
  }>;
  tabBarExtraContent?: ReactNode;
  destroyInactiveTabs?: boolean;
  wrapClassName?: string;
};

const SegmentedTabs: FC<Props> = forwardRef(
  (
    {
      options,
      onChange,
      value,
      tabBarExtraContent,
      destroyInactiveTabs = false,
      wrapClassName,
      ...resetProps
    },
    ref: any,
  ) => {
    const [tabValue, setTabValue] = useSafeState<string | number>();
    const [renderChildrenMap, setRenderChildrenMap] = useSafeState<
      Record<string, boolean>
    >({
      [value as string]: true,
    });

    useEffect(() => {
      if (isEqual(value, tabValue)) {return;}

      setTabValue(value);

      setRenderChildrenMap({
        ...(!destroyInactiveTabs ? renderChildrenMap : {}),
        [value as string]: true,
      });
    }, [
      value,
      tabValue,
      destroyInactiveTabs,
      setTabValue,
      setRenderChildrenMap,
      renderChildrenMap,
    ]);

    const handleTabValueChange: SegmentedProps["onChange"] = (value) => {
      // Trigger external change event
      onChange?.(value);
      setTabValue(value);
      setRenderChildrenMap({
        ...(!destroyInactiveTabs ? renderChildrenMap : {}),
        [value]: true,
      });
    };

    useImperativeHandle(ref, () => {
      return {
        handleTabValueChange,
      };
    });

    const mergeValue = value || tabValue;

    return (
      <Flex vertical className={classNames(styles.container, wrapClassName)}>
        <header className={slots["segmented-tabs-header"]}>
          <Flex align="center" style={{ width: "100%" }}>
            <Segmented
              options={options}
              value={mergeValue}
              onChange={handleTabValueChange}
              {...resetProps}
            />
            {tabBarExtraContent && (
              <div
                className={slots["tab-bar-extra-content-wrap"]}
                style={{
                  marginInlineStart: "auto",
                  flex: "0 0 auto",
                  overflow: "visible",
                }}
              >
                {tabBarExtraContent}
              </div>
            )}
          </Flex>
        </header>
        <main className={slots["segmented-tabs-content"]}>
          {map(
            options,
            (item) =>
              renderChildrenMap[item.value] && (
                <div
                  hidden={mergeValue !== item.value}
                  className={slots["segmented-tabs-content-item"]}
                  key={item.value}
                >
                  {typeof item.children === "function" ? (
                    <item.children
                      key={item.value}
                      segmentedValue={mergeValue}
                      onChange={handleTabValueChange}
                    />
                  ) : (
                    item.children
                  )}
                </div>
              ),
          )}
        </main>
      </Flex>
    );
  },
);

export default SegmentedTabs;
