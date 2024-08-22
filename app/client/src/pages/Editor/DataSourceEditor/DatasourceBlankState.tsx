import React from "react";

import {
  DATASOURCE_BLANK_STATE_MESSAGE,
  createMessage,
} from "ee/constants/messages";
import styled from "styled-components";

import { Text } from "@appsmith/ads";
import { importSvg } from "@appsmith/ads-old";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 243px;
  gap: 24px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const BlankStateIllustration = importSvg(
  async () => import("assets/images/data-main-blank-state.svg"),
);

const DatasourceBlankState = () => {
  return (
    <Container className="t--data-blank-state">
      <Content>
        <BlankStateIllustration />
        <Text kind="body-s">
          {createMessage(DATASOURCE_BLANK_STATE_MESSAGE)}
        </Text>
      </Content>
    </Container>
  );
};

export default DatasourceBlankState;
