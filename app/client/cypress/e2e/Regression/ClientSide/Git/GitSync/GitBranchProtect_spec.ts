import * as _ from "../../../../../support/Objects/ObjectsCore";
import {
  AppSidebar,
  PageLeftPane,
} from "../../../../../support/Pages/EditorNavigation";

let guid: any;
let repoName: any;

describe("Git Branch Protection", { tags: ["@tag.Git"] }, function () {
  it("Issue 28056 - 2 : Check if protection is enabled when feature flag is enabled", function () {
    _.agHelper.GenerateUUID();
    cy.get("@guid").then((uid) => {
      guid = uid;
      const wsName = "GitBranchProtect-2" + uid;
      const appName = "GitBranchProtect-2" + uid;
      _.homePage.CreateNewWorkspace(wsName, true);
      _.homePage.CreateAppInWorkspace(wsName, appName);
      _.gitSync.CreateNConnectToGit("repoprotect", true, true);
      cy.wait(1000);

      cy.intercept({
        method: "POST",
        url: /\/api\/v1\/git\/branch\/app\/.*\/protected/,
      }).as("gitProtectApi");
      cy.get("@gitRepoName").then((repName) => {
        repoName = repName;
        _.gitSync.OpenGitSettingsModal();
        _.agHelper.GetNClick(_.gitSync._settingsTabBranch);
        _.agHelper.GetNClick(_.gitSync._protectedBranchesSelect);
        _.agHelper.GetNClick(
          `${_.gitSync._protectedBranchesSelect} .rc-select-item`,
          0,
        );
        _.agHelper.GetNClick(_.gitSync._branchProtectionUpdateBtn);
        cy.wait("@gitProtectApi").then((res1) => {
          _.agHelper.GetNClick(_.gitSync._closeGitSettingsModal);
          expect(res1.response).to.have.property("statusCode", 200);
          _.agHelper.AssertElementAbsence(AppSidebar.locators.sidebar);
          _.agHelper.AssertElementVisibility(
            PageLeftPane.locators.selector,
            false,
          );
          _.agHelper.AssertElementVisibility(
            _.propPane._propertyPaneSidebar,
            false,
          );
          _.agHelper.AssertElementEnabledDisabled(
            _.gitSync._bottomBarCommit,
            0,
            true,
          );
        });
      });
    });
  });

  after(() => {
    _.gitSync.DeleteTestGithubRepo(repoName);
  });
});
