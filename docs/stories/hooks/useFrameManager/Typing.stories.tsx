import { ComponentMeta, ComponentStory } from "@storybook/react";
import Typing from "./Typing";

export default {
  Title: "Typing",
} as ComponentMeta<typeof Typing>;

const Template: ComponentStory<typeof Typing> = () => {
  return <Typing />;
};

export const Default = Template.bind({});
