import { useCallback } from "react";

import { createNewJSCollection } from "actions/jsPaneActions";
import { SEARCH_ITEM_TYPES } from "components/editorComponents/GlobalSearch/utils";
import { EDITOR_PANE_TEXTS, createMessage } from "ee/constants/messages";
import { ADD_PATH } from "ee/constants/routes/appRoutes";
import type { UseRoutes } from "ee/entities/IDE/constants";
import { getJSUrl } from "ee/pages/Editor/IDE/EditorPane/JS/utils";
import type { GroupedAddOperations } from "ee/pages/Editor/IDE/EditorPane/Query/hooks";
import { useModuleOptions } from "ee/utils/moduleInstanceHelpers";
import { FocusEntity, identifyEntityFromPath } from "navigation/FocusEntity";
import { JsFileIconV2 } from "pages/Editor/Explorer/ExplorerIcons";
import AddJS from "pages/Editor/IDE/EditorPane/JS/Add";
import JSEditor from "pages/Editor/JSEditor";
import { JSBlankState } from "pages/Editor/JSEditor/JSBlankState";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentPageId } from "selectors/editorSelectors";
import history from "utils/history";

export const useJSAdd = () => {
  const pageId = useSelector(getCurrentPageId);
  const dispatch = useDispatch();
  const currentEntityInfo = identifyEntityFromPath(location.pathname);
  const moduleCreationOptions = useModuleOptions();
  const jsModuleCreationOptions = moduleCreationOptions.filter(
    (opt) => opt.focusEntityType === FocusEntity.JS_MODULE_INSTANCE,
  );

  const openAddJS = useCallback(() => {
    if (jsModuleCreationOptions.length === 0) {
      dispatch(createNewJSCollection(pageId, "ENTITY_EXPLORER"));
    } else {
      if (currentEntityInfo.entity === FocusEntity.JS_OBJECT_ADD) {
        return;
      }
      const url = getJSUrl(currentEntityInfo, true);
      history.push(url);
    }
  }, [jsModuleCreationOptions, pageId, dispatch, currentEntityInfo]);

  const closeAddJS = useCallback(() => {
    const url = getJSUrl(currentEntityInfo, false);
    history.push(url);
  }, [currentEntityInfo]);

  return { openAddJS, closeAddJS };
};

export const useIsJSAddLoading = () => {
  const moduleCreationOptions = useModuleOptions();
  const jsModuleCreationOptions = moduleCreationOptions.filter(
    (opt) => opt.focusEntityType === FocusEntity.JS_MODULE_INSTANCE,
  );
  const { isCreating } = useSelector((state) => state.ui.jsPane);
  if (jsModuleCreationOptions.length === 0) {
    return isCreating;
  }
  return false;
};

export const useGroupedAddJsOperations = (): GroupedAddOperations => {
  return [
    {
      className: "t--blank-js",
      operations: [
        {
          title: createMessage(EDITOR_PANE_TEXTS.js_blank_object_item),
          desc: "",
          icon: JsFileIconV2(16, 16),
          kind: SEARCH_ITEM_TYPES.actionOperation,
          action: (pageId) => createNewJSCollection(pageId, "ENTITY_EXPLORER"),
        },
      ],
    },
  ];
};

export const useJSEditorRoutes = (path: string): UseRoutes => {
  return [
    {
      exact: true,
      key: "AddJS",
      component: AddJS,
      path: [`${path}${ADD_PATH}`, `${path}/:baseCollectionId${ADD_PATH}`],
    },
    {
      exact: true,
      key: "JSEditor",
      component: JSEditor,
      path: [path + "/:baseCollectionId"],
    },
    {
      key: "JSEmpty",
      component: JSBlankState,
      exact: true,
      path: [path],
    },
  ];
};
