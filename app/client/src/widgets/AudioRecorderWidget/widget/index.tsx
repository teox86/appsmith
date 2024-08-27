import React from "react";

import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
// import { ValidationTypes } from "constants/WidgetValidation";
// import type { SetterConfig } from "entities/AppTheming";
import type { Stylesheet } from "entities/AppTheming";
import { createBlobUrl } from "utils/AppsmithUtils";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { FileDataTypes } from "WidgetProvider/constants";
import AudioRecorderComponent from "../component";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type {
  AnvilConfig,
  AutocompletionDefinitions,
} from "WidgetProvider/constants";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { ResponsiveBehavior } from "layoutSystems/common/utils/constants";
import IconSVG from "../icon.svg";
import ThumbnailSVG from "../thumbnail.svg";
import { WIDGET_TAGS } from "constants/WidgetConstants";
import { withAudioRecorderWidgetConfig } from "@appsmith/evaluation";

export interface AudioRecorderWidgetProps extends WidgetProps {
  accentColor: string;
  borderRadius: string;
  boxShadow?: string;
  iconColor: string;
  isDisabled: boolean;
  isValid: boolean;
  onRecordingStart?: string;
  onRecordingComplete?: string;
  blobURL?: string;
  isDirty: boolean;
}

class AudioRecorderWidget extends BaseWidget<
  AudioRecorderWidgetProps,
  WidgetState
> {
  static getConfig() {
    return {
      name: "Audio Recorder",
      iconSVG: IconSVG,
      thumbnailSVG: ThumbnailSVG,
      tags: [WIDGET_TAGS.EXTERNAL],
      needsMeta: true,
      searchTags: ["sound recorder", "voice recorder"],
    };
  }

  static getDefaults() {
    return {
      iconColor: "white",
      isDisabled: false,
      isVisible: true,
      rows: 7,
      columns: 16,
      widgetName: "AudioRecorder",
      version: 1,
      animateLoading: true,
      responsiveBehavior: ResponsiveBehavior.Fill,
      minWidth: FILL_WIDGET_MIN_WIDTH,
    };
  }

  static getAutoLayoutConfig() {
    return {
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "280px",
              minHeight: "70px",
            };
          },
        },
      ],
      disableResizeHandles: {
        vertical: true,
      },
    };
  }

  static getAnvilConfig(): AnvilConfig | null {
    return {
      isLargeWidget: false,
      widgetSize: {
        maxHeight: {},
        maxWidth: {},
        minHeight: { base: "70px" },
        minWidth: { base: "280px" },
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Audio recorder widget allows users to record using their microphone, listen to the playback, and export the data to a data source.",
      "!url": "https://docs.appsmith.com/widget-reference/recorder",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      blobURL: "string",
      dataURL: "string",
      rawBinary: "string",
    };
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      accentColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "none",
    };
  }

  handleRecordingStart = () => {
    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }

    if (this.props.blobURL) {
      URL.revokeObjectURL(this.props.blobURL);
    }
    this.props.updateWidgetMetaProperty("blobURL", null);
    this.props.updateWidgetMetaProperty("dataURL", undefined);
    this.props.updateWidgetMetaProperty("rawBinary", undefined);

    if (this.props.onRecordingStart) {
      super.executeAction({
        triggerPropertyName: "onRecordingStart",
        dynamicString: this.props.onRecordingStart,
        event: {
          type: EventType.ON_RECORDING_START,
        },
      });
    }
  };

  handleRecordingComplete = (blobUrl?: string, blob?: Blob) => {
    if (!blobUrl) {
      this.props.updateWidgetMetaProperty("blobURL", undefined);
      this.props.updateWidgetMetaProperty("dataURL", undefined);
      this.props.updateWidgetMetaProperty("rawBinary", undefined);
      return;
    }
    this.props.updateWidgetMetaProperty("blobURL", blobUrl);
    if (blob) {
      const blobIdForBase64 = createBlobUrl(blob, FileDataTypes.Base64);
      const blobIdForRaw = createBlobUrl(blob, FileDataTypes.Binary);

      this.props.updateWidgetMetaProperty("dataURL", blobIdForBase64, {
        triggerPropertyName: "onRecordingComplete",
        dynamicString: this.props.onRecordingComplete,
        event: {
          type: EventType.ON_RECORDING_COMPLETE,
        },
      });
      this.props.updateWidgetMetaProperty("rawBinary", blobIdForRaw, {
        triggerPropertyName: "onRecordingComplete",
        dynamicString: this.props.onRecordingComplete,
        event: {
          type: EventType.ON_RECORDING_COMPLETE,
        },
      });
    }
  };

  getWidgetView() {
    const { blobURL, componentHeight, componentWidth, iconColor, isDisabled } =
      this.props;

    return (
      <AudioRecorderComponent
        accentColor={this.props.accentColor}
        blobUrl={blobURL}
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        height={componentHeight}
        iconColor={iconColor}
        isDisabled={isDisabled}
        onRecordingComplete={this.handleRecordingComplete}
        onRecordingStart={this.handleRecordingStart}
        width={componentWidth}
      />
    );
  }
}

const AudioRecorderWidgetWithConfig =
  withAudioRecorderWidgetConfig(AudioRecorderWidget);

export default AudioRecorderWidgetWithConfig;
