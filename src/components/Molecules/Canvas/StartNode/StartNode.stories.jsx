import React from 'react';
import StartNode from './StartNode';

export default {
  title: 'Agent Builder/Molecules/Canvas/StartNode',
  component: StartNode,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    title: 'Review response agent replying autonomously',
    subtitle: 'All locations',
  },
};

export const LongTitle = {
  args: {
    title: 'Automated review response agent with sentiment analysis and custom token detection',
    subtitle: '1001 - Mountain View, CA and 99 more',
  },
};
