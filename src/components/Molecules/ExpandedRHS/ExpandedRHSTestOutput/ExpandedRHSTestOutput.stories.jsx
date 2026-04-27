import React from 'react';
import ExpandedRHSTestOutput from './ExpandedRHSTestOutput';

export default {
  title: 'Agent Builder/Molecules/Expanded RHS/ExpandedRHSTestOutput',
  component: ExpandedRHSTestOutput,
};

const wrap = (children) => (
  <div style={{ width: 484, padding: 16, fontFamily: '"Roboto", arial, sans-serif' }}>
    {children}
  </div>
);

export const Default = {
  render: () => wrap(
    <ExpandedRHSTestOutput
      rows={[
        { type: 'variable', label: 'Identified_product', value: 'Root canal' },
      ]}
      onMenuOpen={(label) => console.log('menu opened for', label)}
    />
  ),
};

export const MultipleRows = {
  render: () => wrap(
    <ExpandedRHSTestOutput
      rows={[
        { type: 'variable', label: 'Identified_product', value: 'Root canal' },
        { type: 'document', label: 'Summary', value: 'Patient requires immediate attention' },
        { type: 'tool', label: 'Action_taken', value: 'Scheduled follow-up appointment' },
      ]}
      onMenuOpen={(label) => console.log('menu opened for', label)}
    />
  ),
};

export const WithEmptyValues = {
  render: () => wrap(
    <ExpandedRHSTestOutput
      rows={[
        { type: 'variable', label: 'Identified_product', value: '' },
        { type: 'variable', label: 'Summary', value: '' },
      ]}
      onMenuOpen={(label) => console.log('menu opened for', label)}
    />
  ),
};

export const Empty = {
  render: () => wrap(
    <ExpandedRHSTestOutput rows={[]} />
  ),
};
