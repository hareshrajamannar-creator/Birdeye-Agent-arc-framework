import RHSPanelHeader from './RHSHeader';

export default {
  title: 'Agent Builder/Molecules/RHS/RHSHeader',
  component: RHSPanelHeader,
};

export const Default = {
  args: {
    title: 'Agent details',
    onPreview: () => {},
    onExpand: () => {},
    onClose: () => {},
  },
};

export const WithoutActions = {
  args: {
    title: 'Agent details',
    showActions: false,
    onClose: () => {},
  },
};
