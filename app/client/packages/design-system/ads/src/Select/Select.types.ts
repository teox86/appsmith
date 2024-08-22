import type { SelectProps as RCSelectProps } from "rc-select";
import type { OptionProps } from "rc-select/lib/Option";

import type { Sizes } from "../__config__/types";

export type SelectSizes = Extract<Sizes, "sm" | "md">;

export type SelectProps = RCSelectProps & {
  size?: SelectSizes;
  isMultiSelect?: boolean;
  isDisabled?: boolean;
  isValid?: boolean;
  isLoading?: boolean;
};

export type SelectOptionProps = OptionProps;
