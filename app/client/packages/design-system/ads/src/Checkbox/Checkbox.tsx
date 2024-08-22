import React from "react";

import { useCheckbox } from "@react-aria/checkbox";
import { useFocusRing } from "@react-aria/focus";
import { useToggleState } from "@react-stately/toggle";
import clsx from "classnames";

import {
  CheckboxClassName,
  CheckboxClassNameSquare,
} from "./Checkbox.constants";
import { StyledCheckbox } from "./Checkbox.styles";
import type { CheckboxProps } from "./Checkbox.types";

function Checkbox(props: CheckboxProps) {
  const { children, className, isDisabled, isIndeterminate } = props;
  const state = useToggleState(props);
  const ref = React.useRef(null);
  const { inputProps } = useCheckbox(props, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <StyledCheckbox
      className={clsx(CheckboxClassName, className)}
      data-checked={state.isSelected}
      isChecked={state.isSelected}
      isDisabled={isDisabled}
      isFocusVisible={isFocusVisible}
      isIndeterminate={isIndeterminate}
    >
      {children}
      <input {...inputProps} {...focusProps} ref={ref} />
      <span className={CheckboxClassNameSquare} />
    </StyledCheckbox>
  );
}

Checkbox.displayName = "Checkbox";

Checkbox.defaultProps = {
  isIndeterminate: false,
  isDisabled: false,
};

export { Checkbox };
