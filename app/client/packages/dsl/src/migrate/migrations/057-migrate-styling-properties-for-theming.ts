/* eslint-disable @typescript-eslint/no-explicit-any */
import { clone, get, has, isEmpty, set } from "lodash";
import type { DSLWidget } from "../types";
import { isDynamicValue } from "../utils";

enum ButtonBorderRadiusTypes {
  SHARP = "SHARP",
  ROUNDED = "ROUNDED",
  CIRCLE = "CIRCLE",
}

enum BoxShadowTypes {
  NONE = "NONE",
  VARIANT1 = "VARIANT1",
  VARIANT2 = "VARIANT2",
  VARIANT3 = "VARIANT3",
  VARIANT4 = "VARIANT4",
  VARIANT5 = "VARIANT5",
}

export enum TextSizes {
  HEADING1 = "HEADING1",
  HEADING2 = "HEADING2",
  HEADING3 = "HEADING3",
  PARAGRAPH = "PARAGRAPH",
  PARAGRAPH2 = "PARAGRAPH2",
}

const THEMING_BORDER_RADIUS = {
  none: "0px",
  rounded: "0.375rem",
  circle: "9999px",
};

const THEMEING_TEXT_SIZES = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  md: "1.125rem",
  lg: "1.5rem",
  xl: "1.875rem",
  "2xl": "3rem",
  "3xl": "3.75rem",
};

const rgbaMigrationConstantV56 = "rgba(0, 0, 0, 0.25)";

const DEFAULT_BOXSHADOW = "none";

const ROOT_SCHEMA_KEY = "__root_schema__";

const Colors = {
  GREEN: "#03B365",
};

export const BUTTON_GROUP_CHILD_STYLESHEET = {
  button: {
    buttonColor: "{{appsmith.theme.colors.primaryColor}}",
  },
};

export const TABLE_WIDGET_CHILD_STYLESHEET = {
  button: {
    buttonColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  menuButton: {
    menuColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  iconButton: {
    menuColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
};

export const JSON_FORM_WIDGET_CHILD_STYLESHEET = {
  ARRAY: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
    cellBorderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    cellBoxShadow: "none",
  },
  OBJECT: {
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
    cellBorderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    cellBoxShadow: "none",
  },
  CHECKBOX: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
  },
  CURRENCY_INPUT: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  DATEPICKER: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  EMAIL_INPUT: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  MULTISELECT: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  MULTILINE_TEXT_INPUT: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  NUMBER_INPUT: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  PASSWORD_INPUT: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  PHONE_NUMBER_INPUT: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  RADIO_GROUP: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    boxShadow: "none",
  },
  SELECT: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
  SWITCH: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    boxShadow: "none",
  },
  TEXT_INPUT: {
    accentColor: "{{appsmith.theme.colors.primaryColor}}",
    borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    boxShadow: "none",
  },
};

/**
 * Recursive function to traverse through all the children of the JSON form in theming migration.
 * @param schemaItem
 * @param propertyPath
 * @param callback
 */
export const parseSchemaItem = (
  schemaItem: any,
  propertyPath: string,
  callback: (schemaItem: any, propertyPath: string) => void,
) => {
  // Update the theme stuff for this schema
  callback(schemaItem, propertyPath);

  if (schemaItem && !isEmpty(schemaItem.children)) {
    Object.values(schemaItem.children).forEach((schemaItem: any) => {
      const childPropertyPath = `${propertyPath}.children.${schemaItem.identifier}`;

      parseSchemaItem(schemaItem, childPropertyPath, callback);
    });
  }
};

/**
 * This function will add the given propertyName into the dynamicPropertyPathList.
 * @param propertyName
 * @param child
 */
export const addPropertyToDynamicPropertyPathList = (
  propertyName: string,
  child: DSLWidget,
) => {
  const isPropertyPathPresent = (child.dynamicPropertyPathList || []).find(
    (property: { key: string }) => property.key === propertyName,
  );

  if (!isPropertyPathPresent) {
    child.dynamicPropertyPathList = [
      ...(child.dynamicPropertyPathList || []),
      { key: propertyName },
    ];
  }
};

