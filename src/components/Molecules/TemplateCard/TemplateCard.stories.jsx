import TemplateCard from './TemplateCard';

export default {
  title: 'Agent Builder/Molecules/TemplateCard',
  component: TemplateCard,
};

export const Default = {
  args: {
    title: 'This is the title of the template',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    onUse: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
