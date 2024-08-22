import React from "react";

import { act, renderHook } from "@testing-library/react-hooks/dom";
import { EditorViewMode } from "ee/entities/IDE/constants";
import type { AppState } from "ee/reducers";
import { type MemoryHistory, createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router } from "react-router";
import type { Store } from "redux";
import { getIDETestState } from "test/factories/AppIDEFactoryUtils";

import { setIdeEditorViewMode } from "../../actions/ideActions";
import { getIDEViewMode } from "../../selectors/ideSelectors";
import { testStore } from "../../store";
import { useIsInSideBySideEditor } from "./useIsInSideBySideEditor";

const JS_COLLECTION_EDITOR_PATH =
  "/app/app-name/page-665dd1103e4483728c9ed11a/edit/jsObjects";
const NON_JS_COLLECTION_EDITOR_PATH = "/some-other-path";
const FEATURE_FLAGS = {
  rollout_side_by_side_enabled: true,
};

const renderUseIsInSideBySideEditor = (
  history: MemoryHistory,
  store: Store<AppState>,
) => {
  const wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );
  return renderHook(() => useIsInSideBySideEditor(), {
    wrapper,
  });
};

describe("useIsInSideBySideEditor", () => {
  it("should enter into split screen mode", () => {
    const store = testStore(
      getIDETestState({
        ideView: EditorViewMode.SplitScreen,
        featureFlags: FEATURE_FLAGS,
      }),
    );

    const ideViewMode = getIDEViewMode(store.getState());
    expect(ideViewMode).toBe(EditorViewMode.SplitScreen);
  });

  it("should return false when on correct path but not in SplitScreen mode", () => {
    const store = testStore(
      getIDETestState({
        ideView: EditorViewMode.FullScreen,
        featureFlags: FEATURE_FLAGS,
      }),
    );

    const history = createMemoryHistory({
      initialEntries: [JS_COLLECTION_EDITOR_PATH],
    });

    const { result } = renderUseIsInSideBySideEditor(history, store);
    expect(result.current).toBe(false);
  });

  it("should return false when pathname does not satisfy JS_COLLECTION_EDITOR_PATH", () => {
    const store = testStore(
      getIDETestState({
        ideView: EditorViewMode.SplitScreen,
        featureFlags: FEATURE_FLAGS,
      }),
    );

    const history = createMemoryHistory({
      initialEntries: [NON_JS_COLLECTION_EDITOR_PATH],
    });

    const { result } = renderUseIsInSideBySideEditor(history, store);

    expect(result.current).toBe(false);
  });

  it("should return true when in SplitScreen mode and pathname satisfies JS_COLLECTION_EDITOR_PATH", () => {
    const store = testStore(
      getIDETestState({
        ideView: EditorViewMode.SplitScreen,
        featureFlags: FEATURE_FLAGS,
      }),
    );

    const history = createMemoryHistory({
      initialEntries: [JS_COLLECTION_EDITOR_PATH],
    });

    const { result } = renderUseIsInSideBySideEditor(history, store);
    expect(result.current).toBe(true);
  });

  it("should update when ideViewMode changes", () => {
    const store = testStore(
      getIDETestState({
        ideView: EditorViewMode.SplitScreen,
        featureFlags: FEATURE_FLAGS,
      }),
    );

    const history = createMemoryHistory({
      initialEntries: [JS_COLLECTION_EDITOR_PATH],
    });

    const { rerender, result } = renderUseIsInSideBySideEditor(history, store);

    expect(result.current).toBe(true);

    act(() => {
      store.dispatch(setIdeEditorViewMode(EditorViewMode.FullScreen));
      rerender();
    });

    expect(getIDEViewMode(store.getState())).toBe(EditorViewMode.FullScreen);
    expect(result.current).toBe(false);
  });

  it("should update when pathname changes", () => {
    const store = testStore(
      getIDETestState({
        ideView: EditorViewMode.SplitScreen,
        featureFlags: FEATURE_FLAGS,
      }),
    );

    const history = createMemoryHistory({
      initialEntries: [NON_JS_COLLECTION_EDITOR_PATH],
    });

    const { rerender, result } = renderUseIsInSideBySideEditor(history, store);
    expect(result.current).toBe(false);

    act(() => {
      history.push(JS_COLLECTION_EDITOR_PATH);
      rerender();
    });

    expect(result.current).toBe(true);
  });
});
