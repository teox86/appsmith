import { act, fireEvent, render } from "test/testUtils";
import {
  buildChildren,
  widgetCanvasFactory,
} from "test/factories/WidgetFactoryUtils";
import React from "react";
import { MockPageDSL } from "test/testCommon";
import { DEFAULT_ENTITY_EXPLORER_WIDTH } from "constants/AppConstants";
import { runSagaMiddleware } from "store";
import urlBuilder from "@appsmith/entities/URLRedirect/URLAssembly";
import * as explorerSelector from "selectors/explorerSelector";
import { MAIN_CONTAINER_WIDGET_ID } from "constants/WidgetConstants";
import * as widgetSelectionsActions from "actions/widgetSelectionActions";
import { SelectionRequestType } from "sagas/WidgetSelectUtils";
import { NavigationMethod } from "utils/history";
import WidgetsEditorEntityExplorer from "../WidgetsEditorEntityExplorer";

jest.useFakeTimers();
const pushState = jest.spyOn(window.history, "pushState");
pushState.mockImplementation((state: any, title: any, url: any) => {
  window.document.title = title;
  window.location.pathname = url;
});

jest.mock("@appsmith/utils/permissionHelpers", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@appsmith/utils/permissionHelpers"),
  };
});

jest.mock("@appsmith/pages/Editor/Explorer/helpers", () => ({
  __esModule: true,
  ...jest.requireActual("@appsmith/pages/Editor/Explorer/helpers"),
}));

jest.mock("@appsmith/utils/BusinessFeatures/permissionPageHelpers", () => ({
  __esModule: true,
  ...jest.requireActual(
    "@appsmith/utils/BusinessFeatures/permissionPageHelpers",
  ),
}));

jest.mock("selectors/explorerSelector", () => ({
  __esModule: true,
  ...jest.requireActual("selectors/explorerSelector"),
}));

jest
  .spyOn(explorerSelector, "getExplorerWidth")
  .mockImplementation(() => DEFAULT_ENTITY_EXPLORER_WIDTH);