export const migrateStylingPropertiesForTheming = (currentDSL: DSLWidget) => {
  const widgetsWithPrimaryColorProp = [
    "DATE_PICKER_WIDGET2",
    "INPUT_WIDGET",
    "INPUT_WIDGET_V2",
    "LIST_WIDGET",
    "MULTI_SELECT_TREE_WIDGET",
    "DROP_DOWN_WIDGET",
    "TABS_WIDGET",
    "SINGLE_SELECT_TREE_WIDGET",
    "TABLE_WIDGET",
    "BUTTON_GROUP_WIDGET",
    "PHONE_INPUT_WIDGET",
    "CURRENCY_INPUT_WIDGET",
    "SELECT_WIDGET",
    "MULTI_SELECT_WIDGET_V2",
    "MULTI_SELECT_WIDGET",
  ];

  currentDSL.children = currentDSL.children?.map((child: DSLWidget) => {
    switch (child.borderRadius) {
      case ButtonBorderRadiusTypes.SHARP:
        child.borderRadius = THEMING_BORDER_RADIUS.none;
        break;
      case ButtonBorderRadiusTypes.ROUNDED:
        child.borderRadius = THEMING_BORDER_RADIUS.rounded;
        break;
      case ButtonBorderRadiusTypes.CIRCLE:
        child.borderRadius = THEMING_BORDER_RADIUS.circle;
        addPropertyToDynamicPropertyPathList("borderRadius", child);
        break;
      default:
        if (
          (child.type === "CONTAINER_WIDGET" ||
            child.type === "FORM_WIDGET" ||
            child.type === "JSON_FORM_WIDGET") &&
          child.borderRadius
        ) {
          child.borderRadius = `${child.borderRadius}px`;
          addPropertyToDynamicPropertyPathList("borderRadius", child);
        } else {
          child.borderRadius = THEMING_BORDER_RADIUS.none;
        }
    }

    switch (child.boxShadow) {
      case BoxShadowTypes.VARIANT1:
        child.boxShadow = `0px 0px 4px 3px ${
          child.boxShadowColor || "rgba(0, 0, 0, 0.25)"
        }`;
        addPropertyToDynamicPropertyPathList("boxShadow", child);
        break;
      case BoxShadowTypes.VARIANT2:
        child.boxShadow = `3px 3px 4px ${
          child.boxShadowColor || "rgba(0, 0, 0, 0.25)"
        }`;
        addPropertyToDynamicPropertyPathList("boxShadow", child);
        break;
      case BoxShadowTypes.VARIANT3:
        child.boxShadow = `0px 1px 3px ${
          child.boxShadowColor || "rgba(0, 0, 0, 0.25)"
        }`;
        addPropertyToDynamicPropertyPathList("boxShadow", child);
        break;
      case BoxShadowTypes.VARIANT4:
        child.boxShadow = `2px 2px 0px ${
          child.boxShadowColor || "rgba(0, 0, 0, 0.25)"
        }`;
        addPropertyToDynamicPropertyPathList("boxShadow", child);
        break;
      case BoxShadowTypes.VARIANT5:
        child.boxShadow = `-2px -2px 0px ${
          child.boxShadowColor || "rgba(0, 0, 0, 0.25)"
        }`;
        addPropertyToDynamicPropertyPathList("boxShadow", child);
        break;
      default:
        child.boxShadow = DEFAULT_BOXSHADOW;
    }

    /**
     * Migrates the textSize property present at the table level.
     */
    if (child.type === "TABLE_WIDGET") {
      switch (child.textSize) {
        case TextSizes.PARAGRAPH2:
          child.textSize = THEMEING_TEXT_SIZES.xs;
          addPropertyToDynamicPropertyPathList("textSize", child);
          break;
        case TextSizes.PARAGRAPH:
          child.textSize = THEMEING_TEXT_SIZES.sm;
          break;
        case TextSizes.HEADING3:
          child.textSize = THEMEING_TEXT_SIZES.base;
          break;
        case TextSizes.HEADING2:
          child.textSize = THEMEING_TEXT_SIZES.md;
          addPropertyToDynamicPropertyPathList("textSize", child);
          break;
        case TextSizes.HEADING1:
          child.textSize = THEMEING_TEXT_SIZES.lg;
          addPropertyToDynamicPropertyPathList("textSize", child);
          break;
        default:
          child.textSize = THEMEING_TEXT_SIZES.sm;
      }

      if (child.hasOwnProperty("primaryColumns")) {
        Object.keys(child.primaryColumns).forEach((key: string) => {
          /**
           * Migrates the textSize property present at the primaryColumn and derivedColumn level.
           */
          const column = child.primaryColumns[key];
          const isDerivedColumn =
            child.hasOwnProperty("derivedColumns") &&
            key in child.derivedColumns;
          const derivedColumn = child.derivedColumns[key];

          switch (column.textSize) {
            case TextSizes.PARAGRAPH2:
              column.textSize = THEMEING_TEXT_SIZES.xs;

              if (isDerivedColumn) {
                derivedColumn.textSize = THEMEING_TEXT_SIZES.xs;
              }

              addPropertyToDynamicPropertyPathList(
                `primaryColumns.${key}.textSize`,
                child,
              );
              break;
            case TextSizes.PARAGRAPH:
              column.textSize = THEMEING_TEXT_SIZES.sm;

              if (isDerivedColumn) {
                derivedColumn.textSize = THEMEING_TEXT_SIZES.sm;
              }

              break;
            case TextSizes.HEADING3:
              column.textSize = THEMEING_TEXT_SIZES.base;

              if (isDerivedColumn) {
                derivedColumn.textSize = THEMEING_TEXT_SIZES.base;
              }

              break;
            case TextSizes.HEADING2:
              column.textSize = THEMEING_TEXT_SIZES.md;

              if (isDerivedColumn) {
                derivedColumn.textSize = THEMEING_TEXT_SIZES.md;
              }

              addPropertyToDynamicPropertyPathList(
                `primaryColumns.${key}.textSize`,
                child,
              );
              break;
            case TextSizes.HEADING1:
              column.textSize = THEMEING_TEXT_SIZES.lg;

              if (isDerivedColumn) {
                derivedColumn.textSize = THEMEING_TEXT_SIZES.lg;
              }

              addPropertyToDynamicPropertyPathList(
                `primaryColumns.${key}.textSize`,
                child,
              );
              break;
          }

          /**
           * Migrate the borderRadius if exists for the primary columns and derived columns
           */
          if (!column.borderRadius) {
            column.borderRadius = THEMING_BORDER_RADIUS.none;

            if (isDerivedColumn) {
              derivedColumn.borderRadius = THEMING_BORDER_RADIUS.none;
            }
          }

          switch (column.borderRadius) {
            case ButtonBorderRadiusTypes.SHARP:
              column.borderRadius = THEMING_BORDER_RADIUS.none;

              if (isDerivedColumn) {
                derivedColumn.borderRadius = THEMING_BORDER_RADIUS.none;
              }

              break;
            case ButtonBorderRadiusTypes.ROUNDED:
              column.borderRadius = THEMING_BORDER_RADIUS.rounded;

              if (isDerivedColumn) {
                derivedColumn.borderRadius = THEMING_BORDER_RADIUS.rounded;
              }

              break;
            case ButtonBorderRadiusTypes.CIRCLE:
              column.borderRadius = THEMING_BORDER_RADIUS.circle;

              if (isDerivedColumn) {
                derivedColumn.borderRadius = THEMING_BORDER_RADIUS.circle;
              }

              break;
          }

          /**
           * Migrate the boxShadow if exists for the primary columns and derived columns:
           */
          const isBoxShadowColorDynamic = isDynamicValue(column.boxShadowColor);
          const newBoxShadowColor =
            column.boxShadowColor || rgbaMigrationConstantV56;

          if (column.boxShadow) {
            addPropertyToDynamicPropertyPathList(
              `primaryColumns.${key}.boxShadow`,
              child,
            );
          } else {
            column.boxShadow = "none";

            if (isDerivedColumn) {
              derivedColumn.boxShadow = "none";
            }
          }

          switch (column.boxShadow) {
            case BoxShadowTypes.VARIANT1:
              if (!isBoxShadowColorDynamic) {
                // Checks is boxShadowColor is not dynamic
                column.boxShadow = `0px 0px 4px 3px ${newBoxShadowColor}`;

                if (isDerivedColumn) {
                  derivedColumn.boxShadow = `0px 0px 4px 3px ${newBoxShadowColor}`;
                }

                delete column.boxShadowColor;
              } else {
                // Dynamic
                column.boxShadow = `0px 0px 4px 3px ${rgbaMigrationConstantV56}`;

                if (isDerivedColumn) {
                  derivedColumn.boxShadow = `0px 0px 4px 3px ${rgbaMigrationConstantV56}`;
                }
              }

              break;
            case BoxShadowTypes.VARIANT2:
              if (!isBoxShadowColorDynamic) {
                // Checks is boxShadowColor is not dynamic
                column.boxShadow = `3px 3px 4px ${newBoxShadowColor}`;

                if (isDerivedColumn) {
                  derivedColumn.boxShadow = `3px 3px 4px ${newBoxShadowColor}`;
                }

                delete column.boxShadowColor;
              } else {
                // Dynamic
                column.boxShadow = `3px 3px 4px ${rgbaMigrationConstantV56}`;

                if (isDerivedColumn) {
                  derivedColumn.boxShadow = `3px 3px 4px ${rgbaMigrationConstantV56}`;
                }
              }

              break;
            case BoxShadowTypes.VARIANT3:
              if (!isBoxShadowColorDynamic) {
                // Checks is boxShadowColor is not dynamic
                column.boxShadow = `0px 1px 3px ${newBoxShadowColor}`;

                if (isDerivedColumn) {
                  derivedColumn.boxShadow = `0px 1px 3px ${newBoxShadowColor}`;
                }

                delete column.boxShadowColor;
              } else {
                // Dynamic
                column.boxShadow = `0px 1px 3px ${rgbaMigrationConstantV56}`;

                if (isDerivedColumn) {
                  derivedColumn.boxShadow = `0px 1px 3px ${rgbaMigrationConstantV56}`;
                }
              }

              break;
            case BoxShadowTypes.VARIANT4:
              if (!isBoxShadowColorDynamic) {
                // Checks is boxShadowColor is not dynamic
                column.boxShadow = `2px 2px 0px ${newBoxShadowColor}`;

                if (isDerivedColumn) {
                  derivedColumn.boxShadow = `2px 2px 0px ${newBoxShadowColor}`;
                }

                delete column.boxShadowColor;
              } else {
                column.boxShadow = `2px 2px 0px ${rgbaMigrationConstantV56}`;

                if (isDerivedColumn) {
                  derivedColumn.boxShadow = `2px 2px 0px ${rgbaMigrationConstantV56}`;
                }
              }

              break;
            case BoxShadowTypes.VARIANT5:
              if (!isBoxShadowColorDynamic) {
                // Checks is boxShadowColor is not dynamic
                column.boxShadow = `-2px -2px 0px ${newBoxShadowColor}`;

                if (isDerivedColumn) {
                  derivedColumn.boxShadow = `-2px -2px 0px ${newBoxShadowColor}`;
                }

                delete column.boxShadowColor;
              } else {
                // Dynamic
                column.boxShadow = `-2px -2px 0px ${rgbaMigrationConstantV56}`;

                if (isDerivedColumn) {
                  derivedColumn.boxShadow = `-2px -2px 0px ${rgbaMigrationConstantV56}`;
                }
              }

              break;
          }
        });
      }
    }

    /**
     * Migrate the parent level properties for JSON Form
     */
    if (child.type === "JSON_FORM_WIDGET") {
      const parentLevelProperties = ["submitButtonStyles", "resetButtonStyles"];

      parentLevelProperties.forEach((propertyName: string) => {
        const propertyPathBorderRadius = `${propertyName}.borderRadius`;
        const propertyPathBoxShadow = `${propertyName}.boxShadow`;
        const propertyPathBoxShadowColor = `${propertyName}.boxShadowColor`;

        if (has(child, propertyPathBorderRadius)) {
          const jsonFormBorderRadius = get(child, propertyPathBorderRadius);

          switch (jsonFormBorderRadius) {
            case ButtonBorderRadiusTypes.SHARP:
              set(child, propertyPathBorderRadius, THEMING_BORDER_RADIUS.none);
              break;
            case ButtonBorderRadiusTypes.ROUNDED:
              set(
                child,
                propertyPathBorderRadius,
                THEMING_BORDER_RADIUS.rounded,
              );
              break;
            case ButtonBorderRadiusTypes.CIRCLE:
              set(
                child,
                propertyPathBorderRadius,
                THEMING_BORDER_RADIUS.circle,
              );
              addPropertyToDynamicPropertyPathList(
                propertyPathBorderRadius,
                child,
              );
              break;
            default:
              set(child, propertyPathBorderRadius, THEMING_BORDER_RADIUS.none);
          }
        } else {
          set(child, propertyPathBorderRadius, THEMING_BORDER_RADIUS.none);
        }

        if (has(child, propertyPathBoxShadow)) {
          const jsonFormBoxShadow = get(child, propertyPathBoxShadow);
          const boxShadowColor =
            (has(child, propertyPathBoxShadowColor) &&
              get(child, propertyPathBoxShadowColor)) ||
            "rgba(0, 0, 0, 0.25)";

          switch (jsonFormBoxShadow) {
            case BoxShadowTypes.VARIANT1:
              set(
                child,
                propertyPathBoxShadow,
                `0px 0px 4px 3px ${boxShadowColor}`,
              );
              addPropertyToDynamicPropertyPathList(
                propertyPathBoxShadow,
                child,
              );
              break;
            case BoxShadowTypes.VARIANT2:
              set(
                child,
                propertyPathBoxShadow,
                `3px 3px 4px ${boxShadowColor}`,
              );
              addPropertyToDynamicPropertyPathList(
                propertyPathBoxShadow,
                child,
              );
              break;
            case BoxShadowTypes.VARIANT3:
              set(
                child,
                propertyPathBoxShadow,
                `0px 1px 3px ${boxShadowColor}`,
              );
              addPropertyToDynamicPropertyPathList(
                propertyPathBoxShadow,
                child,
              );
              break;
            case BoxShadowTypes.VARIANT4:
              set(
                child,
                propertyPathBoxShadow,
                `2px 2px 0px ${boxShadowColor}`,
              );
              addPropertyToDynamicPropertyPathList(
                propertyPathBoxShadow,
                child,
              );
              break;
            case BoxShadowTypes.VARIANT5:
              set(
                child,
                propertyPathBoxShadow,
                `-2px -2px 0px ${boxShadowColor}`,
              );
              addPropertyToDynamicPropertyPathList(
                propertyPathBoxShadow,
                child,
              );
              break;
            default:
              set(child, propertyPathBoxShadow, DEFAULT_BOXSHADOW);
          }
        } else {
          set(child, propertyPathBoxShadow, DEFAULT_BOXSHADOW);
        }
      });

      /**
       * Migrate the children level properties for JSON form
       */
      if (has(child, "schema")) {
        const clonedSchema = clone(child.schema);

        parseSchemaItem(
          clonedSchema[ROOT_SCHEMA_KEY],
          `schema.${ROOT_SCHEMA_KEY}`,
          (schemaItem, propertyPath) => {
            if (schemaItem) {
              switch (schemaItem.labelTextSize) {
                case TextSizes.PARAGRAPH2:
                  schemaItem.labelTextSize = THEMEING_TEXT_SIZES.xs;
                  addPropertyToDynamicPropertyPathList(
                    `${propertyPath}.labelTextSize`,
                    child,
                  );
                  break;
                case TextSizes.PARAGRAPH:
                  schemaItem.labelTextSize = THEMEING_TEXT_SIZES.sm;
                  break;
                case TextSizes.HEADING3:
                  schemaItem.labelTextSize = THEMEING_TEXT_SIZES.base;
                  break;
                case TextSizes.HEADING2:
                  schemaItem.labelTextSize = THEMEING_TEXT_SIZES.md;
                  addPropertyToDynamicPropertyPathList(
                    `${propertyPath}.labelTextSize`,
                    child,
                  );
                  break;
                case TextSizes.HEADING1:
                  schemaItem.labelTextSize = THEMEING_TEXT_SIZES.lg;
                  addPropertyToDynamicPropertyPathList(
                    `${propertyPath}.labelTextSize`,
                    child,
                  );
                  break;
                default:
                  schemaItem.labelTextSize = THEMEING_TEXT_SIZES.sm;
              }

              // Set the default borderRadius
              !has(schemaItem, "borderRadius") &&
                set(schemaItem, "borderRadius", THEMING_BORDER_RADIUS.none);
              // Set the default borderRadius for the Item styles in an array type:
              !has(schemaItem, "cellBorderRadius") &&
                set(schemaItem, "cellBorderRadius", THEMING_BORDER_RADIUS.none);

              // Sets the default value for the boxShadow
              !has(schemaItem, "boxShadow") &&
                set(schemaItem, "boxShadow", DEFAULT_BOXSHADOW);

              // Sets the default value for the boxShadow property of Item styles inside an array:
              !has(schemaItem, "cellBoxShadow") &&
                set(schemaItem, "cellBoxShadow", DEFAULT_BOXSHADOW);

              // Sets default value as green for the accentColor(Most of the widgets require the below property):
              !has(schemaItem, "accentColor") &&
                set(schemaItem, "accentColor", Colors.GREEN);
            }
          },
        );

        child.schema = clonedSchema;
      }
    }

    switch (child.fontSize) {
      case TextSizes.PARAGRAPH2:
        child.fontSize = THEMEING_TEXT_SIZES.xs;
        addPropertyToDynamicPropertyPathList("fontSize", child);
        break;
      case TextSizes.PARAGRAPH:
        child.fontSize = THEMEING_TEXT_SIZES.sm;
        break;
      case TextSizes.HEADING3:
        child.fontSize = THEMEING_TEXT_SIZES.base;
        break;
      case TextSizes.HEADING2:
        child.fontSize = THEMEING_TEXT_SIZES.md;
        addPropertyToDynamicPropertyPathList("fontSize", child);
        break;
      case TextSizes.HEADING1:
        child.fontSize = THEMEING_TEXT_SIZES.lg;
        addPropertyToDynamicPropertyPathList("fontSize", child);
        break;
    }

    switch (child.labelTextSize) {
      case TextSizes.PARAGRAPH2:
        child.labelTextSize = THEMEING_TEXT_SIZES.xs;
        addPropertyToDynamicPropertyPathList("labelTextSize", child);
        break;
      case TextSizes.PARAGRAPH:
        child.labelTextSize = THEMEING_TEXT_SIZES.sm;
        break;
      case TextSizes.HEADING3:
        child.labelTextSize = THEMEING_TEXT_SIZES.base;
        break;
      case TextSizes.HEADING2:
        child.labelTextSize = THEMEING_TEXT_SIZES.md;
        addPropertyToDynamicPropertyPathList("labelTextSize", child);
        break;
      case TextSizes.HEADING1:
        child.labelTextSize = THEMEING_TEXT_SIZES.lg;
        addPropertyToDynamicPropertyPathList("labelTextSize", child);
        break;
      default:
        child.labelTextSize = THEMEING_TEXT_SIZES.sm;
    }

    /**
     * Add primaryColor color to missing widgets
     */
    if (widgetsWithPrimaryColorProp.includes(child.type)) {
      child.accentColor = "{{appsmith.theme.colors.primaryColor}}";

      child.dynamicBindingPathList = [
        ...(child.dynamicBindingPathList || []),
        {
          key: "accentColor",
        },
      ];
    }

    // specific fixes
    if (child.type === "AUDIO_RECORDER_WIDGET") {
      child.borderRadius = THEMING_BORDER_RADIUS.circle;
      child.accentColor = child.backgroundColor;
    }

    if (child.type === "FILE_PICKER_WIDGET_V2") {
      child.buttonColor = Colors.GREEN;
    }

    if (
      child.type === "CHECKBOX_WIDGET" ||
      child.type === "CHECKBOX_GROUP_WIDGET" ||
      child.type === "SWITCH_WIDGET" ||
      child.type === "SWITCH_GROUP_WIDGET"
    ) {
      child.accentColor = Colors.GREEN;
    }

    if (child.type === "TEXT_WIDGET") {
      child.fontFamily = "System Default";
    }

    // Adds childStyleSheets
    switch (child.type) {
      case "BUTTON_GROUP_WIDGET":
        child.childStylesheet = BUTTON_GROUP_CHILD_STYLESHEET;
        break;
      case "JSON_FORM_WIDGET":
        child.childStylesheet = JSON_FORM_WIDGET_CHILD_STYLESHEET;
        break;
      case "TABLE_WIDGET":
        child.childStylesheet = TABLE_WIDGET_CHILD_STYLESHEET;
        break;
    }

    if (child.children && child.children.length > 0) {
      child = migrateStylingPropertiesForTheming(child);
    }

    return child;
  });

  return currentDSL;
};
