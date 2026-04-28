import React from 'react';
import ExpandedRHSTest from './ExpandedRHSTest';

export default {
  title: 'Agent Builder/Molecules/Expanded RHS/ExpandedRHSTest',
  component: ExpandedRHSTest,
  parameters: { layout: 'fullscreen' },
};

const wrap = (children) => (
  <div style={{ width: 520, height: '100vh', padding: 24, background: '#fafafa', boxSizing: 'border-box' }}>
    {children}
  </div>
);

export const Empty = {
  render: () => wrap(
    <ExpandedRHSTest />
  ),
};

export const WithInputOnly = {
  render: () => wrap(
    <ExpandedRHSTest
      inputFields={[
        { name: 'review_text', type: 'variable', value: 'I went for a root canal, Mr.John was very professional' },
      ]}
    />
  ),
};

export const WithOutputOnly = {
  render: () => wrap(
    <ExpandedRHSTest
      outputFields={[
        { label: 'Identified_product', type: 'variable', value: 'Root canal' },
      ]}
    />
  ),
};

export const Filled = {
  render: () => wrap(
    <ExpandedRHSTest
      inputFields={[
        { name: 'review_text', type: 'variable', value: 'I went for a root canal, Mr.John was very professional' },
      ]}
      outputFields={[
        { label: 'Identified_product', type: 'variable', value: 'Root canal' },
      ]}
      onMenuOpen={(name) => console.log('menu opened for', name)}
    />
  ),
};