describe("Entity Explorer tests", () => {
  beforeAll(() => {
    runSagaMiddleware();
  });

  beforeEach(() => {
    urlBuilder.updateURLParams(
      {
        baseApplicationId: "appId",
        applicationSlug: "appSlug",
        applicationVersion: 2,
      },
      [
        {
          basePageId: "pageId",
          pageSlug: "pageSlug",
        },
      ],
    );
  });

  it("Should render Widgets tree in entity explorer", () => {
    const children: any = buildChildren([{ type: "TABS_WIDGET" }]);
    const dsl: any = widgetCanvasFactory.build({
      children,
    });
    const component = render(
      <MockPageDSL dsl={dsl}>
        <WidgetsEditorEntityExplorer />
      </MockPageDSL>,
    );
    const widgetsTree: any = component.queryByText("Widgets", {
      selector: "div.t--entity-name",
    });
    act(() => {
      fireEvent.click(widgetsTree);
      jest.runAllTimers();
    });
    const tabsWidget = component.queryByText(children[0].widgetName);
    expect(tabsWidget).toBeTruthy();
  });

  describe("Widget Selection in entity explorer", () => {
    const spyWidgetSelection = jest.spyOn(
      widgetSelectionsActions,
      "selectWidgetInitAction",
    );
    beforeEach(() => {
      spyWidgetSelection.mockClear();
    });

    it("Select widget on entity explorer", () => {
      const children: any = buildChildren([
        { type: "TABS_WIDGET", widgetId: "tabsWidgetId" },
      ]);
      const dsl: any = widgetCanvasFactory.build({
        children,
      });
      const component = render(
        <MockPageDSL dsl={dsl}>
          <WidgetsEditorEntityExplorer />
        </MockPageDSL>,
      );
      const tabsWidget: any = component.queryByText(children[0].widgetName);
      act(() => {
        fireEvent.click(tabsWidget);
        jest.runAllTimers();
      });

      expect(spyWidgetSelection).toHaveBeenCalledWith(
        SelectionRequestType.One,
        ["tabsWidgetId"],
        NavigationMethod.EntityExplorer,
        undefined,
      );
    });

    it("CMD + click Multi Select widget on entity explorer", () => {
      const children: any = buildChildren([
        {
          type: "CHECKBOX_WIDGET",
          parentId: "0",
          widgetId: "checkboxWidgetId",
        },
        { type: "SWITCH_WIDGET", parentId: "0", widgetId: "switchWidgetId" },
      ]);
      const dsl: any = widgetCanvasFactory.build({
        children,
      });
      const component = render(
        <MockPageDSL dsl={dsl}>
          <WidgetsEditorEntityExplorer />
        </MockPageDSL>,
      );
      const checkBox: any = component.queryByText(children[0].widgetName);
      act(() => {
        fireEvent.click(checkBox);
        jest.runAllTimers();
      });
      const switchWidget: any = component.queryByText(children[1].widgetName);
      expect(spyWidgetSelection).toHaveBeenCalledWith(
        SelectionRequestType.One,
        ["checkboxWidgetId"],
        NavigationMethod.EntityExplorer,
        undefined,
      );

      act(() => {
        fireEvent.click(switchWidget, {
          ctrlKey: true,
        });
        jest.runAllTimers();
      });
      expect(spyWidgetSelection).toHaveBeenCalledWith(
        SelectionRequestType.PushPop,
        ["switchWidgetId"],
        undefined,
        undefined,
      );
    });

    it("Shift + Click Multi Select widget on entity explorer", () => {
      const children: any = buildChildren([
        {
          type: "CHECKBOX_WIDGET",
          parentId: "0",
          widgetId: "checkboxWidgetId",
        },
        { type: "SWITCH_WIDGET", parentId: "0", widgetId: "switchWidgetId" },
        { type: "BUTTON_WIDGET", parentId: "0", widgetId: "buttonWidgetId" },
      ]);
      const dsl: any = widgetCanvasFactory.build({
        children,
      });
      const component = render(
        <MockPageDSL dsl={dsl}>
          <WidgetsEditorEntityExplorer />
        </MockPageDSL>,
      );

      const checkboxWidget: any = component.queryByText(children[0].widgetName);
      const buttonWidget: any = component.queryByText(children[2].widgetName);

      act(() => {
        fireEvent.click(checkboxWidget);
        jest.runAllTimers();
      });

      expect(spyWidgetSelection).toHaveBeenCalledWith(
        SelectionRequestType.One,
        ["checkboxWidgetId"],
        NavigationMethod.EntityExplorer,
        undefined,
      );

      act(() => {
        fireEvent.click(buttonWidget, {
          shiftKey: true,
        });
        jest.runAllTimers();
      });

      expect(spyWidgetSelection).toHaveBeenCalledWith(
        SelectionRequestType.ShiftSelect,
        ["buttonWidgetId"],
        undefined,
        undefined,
      );
    });

    it("Shift + Click Deselect Non Siblings", () => {
      const containerId = "containerWidgetId";
      const canvasId = "canvasWidgetId";
      const children: any = buildChildren([
        {
          type: "CHECKBOX_WIDGET",
          parentId: canvasId,
          widgetId: "checkboxWidgetId",
        },
        {
          type: "SWITCH_WIDGET",
          parentId: canvasId,
          widgetId: "switchWidgetId",
        },
        {
          type: "BUTTON_WIDGET",
          parentId: canvasId,
          widgetId: "buttonWidgetId",
        },
      ]);
      const canvasWidget = buildChildren([
        {
          type: "CANVAS_WIDGET",
          parentId: containerId,
          children,
          widgetId: canvasId,
        },
      ]);
      const containerChildren: any = buildChildren([
        {
          type: "CONTAINER_WIDGET",
          children: canvasWidget,
          widgetId: containerId,
          parentId: MAIN_CONTAINER_WIDGET_ID,
        },
        {
          type: "CHART_WIDGET",
          parentId: MAIN_CONTAINER_WIDGET_ID,
          widgetId: "chartWidgetId",
        },
      ]);
      const dsl: any = widgetCanvasFactory.build({
        children: containerChildren,
      });
      const component = render(
        <MockPageDSL dsl={dsl}>
          <WidgetsEditorEntityExplorer />
        </MockPageDSL>,
      );
      const containerWidget: any = component.queryByText(
        containerChildren[0].widgetName,
      );

      act(() => {
        fireEvent.click(containerWidget);
        jest.runAllTimers();
      });

      expect(spyWidgetSelection).toHaveBeenCalledWith(
        SelectionRequestType.One,
        [containerId],
        NavigationMethod.EntityExplorer,
        undefined,
      );

      const collapsible: any = component.container.querySelector(
        `.t--entity-collapse-toggle[id="arrow-right-s-line"]`,
      );

      fireEvent.click(collapsible);

      const buttonWidget: any = component.queryByText(children[2].widgetName);
      act(() => {
        fireEvent.click(buttonWidget, {
          shiftKey: true,
        });
        jest.runAllTimers();
      });

      expect(spyWidgetSelection).toHaveBeenCalledWith(
        SelectionRequestType.ShiftSelect,
        ["buttonWidgetId"],
        undefined,
        undefined,
      );

      const checkBoxWidget: any = component.queryByText(children[0].widgetName);
      act(() => {
        fireEvent.click(checkBoxWidget, {
          shiftKey: true,
        });
        jest.runAllTimers();
      });
      expect(spyWidgetSelection).toHaveBeenCalledWith(
        SelectionRequestType.ShiftSelect,
        ["checkboxWidgetId"],
        undefined,
        undefined,
      );
      const chartWidget: any = component.queryByText(
        containerChildren[1].widgetName,
      );
      act(() => {
        fireEvent.click(chartWidget, {
          shiftKey: true,
        });
        jest.runAllTimers();
      });
      expect(spyWidgetSelection).toHaveBeenCalledWith(
        SelectionRequestType.ShiftSelect,
        ["chartWidgetId"],
        undefined,
        undefined,
      );
    });
  });
});
