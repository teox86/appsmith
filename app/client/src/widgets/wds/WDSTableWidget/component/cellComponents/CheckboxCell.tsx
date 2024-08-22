import React, { memo } from "react";

import { Checkbox } from "@appsmith/wds";

import type { BaseCellComponentProps } from "../Constants";

type CheckboxCellProps = BaseCellComponentProps & {
  value: boolean;
  accentColor: string;
  isDisabled?: boolean;
  onChange: () => void;
  borderRadius: string;
  hasUnSavedChanges?: boolean;
  disabledCheckbox: boolean;
  isCellEditable: boolean;
  disabledCheckboxMessage: string;
};

const CheckboxCellComponent = (props: CheckboxCellProps) => {
  const { disabledCheckbox, isCellEditable, onChange, value } = props;

  return (
    <Checkbox
      isDisabled={!!disabledCheckbox || !isCellEditable}
      isRequired={false}
      isSelected={value}
      onChange={() => onChange()}
    />
  );
};

export const CheckboxCell = memo(CheckboxCellComponent);
