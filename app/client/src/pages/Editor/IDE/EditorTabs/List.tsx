import React from "react";
import styled from "styled-components";
import { Flex } from "@appsmith/ads";

import { useCurrentEditorState } from "../hooks";
import { EditorEntityTab } from "ee/entities/IDE/constants";
import ListQuery from "../EditorPane/Query/List";
import ListJSObjects from "../EditorPane/JS/List";
import ListWidgets from "../EditorPane/UI/List";

const ListContainer = styled(Flex)`
  & .t--entity-item {
    grid-template-columns: 0 auto 1fr auto auto auto auto auto;
    height: 32px;

    & .t--entity-name {
      padding-left: var(--ads-v2-spaces-3);
    }
  }
`;

export const List = () => {
  const { segment } = useCurrentEditorState();

  let content: React.ReactNode = null;

  switch (segment) {
    case EditorEntityTab.JS:
      content = <ListJSObjects />;
      break;
    case EditorEntityTab.QUERIES:
      content = <ListQuery />;
      break;
    case EditorEntityTab.UI:
      content = <ListWidgets />;
      break;
  }

  return (
    <ListContainer
      bg="var(--ads-v2-color-bg)"
      className="absolute top-[36px]" // space for tabs on top and then some padding
      data-testid="t--editorpane-list-view"
      h="calc(100% - 32px)"
      w="100%"
      zIndex="10"
    >
      {content}
    </ListContainer>
  );
};
