import { AppState } from "reducers";

type GetFormData = (
  state: AppState,
  apiId: string,
) => { label: string; value: string };

export const getDisplayFormat: GetFormData = (state, apiId) => {
  const displayFormat = state.ui.apiPane.extraformData[apiId];
  return displayFormat;
};

export const getApiPaneSelectedTabIndex = (state: AppState) =>
  state.ui.apiPane.selectedTabIndex;
