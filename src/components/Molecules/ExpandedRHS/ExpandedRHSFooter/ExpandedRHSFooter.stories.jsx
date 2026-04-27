import ExpandedRHSFooter from './ExpandedRHSFooter';

export default {
  title: 'Agent Builder/Molecules/Expanded RHS/ExpandedRHSFooter',
  component: ExpandedRHSFooter,
};

const noop = () => {};

export const Default = {
  args: { onCancel: noop, onSave: noop },
};

export const PromptWeak = {
  args: { onCancel: noop, onSave: noop, showPromptStrength: true, promptStrength: 'Weak', promptFillWidth: 83 },
};

export const PromptMedium = {
  args: { onCancel: noop, onSave: noop, showPromptStrength: true, promptStrength: 'Medium', promptFillWidth: 250 },
};

export const PromptStrong = {
  args: { onCancel: noop, onSave: noop, showPromptStrength: true, promptStrength: 'Strong', promptFillWidth: 550 },
};
