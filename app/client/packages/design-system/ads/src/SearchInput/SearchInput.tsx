import React, { forwardRef, useEffect, useState } from "react";

import clsx from "classnames";

import { useDOMRef } from "../__hooks__/useDomRef";
import { SearchInputClassName } from "./SearchInput.constants";
import { StyledSearchInput } from "./SearchInput.styles";
import type { SearchInputProps } from "./SearchInput.types";

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref): JSX.Element => {
    const { className, onChange, placeholder, size = "sm", ...rest } = props;
    const [value, setValue] = useState<string>("");
    const inputRef = useDOMRef(ref);

    useEffect(() => {
      setValue(props.value || "");
    }, [props.value]);

    const handleChange = (val: string) => {
      setValue(val);
      onChange?.(val);
    };

    return (
      <StyledSearchInput
        {...rest}
        aria-label={placeholder || "Search"}
        className={clsx(SearchInputClassName, className)}
        endIcon={value ? "close-circle-line" : undefined}
        endIconProps={{
          onClick: () => {
            handleChange("");
            inputRef.current?.focus();
          },
        }}
        onChange={handleChange}
        placeholder={placeholder || "Search"}
        ref={inputRef}
        renderAs="input"
        size={size}
        startIcon="search-line"
        value={value}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
