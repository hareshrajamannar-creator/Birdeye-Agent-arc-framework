import React from 'react';
import DataType from './DataType';

export default {
  title: 'Agent Builder/Molecules/DataType',
  component: DataType,
  parameters: { layout: 'padded' },
  argTypes: {
    type: { control: 'select', options: ['variable', 'document', 'link', 'tool'] },
  },
};

const wrap = (Story) => (
  <div style={{ padding: 16 }}>
    <Story />
  </div>
);

export const Variable = {
  args: { type: 'variable' },
  decorators: [wrap],
};

export const Document = {
  args: { type: 'document' },
  decorators: [wrap],
};

export const Link = {
  args: { type: 'link' },
  decorators: [wrap],
};

export const Tool = {
  args: { type: 'tool' },
  decorators: [wrap],
};

export const AllVariants = {
  render: () => (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <DataType type="variable" />
      <DataType type="document" />
      <DataType type="link" />
      <DataType type="tool" />
    </div>
  ),
};
