import React from 'react';
import LHSDrawer from './LHSDrawer';

export default {
  title: 'Agent Builder/Organisms/Panels/LHS',
  component: LHSDrawer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultTab: {
      control: 'select',
      options: ['Create with AI', 'Create manually'],
    },
    triggerOpen: { control: 'boolean' },
    tasksOpen: { control: 'boolean' },
    controlsOpen: { control: 'boolean' },
  },
};

export const CreateManually = {
  args: {
    defaultTab: 'Create manually',
    triggerOpen: true,
    tasksOpen: false,
    controlsOpen: false,
  },
};

export const CreateWithAI = {
  args: {
    defaultTab: 'Create with AI',
  },
};
