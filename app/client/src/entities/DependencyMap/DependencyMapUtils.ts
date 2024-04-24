import toposort from "toposort";
import type DependencyMap from ".";
import { IMMEDIATE_PARENT_REGEX } from "@appsmith/workers/Evaluation/evaluationUtils";

type SortDependencies =
  | {
      success: true;
      sortedDependencies: string[];
    }
  | { success: false; cyclicNode: string; error: unknown };

export class DependencyMapUtils {
  // inspired by https://www.npmjs.com/package/toposort#sorting-dependencies
  static sortDependencies(dependencyMap: DependencyMap): SortDependencies {
    const dependencyTree: Array<[string, string | undefined]> = [];
    const dependencies = dependencyMap.rawDependencies;
    for (const [node, deps] of dependencies.entries()) {
      if (deps.size) {
        deps.forEach((dep) => dependencyTree.push([node, dep]));
      } else {
        // Set no dependency
        dependencyTree.push([node, undefined]);
      }
    }

    try {
      const sortedDependencies = toposort(dependencyTree)
        .reverse()
        .filter((edge) => !!edge);
      return { success: true, sortedDependencies };
    } catch (error) {
      // Cyclic dependency found. Extract node
      const cyclicNodes = (error as Error).message.match(
        new RegExp('Cyclic dependency, node was:"(.*)"'),
      );
      const node = cyclicNodes ? cyclicNodes[1] : "";
      return { success: false, cyclicNode: node, error };
    }
  }

  static makeParentsDependOnChildren(dependencyMap: DependencyMap) {
    const dependencies = dependencyMap.rawDependencies;
    for (const [node, deps] of dependencies.entries()) {
      this.makeParentsDependOnChild(dependencyMap, node);
      deps.forEach((dep) => {
        this.makeParentsDependOnChild(dependencyMap, dep);
      });
    }
    return dependencyMap;
  }
  public static makeParentsDependOnChildCollection = (
    dependencyMap: DependencyMap,
    childCollection: string[],
  ) => {
    childCollection.forEach((child) => {
      this.makeParentsDependOnChild(dependencyMap, child);
    });
  };

  static makeParentsDependOnChild = (
    dependencyMap: DependencyMap,
    child: string,
  ) => {
    let curKey = child;
    let matches: string[] | null;

    while ((matches = curKey.match(IMMEDIATE_PARENT_REGEX)) !== null) {
      const immediateParent = matches[1];
      const existingImmediateParentDeps =
        dependencyMap.getDirectDependencies(immediateParent) || [];
      const existingImmediateParentDepsSet = new Set(
        existingImmediateParentDeps,
      );
      // Add child to immediate parent's dependencies if not already present
      // don't perform addDependency unnecessarily
      if (!existingImmediateParentDepsSet.has(curKey)) {
        existingImmediateParentDeps.push(curKey);
        dependencyMap.addDependency(
          immediateParent,
          existingImmediateParentDeps,
        );
      }
      curKey = immediateParent;
    }
  };
}
