import React, { useMemo } from "react";

import * as Sentry from "@sentry/react";
import { saveJSObjectName } from "actions/jsActionActions";
import { updateFunctionProperty } from "actions/jsPaneActions";
import CenteredWrapper from "components/designSystems/appsmith/CenteredWrapper";
import Spinner from "components/editorComponents/Spinner";
import { useDispatch, useSelector } from "react-redux";
import type { RouteComponentProps } from "react-router";
import {
  getCurrentPageId,
  getJSCollectionDataByBaseId,
} from "selectors/editorSelectors";
import styled from "styled-components";

import EntityNotFoundPane from "../EntityNotFoundPane";
import AppJSEditorContextMenu from "./AppJSEditorContextMenu";
import JsEditorForm from "./Form";
import type { OnUpdateSettingsProps } from "./JSFunctionSettings";

const LoadingContainer = styled(CenteredWrapper)`
  height: 50%;
`;

type Props = RouteComponentProps<{
  apiId: string;
  basePageId: string;
  baseCollectionId: string;
}>;

function JSEditor(props: Props) {
  const { baseCollectionId } = props.match.params;
  const pageId = useSelector(getCurrentPageId);
  const dispatch = useDispatch();
  const jsCollectionData = useSelector((state) =>
    getJSCollectionDataByBaseId(state, baseCollectionId),
  );
  const { isCreating } = useSelector((state) => state.ui.jsPane);
  const jsCollection = jsCollectionData?.config;

  const contextMenu = useMemo(() => {
    if (!jsCollection) {
      return null;
    }

    return (
      <AppJSEditorContextMenu jsCollection={jsCollection} pageId={pageId} />
    );
  }, [jsCollection, pageId]);

  if (isCreating) {
    return (
      <LoadingContainer>
        <Spinner size={30} />
      </LoadingContainer>
    );
  }

  const onUpdateSettings = (props: OnUpdateSettingsProps) => {
    dispatch(updateFunctionProperty(props));
  };

  if (!!jsCollection) {
    return (
      <JsEditorForm
        contextMenu={contextMenu}
        hideContextMenuOnEditor={Boolean(
          jsCollectionData?.config.isMainJSCollection,
        )}
        hideEditIconOnEditor={Boolean(
          jsCollectionData?.config.isMainJSCollection,
        )}
        jsCollectionData={jsCollectionData}
        onUpdateSettings={onUpdateSettings}
        saveJSObjectName={saveJSObjectName}
      />
    );
  }
  return <EntityNotFoundPane />;
}

export default Sentry.withProfiler(JSEditor);
