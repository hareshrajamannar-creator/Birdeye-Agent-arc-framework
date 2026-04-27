import ExpandedRHSHeader from './ExpandedRHSHeader';

export default {
  title: 'Agent Builder/Molecules/Expanded RHS/ExpandedRHSHeader',
  component: ExpandedRHSHeader,
};

const noop = () => {};

export const Default = {
  args: { title: 'Task', onClose: noop },
};

export const TriggerTitle = {
  args: { title: 'Trigger', onClose: noop },
};

export const AgentDetails = {
  args: { title: 'Agent details', onClose: noop },
};
