import {
  changeWorkspaceUserRoleSaga,
  createWorkspaceSaga,
  deleteWorkspaceLogoSaga,
  deleteWorkspaceSaga,
  deleteWorkspaceUserSaga,
  fetchAllRolesSaga,
  fetchAllUsersSaga,
  fetchAllWorkspacesSaga,
  fetchEntitiesOfWorkspaceSaga,
  fetchWorkspaceSaga,
  saveWorkspaceSaga,
  searchWorkspaceEntitiesSaga,
  uploadWorkspaceLogoSaga,
} from "ce/sagas/WorkspaceSagas";
import { ReduxActionTypes } from "ee/constants/ReduxActionConstants";
import { all, takeLatest } from "redux-saga/effects";

export * from "ce/sagas/WorkspaceSagas";

export default function* workspaceSagas() {
  yield all([
    takeLatest(
      ReduxActionTypes.FETCH_ALL_WORKSPACES_INIT,
      fetchAllWorkspacesSaga,
    ),
    takeLatest(
      ReduxActionTypes.FETCH_ENTITIES_OF_WORKSPACE_INIT,
      fetchEntitiesOfWorkspaceSaga,
    ),
    takeLatest(ReduxActionTypes.FETCH_CURRENT_WORKSPACE, fetchWorkspaceSaga),
    takeLatest(ReduxActionTypes.SAVE_WORKSPACE_INIT, saveWorkspaceSaga),
    takeLatest(ReduxActionTypes.CREATE_WORKSPACE_INIT, createWorkspaceSaga),
    takeLatest(ReduxActionTypes.FETCH_ALL_USERS_INIT, fetchAllUsersSaga),
    takeLatest(ReduxActionTypes.FETCH_ALL_ROLES_INIT, fetchAllRolesSaga),
    takeLatest(
      ReduxActionTypes.DELETE_WORKSPACE_USER_INIT,
      deleteWorkspaceUserSaga,
    ),
    takeLatest(
      ReduxActionTypes.CHANGE_WORKSPACE_USER_ROLE_INIT,
      changeWorkspaceUserRoleSaga,
    ),
    takeLatest(ReduxActionTypes.DELETE_WORKSPACE_INIT, deleteWorkspaceSaga),
    takeLatest(ReduxActionTypes.UPLOAD_WORKSPACE_LOGO, uploadWorkspaceLogoSaga),
    takeLatest(ReduxActionTypes.REMOVE_WORKSPACE_LOGO, deleteWorkspaceLogoSaga),
    takeLatest(
      ReduxActionTypes.SEARCH_WORKSPACE_ENTITIES_INIT,
      searchWorkspaceEntitiesSaga,
    ),
  ]);
}
