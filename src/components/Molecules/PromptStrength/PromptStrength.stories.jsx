import PromptStrength from './PromptStrength';

export default {
  title: 'Agent Builder/Molecules/PromptStrength',
  component: PromptStrength,
};

export const Weak = {
  args: { promptStrength: 'Weak', promptFillWidth: 52 },
};

export const Medium = {
  args: { promptStrength: 'Medium', promptFillWidth: 164 },
};

export const Strong = {
  args: { promptStrength: 'Strong', promptFillWidth: 328 },
};

export const WithToggle = {
  args: { promptStrength: 'Weak', promptFillWidth: 52, onToggle: () => {}, toggleLabel: 'View suggestions' },
};
