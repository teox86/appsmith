import React, { useContext } from "react";

import { Provider } from "react-redux";
import TestRenderer from "react-test-renderer";
import store from "store";

import type { EditorContextType } from "./EditorContextProvider";
import EditorContextProvider, { EditorContext } from "./EditorContextProvider";

interface TestChildProps {
  editorContext: EditorContextType;
}

const TestChild = (props: TestChildProps) => {
  return <div>{Object.keys(props)}</div>;
};

const TestParent = () => {
  const editorContext = useContext(EditorContext);

  return <TestChild editorContext={editorContext} />;
};

describe("EditorContextProvider", () => {
  it("it checks context methods in Edit mode", () => {
    const expectedMethods = [
      "batchUpdateWidgetProperty",
      "executeAction",
      "getWidgetCache",
      "modifyMetaWidgets",
      "resetChildrenMetaProperty",
      "selectWidgetRequest",
      "setWidgetCache",
      "updateMetaWidgetProperty",
      "syncUpdateWidgetMetaProperty",
      "syncBatchUpdateWidgetMetaProperties",
      "triggerEvalOnMetaUpdate",
      "deleteMetaWidgets",
      "deleteWidgetProperty",
      "disableDrag",
      "updateWidget",
      "updateWidgetProperty",
      "updateWidgetAutoHeight",
      "updateWidgetDimension",
      "checkContainersForAutoHeight",
      "updatePositionsOnTabChange",
      "updateOneClickBindingOptionsVisibility",
      "unfocusWidget",
    ].sort();

    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <EditorContextProvider renderMode="CANVAS">
          <TestParent />
        </EditorContextProvider>
      </Provider>,
    );
    const testInstance = testRenderer.root;
    const result = (
      Object.keys(
        // eslint-disable-next-line testing-library/await-async-queries
        testInstance.findByType(TestChild).props.editorContext,
      ) || []
    ).sort();

    expect(result).toEqual(expectedMethods);
  });

  it("it checks context methods in View mode", () => {
    const expectedMethods = [
      "batchUpdateWidgetProperty",
      "deleteMetaWidgets",
      "executeAction",
      "getWidgetCache",
      "modifyMetaWidgets",
      "resetChildrenMetaProperty",
      "selectWidgetRequest",
      "setWidgetCache",
      "updateMetaWidgetProperty",
      "syncUpdateWidgetMetaProperty",
      "syncBatchUpdateWidgetMetaProperties",
      "triggerEvalOnMetaUpdate",
      "updateWidgetAutoHeight",
      "updateWidgetDimension",
      "checkContainersForAutoHeight",
      "updatePositionsOnTabChange",
      "unfocusWidget",
    ].sort();

    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <EditorContextProvider renderMode="PAGE">
          <TestParent />
        </EditorContextProvider>
      </Provider>,
    );
    const testInstance = testRenderer.root;
    const result = (
      Object.keys(
        // eslint-disable-next-line testing-library/await-async-queries
        testInstance.findByType(TestChild).props.editorContext,
      ) || []
    ).sort();

    expect(result).toEqual(expectedMethods);
  });
});
