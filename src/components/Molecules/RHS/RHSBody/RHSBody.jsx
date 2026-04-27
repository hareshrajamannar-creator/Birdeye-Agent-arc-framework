import React from 'react';

export default function RHSBody({ children }) {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px 15px',
      boxSizing: 'border-box',
    }}>
      {children}
    </div>
  );
}
