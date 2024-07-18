import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@design-system/headless";
import type { ChangeEvent } from "react";
import React from "react";
import type { SetterConfig } from "entities/AppTheming";
import type { DerivedPropertiesMap } from "WidgetProvider/factory";
import * as config from "./../config";
import BaseWidget from "widgets/BaseWidget";
import { Text } from "@design-system/widgets";
import type { TextWidgetProps } from "./types";
import type { WidgetState } from "widgets/BaseWidget";
import type { AnvilConfig } from "WidgetProvider/constants";
import styles from "./styles.module.css";
import { Select, Option, ToggleButton, SegmentedControl } from "design-system";

class ChangeWidgetPropertyEvent extends CustomEvent<{
  widgetId: string;
  properties: Record<string, any>;
}> {
  constructor(widgetId: string, properties: Record<string, any>) {
    super("CHANGE_WIDGET_PROPERTY", {
      bubbles: true,
      cancelable: true,
      detail: {
        widgetId: widgetId,
        properties,
      },
    });
  }
}

class WDSParagraphWidget extends BaseWidget<TextWidgetProps, WidgetState> {
  ref: HTMLDivElement | null = null;

  static type = "WDS_PARAGRAPH_WIDGET";

  static getConfig() {
    return config.metaConfig;
  }

  static getFeatures() {
    return config.featuresConfig;
  }

  static getDefaults() {
    return config.defaultsConfig;
  }

  static getMethods() {
    return config.methodsConfig;
  }

  static getAnvilConfig(): AnvilConfig | null {
    return config.anvilConfig;
  }

  static getAutocompleteDefinitions() {
    return config.autocompleteConfig;
  }

  static getPropertyPaneContentConfig() {
    return config.propertyPaneContentConfig;
  }

  static getPropertyPaneStyleConfig() {
    return config.propertyPaneStyleConfig;
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      value: `{{ this.text }}`,
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {};
  }

  static getSetterConfig(): SetterConfig {
    return config.settersConfig;
  }

  resolveFontStyle = (isBold: boolean, isItalic: boolean) => {
    if (isBold && isItalic) {
      return "italic,bold";
    }

    if (isBold) {
      return "bold";
    }

    if (isItalic) {
      return "italic";
    }

    return "";
  };

  dispatchPropertiesChange = (properties: Record<string, any>) => {
    this.ref?.dispatchEvent(
      new ChangeWidgetPropertyEvent(this.props.widgetId, properties),
    );
  };

  handleTextChange = (event: ChangeEvent<HTMLDivElement>) => {
    this.dispatchPropertiesChange({
      text: event.target.textContent,
    });
  };

  handleToggleBoldFontStyle = () => {
    this.dispatchPropertiesChange({
      fontStyle: this.resolveFontStyle(
        !this.props.fontStyle.includes("bold"),
        this.props.fontStyle.includes("italic"),
      ),
    });
  };

  handleToggleItalicFontStyle = () => {
    this.dispatchPropertiesChange({
      fontStyle: this.resolveFontStyle(
        this.props.fontStyle.includes("bold"),
        !this.props.fontStyle.includes("italic"),
      ),
    });
  };

  handleTextAlignChange = (align: string) => {
    this.dispatchPropertiesChange({
      textAlign: align,
    });
  };

  handleFontSizeChange = (align: string) => {
    this.dispatchPropertiesChange({
      fontSize: align,
    });
  };

  getWidgetView() {
    return (
      <TooltipRoot open={this.props.isWidgetSelected} placement="bottom">
        <TooltipTrigger>
          <div
            className={styles.editableText}
            contentEditable={this.props.isWidgetSelected}
            onBlur={this.handleTextChange}
            ref={(ref) => (this.ref = ref)}
          >
            <Text
              isBold={this.props?.fontStyle?.includes("bold")}
              isItalic={this.props?.fontStyle?.includes("italic")}
              lineClamp={
                this.props.lineClamp ? this.props.lineClamp : undefined
              }
              size={this.props.fontSize}
              textAlign={this.props.textAlign}
              title={this.props.lineClamp ? this.props.text : undefined}
            >
              {this.props.text}
            </Text>
          </div>
        </TooltipTrigger>
        <TooltipContent className={styles.floatingPanel} hasArrow={false}>
          <Select
            value={this.props.fontSize}
            className={styles.fontSelect}
            onSelect={this.handleFontSizeChange}
            placeholder="Font Size"
          >
            <Option value="body">Body</Option>
            <Option value="subtitle">Subtitle</Option>
            <Option value="title">Title</Option>
            <Option value="heading">Heading</Option>
          </Select>
          <SegmentedControl
            className={styles.fontAlignSegmentedControl}
            value={this.props.textAlign}
            isFullWidth
            onChange={this.handleTextAlignChange}
            options={[
              {
                endIcon: "left-align",
                value: "left",
              },
              {
                endIcon: "center-align",
                value: "center",
              },
              {
                endIcon: "right-align",
                value: "right",
              },
            ]}
          />
          <ToggleButton
            className={styles.fontStyleButton}
            icon="text-bold"
            isSelected={this.props.fontStyle.includes("bold")}
            onClick={this.handleToggleBoldFontStyle}
            size="lg"
          />
          <ToggleButton
            className={styles.fontStyleButton}
            icon="text-italic"
            isSelected={this.props.fontStyle.includes("italic")}
            onClick={this.handleToggleItalicFontStyle}
            size="lg"
          />
        </TooltipContent>
      </TooltipRoot>
    );
  }
}

export { WDSParagraphWidget };
