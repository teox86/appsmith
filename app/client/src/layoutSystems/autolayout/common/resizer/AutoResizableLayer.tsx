import React from "react";

import WidgetFactory from "WidgetProvider/factory";
import { WIDGET_PADDING } from "constants/WidgetConstants";
import { ResizableComponent } from "layoutSystems/common/resizer/ResizableComponent";
import { isFunction } from "lodash";
import type { BaseWidgetProps } from "widgets/BaseWidgetHOC/withBaseWidgetHOC";

/**
 * AutoResizableLayer
 *
 * Component that renders ResizableComponent only when needed(ex: List widget child containers other than the first one and Skeleton widget) and
 * enhances properties of autoDimensions to be supplied for ResizableComponent.
 *
 */

export const AutoResizableLayer = (props: BaseWidgetProps) => {
  if (props.resizeDisabled || props.type === "SKELETON_WIDGET") {
    return props.children;
  }
  let autoDimensionConfig = WidgetFactory.getWidgetAutoLayoutConfig(
    props.type,
  ).autoDimension;
  if (isFunction(autoDimensionConfig)) {
    autoDimensionConfig = autoDimensionConfig(props);
  }
  return (
    <ResizableComponent
      {...props}
      hasAutoHeight={autoDimensionConfig?.height}
      hasAutoWidth={autoDimensionConfig?.width}
      paddingOffset={WIDGET_PADDING}
    >
      {props.children}
    </ResizableComponent>
  );
};
