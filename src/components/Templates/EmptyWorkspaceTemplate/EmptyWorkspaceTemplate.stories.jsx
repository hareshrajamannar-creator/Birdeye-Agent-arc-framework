import EmptyWorkspaceTemplate from './EmptyWorkspaceTemplate';

export default {
  title: 'Agent Builder/Templates/AgentBuilderTemplate',
  component: EmptyWorkspaceTemplate,
  parameters: { layout: 'fullscreen' },
};

export const Empty = {
  args: {
    appTitle: 'Reviews AI',
    pageTitle: 'Review response agent  1',
    activeNavId: 'reviews',
    onCreateFromScratch: () => {},
    onUseTemplate: () => {},
  },
};
