import React, { useCallback } from "react";
import { useEffect } from "react";

import type {
  BaseItemProps,
  DroppableComponentProps,
} from "components/propertyControls/DraggableListComponent";
import { DroppableComponent } from "components/propertyControls/DraggableListComponent";
import type { AppState } from "ee/reducers";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import { getSelectedPropertyPanelIndex } from "selectors/propertyPaneSelectors";

export type DraggableListControlProps<TItem extends BaseItemProps> =
  DroppableComponentProps<TItem> & {
    defaultPanelIndex?: number;
    propertyPath: string | undefined;
    keyAccessor?: string;
  };
export const DraggableListControl = <TItem extends BaseItemProps>(
  props: DraggableListControlProps<TItem>,
) => {
  const defaultPanelIndex = useSelector((state: AppState) =>
    getSelectedPropertyPanelIndex(state, props.propertyPath),
  );

  const { onEdit } = props;

  //leading debounce to stop opening multiple panels
  const debouncedEditLeading = useCallback(
    debounce(
      (index: number) => {
        onEdit && onEdit(index);
      },
      300,
      {
        leading: true,
        trailing: false,
      },
    ),
    [],
  );

  useEffect(() => {
    onEdit &&
      defaultPanelIndex !== undefined &&
      debouncedEditLeading(defaultPanelIndex);
  }, [defaultPanelIndex]);

  const onPanelEdit = (index: number) => {
    if (onEdit) {
      debouncedEditLeading(index);
    }
  };

  return <DroppableComponent {...props} onEdit={onPanelEdit} />;
};
