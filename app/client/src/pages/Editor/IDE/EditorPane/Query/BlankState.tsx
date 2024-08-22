import React from "react";

import { EDITOR_PANE_TEXTS, createMessage } from "ee/constants/messages";
import { FEATURE_FLAG } from "ee/entities/FeatureFlag";
import { useQueryAdd } from "ee/pages/Editor/IDE/EditorPane/Query/hooks";
import { getHasCreateActionPermission } from "ee/utils/BusinessFeatures/permissionPageHelpers";
import { useSelector } from "react-redux";
import { getPagePermissions } from "selectors/editorSelectors";
import { useFeatureFlag } from "utils/hooks/useFeatureFlag";

import { EmptyState } from "../components/EmptyState";

const BlankState: React.FC = () => {
  const pagePermissions = useSelector(getPagePermissions);
  const isFeatureEnabled = useFeatureFlag(FEATURE_FLAG.license_gac_enabled);
  const canCreateActions = getHasCreateActionPermission(
    isFeatureEnabled,
    pagePermissions,
  );
  const { openAddQuery } = useQueryAdd();

  return (
    <EmptyState
      buttonClassName="t--add-item"
      buttonTestId="t--add-item"
      buttonText={createMessage(EDITOR_PANE_TEXTS.query_add_button)}
      description={createMessage(
        EDITOR_PANE_TEXTS.query_blank_state_description,
      )}
      icon={"queries-v3"}
      onClick={canCreateActions ? openAddQuery : undefined}
    />
  );
};

export { BlankState };
