import React from "react";
import { type Action } from "entities/Action";
import { EditorTheme } from "components/editorComponents/CodeEditor/EditorConfig";
import type { AutoGeneratedHeader } from "pages/Editor/APIEditor/helpers";
import { InfoFields } from "./InfoFields";
import { RequestTabs } from "./RequestTabs";
import { HintMessages } from "./HintMessages";
import { Flex } from "@appsmith/ads";

interface Props {
  httpMethodOptions: { value: string }[];
  action: Action;
  formName: string;
  isChangePermitted: boolean;
  bodyUIComponent: React.ReactNode;
  paginationUiComponent: React.ReactNode;
  headersCount: number;
  paramsCount: number;
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasourceHeaders?: any;
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasourceParams?: any;
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionConfigurationHeaders?: any;
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionConfigurationParams?: any;
  autoGeneratedActionConfigHeaders?: AutoGeneratedHeader[];
}

const CommonEditorForm = (props: Props) => {
  const { action } = props;
  const hintMessages = action.messages || [];
  const theme = EditorTheme.LIGHT;

  return (
    <Flex flexDirection="column" gap="spaces-3" w="100%">
      <InfoFields
        actionName={action.name}
        changePermitted={props.isChangePermitted}
        formName={props.formName}
        options={props.httpMethodOptions}
        pluginId={action.pluginId}
        theme={theme}
      />
      <HintMessages hintMessages={hintMessages} />
      <RequestTabs
        actionConfigurationHeaders={props.actionConfigurationHeaders}
        actionConfigurationParams={props.actionConfigurationParams}
        actionName={action.name}
        autogeneratedHeaders={props.autoGeneratedActionConfigHeaders}
        bodyUIComponent={props.bodyUIComponent}
        datasourceHeaders={props.datasourceHeaders}
        datasourceParams={props.datasourceParams}
        formName={props.formName}
        headersCount={props.headersCount}
        paginationUiComponent={props.paginationUiComponent}
        paramsCount={props.paramsCount}
        pushFields={props.isChangePermitted}
        showSettings={false}
        theme={theme}
      />
    </Flex>
  );
};

export default CommonEditorForm;
