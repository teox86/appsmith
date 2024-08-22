import React from "react";

import { PopoverPosition } from "@blueprintjs/core";
import {
  ControlWrapper,
  FieldWrapper,
} from "components/propertyControls/StyledControls";

import type { Setter } from "@appsmith/ads-old";
import { TreeDropdown } from "@appsmith/ads-old";

import type { SelectorViewProps } from "../../types";

export function SelectorView(props: SelectorViewProps) {
  return (
    <FieldWrapper className="selector-view">
      <ControlWrapper isAction key={props.label}>
        {props.label && (
          <label
            className="!text-gray-600 !text-xs"
            data-testid="selector-view-label"
          >
            {props.label}
          </label>
        )}
        <TreeDropdown
          defaultText={props.defaultText}
          displayValue={props.displayValue}
          getDefaults={props.getDefaults}
          menuWidth={256}
          modifiers={{
            preventOverflow: {
              boundariesElement: "viewport",
            },
            offset: {
              offset: "0, -8",
            },
            flip: {
              enabled: false,
            },
          }}
          onSelect={props.set as Setter}
          optionTree={props.options}
          position={PopoverPosition.BOTTOM}
          selectedLabelModifier={props.selectedLabelModifier}
          selectedValue={props.get(props.value, false) as string}
          usePortal={false}
        />
      </ControlWrapper>
    </FieldWrapper>
  );
}
