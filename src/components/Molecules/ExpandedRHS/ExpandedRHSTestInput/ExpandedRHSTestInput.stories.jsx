import React from 'react';
import ExpandedRHSTestInput from './ExpandedRHSTestInput';

export default {
  title: 'Agent Builder/Molecules/Expanded RHS/ExpandedRHSTestInput',
  component: ExpandedRHSTestInput,
  parameters: { layout: 'padded' },
};

const wrap = (children) => (
  <div style={{ width: 484, fontFamily: '"Roboto", arial, sans-serif' }}>
    {children}
  </div>
);

export const Default = {
  render: () => wrap(
    <ExpandedRHSTestInput
      fields={[
        { name: 'review_text', type: 'variable', value: 'I went for a root canal, Mr.John was very professional' },
      ]}
      onMenuOpen={(name) => console.log('menu opened for', name)}
    />
  ),
};

export const MultipleFields = {
  render: () => wrap(
    <ExpandedRHSTestInput
      fields={[
        { name: 'review_text', type: 'variable', value: 'I went for a root canal, Mr.John was very professional' },
        { name: 'rating', type: 'variable', value: '5' },
        { name: 'source', type: 'variable', value: 'Google' },
      ]}
      onMenuOpen={(name) => console.log('menu opened for', name)}
    />
  ),
};

export const WithEmptyValues = {
  render: () => wrap(
    <ExpandedRHSTestInput
      fields={[
        { name: 'review_text', type: 'variable', value: '' },
        { name: 'rating', type: 'variable', value: '' },
      ]}
      onMenuOpen={(name) => console.log('menu opened for', name)}
    />
  ),
};

export const MixedTypes = {
  render: () => wrap(
    <ExpandedRHSTestInput
      fields={[
        { name: 'review_text', type: 'variable', value: 'Great service!' },
        { name: 'report', type: 'document', value: 'Monthly review report' },
        { name: 'profile_url', type: 'link', value: 'https://example.com/profile' },
      ]}
      onMenuOpen={(name) => console.log('menu opened for', name)}
    />
  ),
};
