import React, { useEffect, useState } from "react";

import { fetchGlobalGitConfigInit } from "actions/gitSyncActions";
import { BackButton } from "components/utils/helperComponents";
import { GIT_PROFILE_ROUTE } from "constants/routes";
import PageWrapper from "pages/common/PageWrapper";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import styled from "styled-components";

import { Tab, TabPanel, Tabs, TabsList } from "@appsmith/ads";

import General from "./General";
import GitConfig from "./GitConfig";

const ProfileWrapper = styled.div`
  width: 978px;
  margin: var(--ads-v2-spaces-7) auto;
  padding-left: var(--ads-v2-spaces-7);

  .tab-item {
    display: flex;
    gap: 5px;
    align-items: center;
  }
`;

function UserProfile() {
  const location = useLocation();
  const dispatch = useDispatch();

  let initialTab = "general";
  const tabs = [
    {
      key: "general",
      title: "General",
      panelComponent: <General />,
      icon: "general",
    },
  ];

  tabs.push({
    key: "gitConfig",
    title: "Git user config",
    panelComponent: <GitConfig />,
    icon: "git-branch",
  });
  if (location.pathname === GIT_PROFILE_ROUTE) {
    initialTab = "gitConfig";
  }

  const [selectedTab, setSelectedTab] = useState(initialTab);

  useEffect(() => {
    // onMount Fetch Global config
    dispatch(fetchGlobalGitConfigInit());
  }, []);

  return (
    <PageWrapper displayName={"Profile"}>
      <ProfileWrapper>
        <BackButton />
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            {tabs.map((tab) => {
              return (
                <Tab key={tab.key} value={tab.key}>
                  <div className="tab-item">{tab.title}</div>
                </Tab>
              );
            })}
          </TabsList>
          {tabs.map((tab) => {
            return (
              <TabPanel key={tab.key} value={tab.key}>
                {tab.panelComponent}
              </TabPanel>
            );
          })}
        </Tabs>
      </ProfileWrapper>
    </PageWrapper>
  );
}

export default UserProfile;
