import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import { ValidationTypes } from "constants/WidgetValidation";
import { AutocompleteDataType } from "utils/autocomplete/CodemirrorTernService";
import type { RangeSliderWidgetProps } from "..";
import {
  endValueValidation,
  maxValueValidation,
  minRangeValidation,
  minValueValidation,
  startValueValidation,
  stepSizeValidation,
} from "../../validations";

export default [
  {
    sectionName: "Data",
    children: [
      {
        propertyName: "min",
        helpText: "Sets the min value of the widget",
        label: "Min. Value",
        controlType: "INPUT_TEXT",
        placeholderText: "0",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: minValueValidation,
            expected: {
              type: "number",
              example: "0",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
      {
        propertyName: "max",
        helpText: "Sets the max value of the widget",
        label: "Max. Value",
        controlType: "INPUT_TEXT",
        placeholderText: "100",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: maxValueValidation,
            expected: {
              type: "number",
              example: "100",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
      {
        propertyName: "step",
        helpText: "The amount by which the slider value should increase",
        label: "Step Size",
        controlType: "INPUT_TEXT",
        placeholderText: "10",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: stepSizeValidation,
            expected: {
              type: "number",
              example: "1",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
      {
        propertyName: "minRange",
        helpText: "Sets the min range of the widget",
        label: "Min. Range",
        controlType: "INPUT_TEXT",
        placeholderText: "10",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: minRangeValidation,
            expected: {
              type: "number",
              example: "1",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
      {
        propertyName: "defaultStartValue",
        helpText: "Sets the start value of the widget",
        label: "Default Start Value",
        controlType: "INPUT_TEXT",
        placeholderText: "Start Value:",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: startValueValidation,
            expected: {
              type: "number",
              example: "20",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
      {
        propertyName: "defaultEndValue",
        helpText: "Sets the end value of the widget",
        label: "Default End Value",
        controlType: "INPUT_TEXT",
        placeholderText: "End Value:",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: endValueValidation,
            expected: {
              type: "number",
              example: "40",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
    ],
  },
  {
    sectionName: "Label",
    children: [
      {
        helpText: "Sets the label text of the widget",
        propertyName: "labelText",
        label: "Text",
        controlType: "INPUT_TEXT",
        placeholderText: "Enter label text",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        helpText: "Sets the label position of the widget",
        propertyName: "labelPosition",
        label: "Position",
        controlType: "ICON_TABS",
        fullWidth: true,
        options: [
          { label: "Left", value: LabelPosition.Left },
          { label: "Top", value: LabelPosition.Top },
        ],
        defaultValue: LabelPosition.Left,
        isBindProperty: false,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        helpText: "Sets the label alignment of the widget",
        propertyName: "labelAlignment",
        label: "Alignment",
        controlType: "LABEL_ALIGNMENT_OPTIONS",
        options: [
          {
            icon: "LEFT_ALIGN",
            value: Alignment.LEFT,
          },
          {
            icon: "RIGHT_ALIGN",
            value: Alignment.RIGHT,
          },
        ],
        isBindProperty: false,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (props: RangeSliderWidgetProps) =>
          props.labelPosition !== LabelPosition.Left,
        dependencies: ["labelPosition"],
      },
      {
        helpText: "Sets the label width of the widget as the number of columns",
        propertyName: "labelWidth",
        label: "Width (in columns)",
        controlType: "NUMERIC_INPUT",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        min: 0,
        validation: {
          type: ValidationTypes.NUMBER,
          params: {
            natural: true,
          },
        },
        hidden: (props: RangeSliderWidgetProps) =>
          props.labelPosition !== LabelPosition.Left,
        dependencies: ["labelPosition"],
      },
    ],
  },
  {
    sectionName: "General",
    children: [
      {
        helpText: "Show help text or details about current input",
        propertyName: "labelTooltip",
        label: "Tooltip",
        controlType: "INPUT_TEXT",
        placeholderText: "Value must be atleast 6 chars",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "showMarksLabel",
        helpText: "Show the marks label below the slider",
        label: "Show Marks",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        helpText: "Display Value Marks",
        propertyName: "marks",
        label: "Marks",
        controlType: "INPUT_TEXT",
        placeholderText: '[{ "value": "20", "label": "20%" }]',
        isBindProperty: true,
        isTriggerProperty: false,
        hidden: (props: RangeSliderWidgetProps) => !props.showMarksLabel,
        dependencies: ["showMarksLabel"],
        validation: {
          type: ValidationTypes.ARRAY,
          params: {
            unique: ["value"],
            children: {
              type: ValidationTypes.OBJECT,
              params: {
                required: true,
                allowedKeys: [
                  {
                    name: "value",
                    type: ValidationTypes.NUMBER,
                    params: {
                      default: "",
                      requiredKey: true,
                    },
                  },
                  {
                    name: "label",
                    type: ValidationTypes.TEXT,
                    params: {
                      default: "",
                      requiredKey: true,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        propertyName: "isVisible",
        helpText: "Controls the visibility of the widget",
        label: "Visible",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "isDisabled",
        label: "Disabled",
        controlType: "SWITCH",
        helpText: "Disables clicks to this widget",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "animateLoading",
        label: "Animate Loading",
        controlType: "SWITCH",
        helpText: "Controls the loading of the widget",
        defaultValue: true,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "tooltipAlwaysOn",
        helpText: "Keep showing the label with value",
        label: "Show value always",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
    ],
  },
  {
    sectionName: "Events",
    children: [
      {
        helpText: "Triggers an action when a user changes the slider value",
        propertyName: "onStartValueChange",
        label: "onStartValueChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
      {
        helpText: "Triggers an action when a user changes the slider value",
        propertyName: "onEndValueChange",
        label: "onEndValueChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
];
