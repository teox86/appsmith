import type { AppState } from "@appsmith/reducers";
import { CANVAS_ART_BOARD } from "constants/componentClassNameConstants";
import { MAIN_CONTAINER_WIDGET_ID } from "constants/WidgetConstants";
import { getDropTargetLayoutId } from "layoutSystems/anvil/integrations/selectors";
import { getWidgetPositions } from "layoutSystems/common/selectors";
import { positionObserver } from "layoutSystems/common/utils/WidgetPositionsObserver";
import { getLayoutId } from "layoutSystems/common/utils/WidgetPositionsObserver/utils";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { DragDetails } from "reducers/uiReducers/dragResizeReducer";
import { getDragDetails } from "sagas/selectors";
import { useWidgetDragResize } from "utils/hooks/dragResizeHooks";

export const useCanvasActivation = (layoutId: string) => {
  const mainCanvasLayoutId: string = useSelector((state) =>
    getDropTargetLayoutId(state, MAIN_CONTAINER_WIDGET_ID),
  );
  const widgetPositions = useSelector(getWidgetPositions);
  const dragDetails: DragDetails = useSelector(getDragDetails);
  const { dragGroupActualParent: dragParent, newWidget } = dragDetails;
  const isNewWidget = !!newWidget && !dragParent;
  const isDragging = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isDragging,
  );

  const activateOverlayWidgetDrop =
    isNewWidget && newWidget.type === "MODAL_WIDGET";
  const mainContainerDOMNode = document.getElementById(CANVAS_ART_BOARD);
  const { setDraggingCanvas, setDraggingNewWidget, setDraggingState } =
    useWidgetDragResize();
  const outOfMainCanvas = useRef(false);
  const mouseOutOfCanvasArtBoard = () => {
    outOfMainCanvas.current = true;
    setDraggingCanvas();
  };
  const allLayouts =
    layoutId === mainCanvasLayoutId && isDragging
      ? positionObserver.getRegisteredLayouts()
      : {};
  const allLayoutIds = Object.keys(allLayouts);
  const mainCanvasLayoutDomId = getLayoutId(
    MAIN_CONTAINER_WIDGET_ID,
    mainCanvasLayoutId,
  );
  const filteredLayoutIds = activateOverlayWidgetDrop
    ? allLayoutIds.filter((each) => each === mainCanvasLayoutDomId)
    : allLayoutIds;
  const allDroppableLayoutIds = filteredLayoutIds
    .filter((each) => {
      const layoutInfo = allLayouts[each];
      const currentPositions = widgetPositions[layoutInfo.layoutId];
      return currentPositions && !!layoutInfo.isDropTarget;
    })
    .map((each) => allLayouts[each].layoutId);
  const smallToLargeSortedDroppableLayoutIds = allDroppableLayoutIds.sort(
    (droppableLayout1Id: string, droppableLayout2Id: string) => {
      const droppableLayout1 = widgetPositions[droppableLayout1Id];
      const droppableLayout2 = widgetPositions[droppableLayout2Id];
      return (
        droppableLayout1.height * droppableLayout1.width -
        droppableLayout2.height * droppableLayout2.width
      );
    },
  );
  const onMouseMove = (e: MouseEvent) => {
    if (
      isDragging &&
      mainContainerDOMNode &&
      smallToLargeSortedDroppableLayoutIds.length > 0
    ) {
      const mainCanvasRect = mainContainerDOMNode.getBoundingClientRect();
      const hoveredCanvas = smallToLargeSortedDroppableLayoutIds.find(
        (each) => {
          const currentCanvasPositions = widgetPositions[each];
          if (currentCanvasPositions) {
            return (
              currentCanvasPositions.left <= e.clientX - mainCanvasRect.left &&
              e.clientX - mainCanvasRect.left <=
                currentCanvasPositions.left + currentCanvasPositions.width &&
              currentCanvasPositions.top <= e.clientY - mainCanvasRect.top &&
              e.clientY - mainCanvasRect.top <=
                currentCanvasPositions.top + currentCanvasPositions.height
            );
          }
        },
      );
      if (dragDetails.draggedOn !== hoveredCanvas) {
        if (hoveredCanvas) {
          outOfMainCanvas.current = false;
          setDraggingCanvas(hoveredCanvas);
        } else {
          mouseOutOfCanvasArtBoard();
        }
      }
    }
  };
  const onMouseUp = () => {
    if (isDragging) {
      if (isNewWidget) {
        setDraggingNewWidget(false, undefined);
      } else {
        setDraggingState({
          isDragging: false,
        });
      }
    }
  };
  useEffect(() => {
    if (isDragging && layoutId === mainCanvasLayoutId) {
      document?.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseup", onMouseUp, false);
      window.addEventListener("mouseup", onMouseUp, false);
      return () => {
        document?.removeEventListener("mousemove", onMouseMove);
        document.body.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [isDragging, onMouseMove, onMouseUp, mouseOutOfCanvasArtBoard]);
};
