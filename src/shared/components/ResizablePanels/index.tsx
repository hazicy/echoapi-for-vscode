import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
  PanelGroupProps,
  PanelProps,
  PanelResizeHandle,
  PanelResizeHandleProps,
} from "react-resizable-panels";

import { Flex } from "@/shared/ui/base";

import { useSafeState } from "ahooks";
import cn from "classnames";
import { isEqual, omit } from "lodash";

import IconFont from "@/shared/ui/IconFont";
import { STATUS_CODE } from "@/shared/constants/common";

import { useSystemConfig } from "@/app/store";
import { DirectionType } from "@/shared/types/common";

const defaultPanelProps = { defaultSize: 50, minSize: 5 };

type FinalPanelProps = PanelProps & {
  collapseTitle?: string;
};

type Props = {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  leftPanelProps?: FinalPanelProps;
  rightPanelProps?: FinalPanelProps;
  panelGroupProps?: PanelGroupProps;
  panelResizeHandleProps?: PanelResizeHandleProps;
  showDirectionBtn?: boolean;
  showRightCollapseBtn?: boolean;
  showStaticHandleBorder?: boolean;
  onDirectionChange?: (direction: DirectionType) => void;
};

const ResizablePanels = forwardRef((props: Props, ref) => {
  const {
    leftPanel,
    rightPanel,
    panelGroupProps = { direction: "horizontal" },
    leftPanelProps = { ...defaultPanelProps },
    rightPanelProps = { ...defaultPanelProps },
    panelResizeHandleProps,
    showDirectionBtn = false,
    showRightCollapseBtn = false,
    showStaticHandleBorder = true,
    onDirectionChange,
  } = props;

  const systemConfigTabDirection = useSystemConfig(
    (state) => state.systemConfig?.tab_direction,
  );
  const language = useSystemConfig((state) => state.systemConfig?.language);

  const [direction, setDirection] = useSafeState<DirectionType>(
    panelGroupProps.direction,
  );
  const [collapse, setCollapse] = useSafeState<{
    left: boolean;
    right: boolean;
  }>({
    left: false,
    right: false,
  });

  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  const isHorizontal = isEqual(direction, "horizontal");
  const isVertical = isEqual(direction, "vertical");

  useEffect(() => {
    panelGroupProps.direction && setDirection(panelGroupProps.direction);
  }, [panelGroupProps.direction]);

  // Watch system config for split-screen direction changes
  useEffect(() => {
    if (!showDirectionBtn || !systemConfigTabDirection) return;

    const _direction = isEqual(systemConfigTabDirection, STATUS_CODE.ENABLE)
      ? "vertical"
      : "horizontal";

    setDirection(_direction);
    onDirectionChange?.(_direction);
  }, [systemConfigTabDirection, showDirectionBtn]);

  useImperativeHandle(ref, () => ({
    setPanelGroupLayout,
    resetLayout,
  }));

  const setPanelGroupLayout = (layout: number[]) => {
    panelGroupRef.current?.setLayout(layout);
  };

  const resetLayout = () => {
    setPanelGroupLayout([50, 50]);
  };

  const handleCollapse = (position: "left" | "right", value: boolean) => {
    setCollapse((prev) => ({ ...prev, [position]: value }));
  };

  const handleRightCollapseWithOne = () => {
    const size = rightPanelProps.collapsedSize || defaultPanelProps.minSize;
    setPanelGroupLayout([100 - size, size]);
  };

  const leftCollapse = (
    <div className={slots["left-collapse-wrap"]} onClick={resetLayout}>
      <Flex vertical={isHorizontal} justify="center" align="center">
        <IconFont type="icon-left-folding" rotate={isVertical ? 270 : 180} />
        <span
          className={cn(
            slots["collapse-title"],
            slots[direction],
            language === "en" && slots.noSpacing,
          )}
        >
          {leftPanelProps?.collapseTitle || ""}
        </span>
      </Flex>
    </div>
  );

  const rightCollapse = (
    <div className={slots["right-collapse-wrap"]} onClick={resetLayout}>
      <Flex vertical={isHorizontal} justify="center" align="center">
        <IconFont type="icon-left-folding" rotate={isVertical ? 90 : 0} />
        <span
          className={cn(
            slots["collapse-title"],
            slots[direction],
            language === "en" && slots.noSpacing,
          )}
        >
          {rightPanelProps?.collapseTitle || ""}
        </span>
      </Flex>
    </div>
  );

  return (
    <div className={styles.container}>
      <PanelGroup
        {...panelGroupProps}
        direction={direction}
        ref={panelGroupRef}
      >
        {/* left and top panel */}
        <Panel
          onCollapse={() => handleCollapse("left", true)}
          onExpand={() => handleCollapse("left", false)}
          {...omit(leftPanelProps, ["collapseTitle"])}
          className={cn(
            slots["resizable-panel-left-wrap"],
            leftPanelProps?.className,
          )}
        >
          {!collapse.left ? leftPanel : leftCollapse}
        </Panel>
        {/* bar */}
        <div
          className={cn(
            slots["resizable-panel-handle"],
            slots[direction],
            panelResizeHandleProps?.className,
            {
              [slots["static-handle-border"]]: showStaticHandleBorder,
            },
          )}
        >
          <PanelResizeHandle
            {...panelResizeHandleProps}
            className={slots["resizable-bar"]}
          />
          {/* Collapse to one side */}
          {showRightCollapseBtn && !collapse.right && (
            <div
              className={slots["right-collapse-btn"]}
              onClick={handleRightCollapseWithOne}
            >
              <IconFont type="icon-drop-down" rotate={isHorizontal ? -90 : 0} />
            </div>
          )}
        </div>
        {/* right and bottom panel */}
        <Panel
          onCollapse={() => handleCollapse("right", true)}
          onExpand={() => handleCollapse("right", false)}
          {...omit(rightPanelProps, ["collapseTitle"])}
          // NOTE: The width property here is only to fix a flex layout bug
          style={isHorizontal ? { ...rightPanelProps.style, width: 0 } : {}}
          className={cn(
            slots["resizable-panel-right-wrap"],
            rightPanelProps?.className,
          )}
        >
          {!collapse.right ? rightPanel : rightCollapse}
        </Panel>
      </PanelGroup>
    </div>
  );
});

export default ResizablePanels;
