import { updateAndSaveLayout } from "actions/pageActions";
import {
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
} from "ce/constants/ReduxActionConstants";
import { ResponsiveBehavior } from "utils/autoLayout/constants";
import log from "loglevel";
import { CanvasWidgetsReduxState } from "reducers/entityReducers/canvasWidgetsReducer";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { getIsMobile } from "selectors/mainCanvasSelectors";
import {
  alterLayoutForDesktop,
  alterLayoutForMobile,
  removeChildLayers,
  updateFillChildStatus,
  wrapChildren,
} from "../utils/autoLayout/AutoLayoutUtils";
import { getWidgets } from "./selectors";
import { addNewCanvas, deleteCanvas } from "utils/autoLayout/canvasSplitUtils";
import { FlattenedWidgetProps } from "widgets/constants";
import { getUpdateDslAfterCreatingChild } from "./WidgetAdditionSagas";
import { Widget } from "utils/autoLayout/positionUtils";
import { CanvasSplitTypes } from "utils/autoLayout/canvasSplitProperties";

type LayoutUpdatePayload = {
  parentId: string;
};

function* removeChildWrappers(actionPayload: ReduxAction<LayoutUpdatePayload>) {
  try {
    const start = performance.now();
    const { parentId } = actionPayload.payload;
    const allWidgets: CanvasWidgetsReduxState = yield select(getWidgets);
    const updatedWidgets: CanvasWidgetsReduxState = removeChildLayers(
      allWidgets,
      parentId,
    );
    yield put(updateAndSaveLayout(updatedWidgets));
    log.debug("empty wrapper removal took", performance.now() - start, "ms");
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.WIDGET_OPERATION_ERROR,
      payload: {
        action: ReduxActionTypes.REMOVE_CHILD_WRAPPERS,
        error,
      },
    });
  }
}

function* addChildWrappers(actionPayload: ReduxAction<LayoutUpdatePayload>) {
  try {
    const start = performance.now();
    const { parentId } = actionPayload.payload;
    const allWidgets: CanvasWidgetsReduxState = yield select(getWidgets);
    const isMobile: boolean = yield select(getIsMobile);
    const updatedWidgets: CanvasWidgetsReduxState = yield call(
      wrapChildren,
      allWidgets,
      parentId,
      isMobile,
    );
    yield put(updateAndSaveLayout(updatedWidgets));
    log.debug("empty wrapper removal took", performance.now() - start, "ms");
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.WIDGET_OPERATION_ERROR,
      payload: {
        action: ReduxActionTypes.ADD_CHILD_WRAPPERS,
        error,
      },
    });
  }
}

export function* updateFillChildInfo(
  actionPayload: ReduxAction<{
    widgetId: string;
    responsiveBehavior: ResponsiveBehavior;
  }>,
) {
  try {
    const start = performance.now();
    const { responsiveBehavior, widgetId } = actionPayload.payload;
    const allWidgets: CanvasWidgetsReduxState = yield select(getWidgets);
    const isMobile: boolean = yield select(getIsMobile);
    const updatedWidgets: CanvasWidgetsReduxState = updateFillChildStatus(
      allWidgets,
      widgetId,
      responsiveBehavior === ResponsiveBehavior.Fill,
      isMobile,
    );
    yield put(updateAndSaveLayout(updatedWidgets));
    log.debug("updating fill child info took", performance.now() - start, "ms");
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.WIDGET_OPERATION_ERROR,
      payload: {
        action: ReduxActionTypes.UPDATE_FILL_CHILD_LAYER,
        error,
      },
    });
  }
}

export function* updateLayoutForMobileCheckpoint(
  actionPayload: ReduxAction<{
    parentId: string;
    isMobile: boolean;
    canvasWidth: number;
  }>,
) {
  try {
    const start = performance.now();
    const { canvasWidth, isMobile, parentId } = actionPayload.payload;
    const allWidgets: CanvasWidgetsReduxState = yield select(getWidgets);
    const updatedWidgets: CanvasWidgetsReduxState = isMobile
      ? alterLayoutForMobile(allWidgets, parentId, canvasWidth)
      : alterLayoutForDesktop(allWidgets, parentId);
    yield put(updateAndSaveLayout(updatedWidgets));
    log.debug(
      "updating layout for mobile viewport took",
      performance.now() - start,
      "ms",
    );
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.WIDGET_OPERATION_ERROR,
      payload: {
        action: ReduxActionTypes.RECALCULATE_COLUMNS,
        error,
      },
    });
  }
}

export function* manageCanvasSplit(
  actionPayload: ReduxAction<{
    parentId: string;
    ratios: number[];
    canvasSplitType: CanvasSplitTypes;
  }>,
) {
  try {
    console.log("#### manageCanvasSplit", actionPayload);
    const start = performance.now();
    const { canvasSplitType, parentId, ratios } = actionPayload.payload;
    const allWidgets: CanvasWidgetsReduxState = yield select(getWidgets);
    let updatedWidgets = allWidgets;
    if (ratios.length > 1) {
      const payload:
        | { existingCanvas: Widget; newCanvasPayload: any }
        | undefined = addNewCanvas(allWidgets, parentId, ratios);
      if (!payload) throw new Error("Unable to split canvas");
      const updatedWidgetsAfterCreatingCanvas: {
        [widgetId: string]: FlattenedWidgetProps;
      } = yield call(getUpdateDslAfterCreatingChild, payload.newCanvasPayload);
      updatedWidgets = {
        ...updatedWidgetsAfterCreatingCanvas,
        [payload.existingCanvas.widgetId]: payload.existingCanvas,
        [parentId]: {
          ...updatedWidgetsAfterCreatingCanvas[parentId],
          canvasSplitType,
        },
      };
      console.log("#### udpatedWidgets", updatedWidgets);
    } else {
      const isMobile: boolean = yield select(getIsMobile);
      updatedWidgets = deleteCanvas(
        updatedWidgets,
        parentId,
        canvasSplitType,
        isMobile,
      );
    }
    yield put(updateAndSaveLayout(updatedWidgets));
    log.debug(
      "updating layout for mobile viewport took",
      performance.now() - start,
      "ms",
    );
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.WIDGET_OPERATION_ERROR,
      payload: {
        action: ReduxActionTypes.SPLIT_CANVAS,
        error,
      },
    });
  }
}

export default function* layoutUpdateSagas() {
  yield all([
    takeLatest(ReduxActionTypes.ADD_CHILD_WRAPPERS, addChildWrappers),
    takeLatest(ReduxActionTypes.REMOVE_CHILD_WRAPPERS, removeChildWrappers),
    takeLatest(ReduxActionTypes.UPDATE_FILL_CHILD_LAYER, updateFillChildInfo),
    takeLatest(
      ReduxActionTypes.RECALCULATE_COLUMNS,
      updateLayoutForMobileCheckpoint,
    ),
    takeLatest(ReduxActionTypes.SPLIT_CANVAS, manageCanvasSplit),
  ]);
}
