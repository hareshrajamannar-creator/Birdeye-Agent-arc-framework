import AIPromptBox from './AIPromptBox';

export default {
  title: 'Agent Builder/Molecules/Chat/AIPromptBox',
  component: AIPromptBox,
  parameters: { layout: 'padded' },
};

export const Default = {
  args: {
    onSend: (value) => console.log('Send:', value),
    onAttach: () => console.log('Attach'),
  },
};
