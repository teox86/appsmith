import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { identifyEntityFromPath } from "../../navigation/FocusEntity";
import {
  getCurrentEntityInfo,
  isInSideBySideEditor,
} from "../../pages/Editor/utils";
import { getIDEViewMode } from "../../selectors/ideSelectors";

/**
 * Checks if current component is in side-by-side editor mode.
 */
export const useIsInSideBySideEditor = () => {
  const { pathname } = useLocation();
  const viewMode = useSelector(getIDEViewMode);
  const { appState, entity } = identifyEntityFromPath(pathname);
  const { segment } = getCurrentEntityInfo(entity);

  return isInSideBySideEditor({ appState, segment, viewMode });
};
