import { fn } from 'storybook/test';
import AppHeader from './AppHeader';

export default {
  title: 'Agent Builder/Molecules/Navigation/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onAdd: fn(),
    onHelp: fn(),
    onAvatar: fn(),
    onMenu: fn(),
  },
};

// Default — matches Figma 1:1 (add, help, avatar, menu icons right-aligned)
export const Default = {
  args: {
    user: { name: 'Jane Doe' },
  },
};

// No user — shows fallback initial
export const NoUser = {
  args: {},
};
