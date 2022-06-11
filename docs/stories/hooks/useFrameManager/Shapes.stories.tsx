import { ComponentMeta, ComponentStory } from "@storybook/react";
import Shapes from "./Shapes";

export default {
  Title: "Typing",
} as ComponentMeta<typeof Shapes>;

const Template: ComponentStory<typeof Shapes> = () => {
  return <Shapes />;
};

export const Default = Template.bind({});
