import RHSPanelFooter from './RHSFooter';

export default {
  title: 'Agent Builder/Molecules/RHS/RHSFooter',
  component: RHSPanelFooter,
};

export const Default = {
  args: { onSave: () => {} },
};

export const PromptWeak = {
  args: { onSave: () => {}, showPromptStrength: true, promptStrength: 'Weak', promptFillWidth: 52 },
};

export const PromptMedium = {
  args: { onSave: () => {}, showPromptStrength: true, promptStrength: 'Medium', promptFillWidth: 164 },
};

export const PromptStrong = {
  args: { onSave: () => {}, showPromptStrength: true, promptStrength: 'Strong', promptFillWidth: 328 },
};
