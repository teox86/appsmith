import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "../Input";
import { FormControl, FormError, FormHelper, FormLabel } from "./FormControl";

export default {
  title: "ADS/Components/FormControl",
  component: FormControl,
} as Meta<typeof FormControl>;

type Story = StoryObj<typeof FormControl>;

export const FormControlStory: Story = {
  name: "FormControl",
  args: {},
  render: (args) => (
    <FormControl {...args}>
      <FormLabel>Label</FormLabel>
      <Input placeholder="Control" />
      <FormHelper>Helper text</FormHelper>
      <FormError>Error message</FormError>
    </FormControl>
  ),
};
