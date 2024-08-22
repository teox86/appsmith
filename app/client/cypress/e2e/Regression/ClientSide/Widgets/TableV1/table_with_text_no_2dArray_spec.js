import * as _ from "../../../../../support/Objects/ObjectsCore";
import { seconds, testTimeout } from "../../../../../support/timeout";

const widgetsPage = require("../../../../../locators/Widgets.json");

describe(
  "Table widget edge case scenario testing",
  { tags: ["@tag.Widget", "@tag.Table"] },
  function () {
    before(() => {
      _.agHelper.AddDsl("tableWithTextWidgetDsl");
    });

    it("Check if the selectedRowIndices does not contain 2d array", function () {
      testTimeout(seconds(120)); //2mins

      cy.openPropertyPane("tablewidget");

      //Enable Multi row select
      cy.get(widgetsPage.toggleEnableMultirowselection_tablev1)
        .first()
        .click({ force: true });

      //Change the value of default selected row
      cy.updateCodeInput(".t--property-control-defaultselectedrow", "1");

      //Disable Multi row select
      cy.get(widgetsPage.toggleEnableMultirowselection_tablev1)
        .first()
        .click({ force: true });

      cy.get(`${widgetsPage.textWidget} .bp3-ui-text`).should(
        "have.text",
        "[]",
      );

      //Enable Multi row select
      cy.get(widgetsPage.toggleEnableMultirowselection_tablev1)
        .first()
        .click({ force: true });

      cy.get(`${widgetsPage.textWidget} .bp3-ui-text`).should(
        "have.text",
        "[  1]",
      );

      //Disable Multi row select
      cy.get(widgetsPage.toggleEnableMultirowselection_tablev1)
        .first()
        .click({ force: true });

      //Enable Multi row select
      cy.get(widgetsPage.toggleEnableMultirowselection_tablev1)
        .first()
        .click({ force: true });

      cy.get(`${widgetsPage.textWidget} .bp3-ui-text`).should(
        "have.text",
        "[  1]",
      );
    });
  },
);
