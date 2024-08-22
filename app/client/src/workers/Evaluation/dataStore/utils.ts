import { isAction, isJSAction } from "ee/workers/Evaluation/evaluationUtils";
import type { DataTree } from "entities/DataTree/dataTreeTypes";
import { get, isEmpty, set } from "lodash";

import type { TDataStore } from ".";

export function updateTreeWithData(tree: DataTree, dataStore: TDataStore) {
  if (isEmpty(dataStore)) return;
  for (const entityName of Object.keys(tree)) {
    const entity = tree[entityName];
    if (!dataStore.hasOwnProperty(entityName)) continue;
    if (isAction(entity)) {
      set(entity, "data", get(dataStore, `${entityName}.data`));
    }
    if (isJSAction(entity)) {
      const allFunctionsInStore = Object.keys(dataStore[entityName]);
      allFunctionsInStore.forEach((functionName) => {
        set(
          entity[functionName],
          `data`,
          get(dataStore, `${entityName}.${functionName}.data`),
        );
      });
    }
  }
}
