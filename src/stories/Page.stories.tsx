import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Page } from "./Page";

export default {
  title: "Example/Page",
  component: Page,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = (args) => <Page {...args} />;

export const FullPage = Template.bind({});

const LoopingScrollPage: ComponentStory<typeof Page> = (args) => (
  <Page {...args} loopingScroll={true} />
);

export const LoopingPage = LoopingScrollPage.bind({});
