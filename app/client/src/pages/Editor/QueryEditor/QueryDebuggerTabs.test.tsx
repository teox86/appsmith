import React from "react";

import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { ENTITY_TYPE } from "ee/entities/AppsmithConsole/utils";
import { EditorViewMode } from "ee/entities/IDE/constants";
import { unitTestBaseMockStore } from "layoutSystems/common/dropTarget/unitTestUtils";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import { lightTheme } from "selectors/themeSelectors";
import { ThemeProvider } from "styled-components";

import QueryDebuggerTabs from "./QueryDebuggerTabs";

const mockStore = configureStore([]);

const storeState = {
  ...unitTestBaseMockStore,
  evaluations: {
    tree: {},
  },
  entities: {
    plugins: {
      list: [],
    },
    datasources: {
      structure: {},
    },
  },
  ui: {
    ...unitTestBaseMockStore.ui,
    users: {
      featureFlag: {
        data: {},
        overriddenFlags: {},
      },
    },
    ide: {
      view: EditorViewMode.FullScreen,
    },
    debugger: {
      context: {
        errorCount: 0,
      },
    },
    queryPane: {
      debugger: {
        open: true,
        responseTabHeight: 200,
        selectedTab: "response",
      },
    },
  },
};

describe("ApiResponseView", () => {
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;

  beforeEach(() => {
    store = mockStore(storeState);
  });

  it("the container should have class select-text to enable the selection of text for user", () => {
    const { container } = render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Router>
            <QueryDebuggerTabs
              actionName="Query1"
              actionSource={{
                id: "ID1",
                name: "Query1",
                type: ENTITY_TYPE.ACTION,
              }}
              isRunning={false}
              onRunClick={() => {}}
            />
          </Router>
        </ThemeProvider>
      </Provider>,
    );

    expect(
      container
        .querySelector(".t--query-bottom-pane-container")
        ?.classList.contains("select-text"),
    ).toBe(true);
  });
});
