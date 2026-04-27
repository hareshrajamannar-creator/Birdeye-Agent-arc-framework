import LHSEntityGroup from './LHSEntityGroup';

export default {
  title: 'Agent Builder/Molecules/LHS/LHSEntityGroup',
  component: LHSEntityGroup,
  parameters: { layout: 'padded' },
};

export const ReviewEvent = {
  args: {
    title: 'Review event',
    nodeType: 'trigger',
    parentLabel: 'Reviews',
    items: [
      'When a new review is received',
      'When a review is updated',
      'When a review is responded',
      'When a new review is received or updated',
    ],
  },
};

export const InboxEvent = {
  args: {
    title: 'Inbox event',
    nodeType: 'trigger',
    parentLabel: 'Inbox',
    items: [
      'When a new message is received',
      'When a conversation is assigned',
      'When a conversation is closed',
    ],
  },
};

export const TaskEvent = {
  args: {
    title: 'Review task',
    nodeType: 'task',
    parentLabel: 'Review',
    items: [
      'Respond to a review',
      'Translate a review',
      'Categorize a review',
      'Analyze review sentiment',
    ],
  },
};
