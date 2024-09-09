import type { DSLWidget } from "../../../types";

export const inputDsl: DSLWidget = {
  widgetName: "MainContainer",
  backgroundColor: "none",
  rightColumn: 1224,
  snapColumns: 16,
  detachFromLayout: true,
  widgetId: "0",
  topRow: 0,
  bottomRow: 1840,
  containerStyle: "none",
  snapRows: 33,
  parentRowSpace: 1,
  type: "CANVAS_WIDGET",
  canExtend: true,
  version: 7,
  minHeight: 1292,
  parentColumnSpace: 1,
  dynamicBindingPathList: [],
  leftColumn: 0,
  isLoading: false,
  parentId: "",
  renderMode: "CANVAS",
  children: [
    {
      isVisible: true,
      label: "Data",
      widgetName: "Table1",
      searchKey: "",
      tableData:
        '[\n  {\n    "id": 2381224,\n    "email": "michael.lawson@reqres.in",\n    "userName": "Michael Lawson",\n    "productName": "Chicken Sandwich",\n    "orderAmount": 4.99\n  },\n  {\n    "id": 2736212,\n    "email": "lindsay.ferguson@reqres.in",\n    "userName": "Lindsay Ferguson",\n    "productName": "Tuna Salad",\n    "orderAmount": 9.99\n  },\n  {\n    "id": 6788734,\n    "email": "tobias.funke@reqres.in",\n    "userName": "Tobias Funke",\n    "productName": "Beef steak",\n    "orderAmount": 19.99\n  }\n]',
      type: "TABLE_WIDGET",
      isLoading: false,
      parentColumnSpace: 74,
      parentRowSpace: 40,
      leftColumn: 0,
      rightColumn: 8,
      topRow: 19,
      bottomRow: 26,
      parentId: "0",
      widgetId: "fs785w9gcy",
      dynamicBindingPathList: [],
      primaryColumns: {
        id: {
          index: 0,
          width: 150,
          id: "id",
          horizontalAlignment: "LEFT",
          verticalAlignment: "CENTER",
          columnType: "text",
          textColor: "#231F20",
          textSize: "PARAGRAPH",
          fontStyle: "REGULAR",
          enableFilter: true,
          enableSort: true,
          isVisible: true,
          isDerived: false,
          label: "id",
          computedValue: "",
        },
        email: {
          index: 1,
          width: 150,
          id: "email",
          horizontalAlignment: "LEFT",
          verticalAlignment: "CENTER",
          columnType: "text",
          textColor: "#231F20",
          textSize: "PARAGRAPH",
          fontStyle: "REGULAR",
          enableFilter: true,
          enableSort: true,
          isVisible: true,
          isDerived: false,
          label: "email",
          computedValue: "",
        },
        userName: {
          index: 2,
          width: 150,
          id: "userName",
          horizontalAlignment: "LEFT",
          verticalAlignment: "CENTER",
          columnType: "text",
          textColor: "#231F20",
          textSize: "PARAGRAPH",
          fontStyle: "REGULAR",
          enableFilter: true,
          enableSort: true,
          isVisible: true,
          isDerived: false,
          label: "userName",
          computedValue: "",
        },
        productName: {
          index: 3,
          width: 150,
          id: "productName",
          horizontalAlignment: "LEFT",
          verticalAlignment: "CENTER",
          columnType: "text",
          textColor: "#231F20",
          textSize: "PARAGRAPH",
          fontStyle: "REGULAR",
          enableFilter: true,
          enableSort: true,
          isVisible: true,
          isDerived: false,
          label: "productName",
          computedValue: "",
        },
        orderAmount: {
          index: 4,
          width: 150,
          id: "orderAmount",
          horizontalAlignment: "LEFT",
          verticalAlignment: "CENTER",
          columnType: "text",
          textColor: "#231F20",
          textSize: "PARAGRAPH",
          fontStyle: "REGULAR",
          enableFilter: true,
          enableSort: true,
          isVisible: true,
          isDerived: false,
          label: "orderAmount",
          computedValue: "",
        },
      },
      textSize: "PARAGRAPH",
      horizontalAlignment: "LEFT",
      verticalAlignment: "CENTER",
      renderMode: "CANVAS",
      version: 1,
    },
  ],
};
export const outputDsl: DSLWidget = {
  widgetName: "MainContainer",
  backgroundColor: "none",
  rightColumn: 1224,
  snapColumns: 16,
  detachFromLayout: true,
  widgetId: "0",
  topRow: 0,
  bottomRow: 1840,
  containerStyle: "none",
  snapRows: 33,
  parentRowSpace: 1,
  type: "CANVAS_WIDGET",
  canExtend: true,
  version: 7,
  minHeight: 1292,
  parentColumnSpace: 1,
  dynamicBindingPathList: [],
  leftColumn: 0,
  isLoading: false,
  parentId: "",
  renderMode: "CANVAS",
  children: [
    {
      isVisible: true,
      label: "Data",
      widgetName: "Table1",
      searchKey: "",
      tableData:
        '[\n  {\n    "id": 2381224,\n    "email": "michael.lawson@reqres.in",\n    "userName": "Michael Lawson",\n    "productName": "Chicken Sandwich",\n    "orderAmount": 4.99\n  },\n  {\n    "id": 2736212,\n    "email": "lindsay.ferguson@reqres.in",\n    "userName": "Lindsay Ferguson",\n    "productName": "Tuna Salad",\n    "orderAmount": 9.99\n  },\n  {\n    "id": 6788734,\n    "email": "tobias.funke@reqres.in",\n    "userName": "Tobias Funke",\n    "productName": "Beef steak",\n    "orderAmount": 19.99\n  }\n]',
      type: "TABLE_WIDGET",
      isLoading: false,
      parentColumnSpace: 74,
      parentRowSpace: 10,
      leftColumn: 0,
      rightColumn: 8,
      topRow: 19,
      bottomRow: 26,
      parentId: "0",
      widgetId: "fs785w9gcy",
      dynamicBindingPathList: [],
      primaryColumns: {
        id: {
          index: 0,
          width: 150,
          id: "id",
          horizontalAlignment: "LEFT",
          verticalAlignment: "CENTER",
          columnType: "text",
          textColor: "#231F20",
          textSize: "PARAGRAPH",
          fontStyle: "REGULAR",
          enableFilter: true,
          enableSort: true,
          isVisible: true,
          isDerived: false,
          label: "id",
          computedValue: "",
        },
        email: {
          index: 1,
          width: 150,
          id: "email",
          horizontalAlignment: "LEFT",
          verticalAlignment: "CENTER",
          columnType: "text",
          textColor: "#231F20",
          textSize: "PARAGRAPH",
          fontStyle: "REGULAR",
          enableFilter: true,
          enableSort: true,
          isVisible: true,
          isDerived: false,
          label: "email",
          computedValue: "",
        },
        userName: {
          index: 2,
          width: 150,
          id: "userName",
          horizontalAlignment: "LEFT",
          verticalAlignment: "CENTER",
          columnType: "text",
          textColor: "#231F20",
          textSize: "PARAGRAPH",
          fontStyle: "REGULAR",
          enableFilter: true,
          enableSort: true,
          isVisible: true,
          isDerived: false,
          label: "userName",
          computedValue: "",
        },
        productName: {
          index: 3,
          width: 150,
          id: "productName",
          horizontalAlignment: "LEFT",
          verticalAlignment: "CENTER",
          columnType: "text",
          textColor: "#231F20",
          textSize: "PARAGRAPH",
          fontStyle: "REGULAR",
          enableFilter: true,
          enableSort: true,
          isVisible: true,
          isDerived: false,
          label: "productName",
          computedValue: "",
        },
        orderAmount: {
          index: 4,
          width: 150,
          id: "orderAmount",
          horizontalAlignment: "LEFT",
          verticalAlignment: "CENTER",
          columnType: "text",
          textColor: "#231F20",
          textSize: "PARAGRAPH",
          fontStyle: "REGULAR",
          enableFilter: true,
          enableSort: true,
          isVisible: true,
          isDerived: false,
          label: "orderAmount",
          computedValue: "",
        },
      },
      textSize: "PARAGRAPH",
      horizontalAlignment: "LEFT",
      verticalAlignment: "CENTER",
      renderMode: "CANVAS",
      isVisibleSearch: true,
      isVisibleFilters: true,
      isVisibleDownload: true,
      isVisibleCompactMode: true,
      isVisiblePagination: true,
      version: 1,
    },
  ],
};
