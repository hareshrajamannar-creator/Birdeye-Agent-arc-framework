import { fn } from 'storybook/test';
import Header from './Header';

export default {
  title: 'Agent Builder/Molecules/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onSearch: fn(),
    onFilter: fn(),
  },
};

// Default — title + search + primary CTA + filter (matches Figma 1:1)
export const Default = {
  args: {
    title: 'Review response agents',
    primaryAction: { label: 'Create agent', onClick: fn() },
    showSearch: true,
    showFilter: true,
  },
};

// Title only — no CTAs
export const TitleOnly = {
  args: {
    title: 'Review response agents',
    showSearch: false,
    showFilter: false,
  },
};

// Without primary action
export const SearchAndFilterOnly = {
  args: {
    title: 'Analytics',
    showSearch: true,
    showFilter: true,
  },
};

// Without filter
export const WithoutFilter = {
  args: {
    title: 'Workflows',
    primaryAction: { label: 'New workflow', onClick: fn() },
    showSearch: true,
    showFilter: false,
  },
};

// Without search
export const WithoutSearch = {
  args: {
    title: 'Settings',
    primaryAction: { label: 'Save changes', onClick: fn() },
    showSearch: false,
    showFilter: false,
  },
};
