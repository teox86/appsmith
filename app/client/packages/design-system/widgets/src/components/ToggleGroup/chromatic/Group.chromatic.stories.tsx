import React from "react";

import { StoryGrid } from "@design-system/storybook";
import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox, RadioGroup, Switch, ToggleGroup } from "@appsmith/wds";

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: "Design System/Widgets/Group",
};

export default meta;

type Story = StoryObj<typeof Switch>;

const items = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export const LightMode: Story = {
  render: () => (
    <StoryGrid>
      <RadioGroup defaultValue="1" items={items} />
      <ToggleGroup defaultValue={["1"]} items={items}>
        {({ label, value }) => (
          <Checkbox key={value} value={value}>
            {label}
          </Checkbox>
        )}
      </ToggleGroup>
      <ToggleGroup defaultValue={["1"]} items={items}>
        {({ label, value }) => (
          <Switch key={value} value={value}>
            {label}
          </Switch>
        )}
      </ToggleGroup>
    </StoryGrid>
  ),
};

export const DarkMode: Story = Object.assign({}, LightMode);

DarkMode.parameters = {
  colorMode: "dark",
};
