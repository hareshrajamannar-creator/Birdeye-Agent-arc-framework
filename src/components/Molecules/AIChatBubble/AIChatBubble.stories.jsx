import React from 'react';
import AIChatBubble from './AIChatBubble';

export default {
  title: 'Agent Builder/Molecules/Chat/AIChatBubble',
  component: AIChatBubble,
  parameters: { layout: 'padded' },
};

export const Default = {
  args: {
    message: "Hi! I'm here to help you build your Review response agent. Tell me what you'd like to build",
    options: [
      'Replying using templates',
      'Replying autonomously',
      'Replying after human approval',
      'Suggesting replies in dashboard',
    ],
    onOptionSelect: (opt) => console.log('Selected:', opt),
  },
};

export const MessageOnly = {
  args: {
    message: "Hi! I'm here to help you build your agent.",
    options: [],
  },
};
