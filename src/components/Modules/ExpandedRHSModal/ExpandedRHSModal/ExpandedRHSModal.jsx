import React from 'react';
import ExpandedRHSHeader from '../../../Molecules/ExpandedRHS/ExpandedRHSHeader/ExpandedRHSHeader';
import ExpandedRHSFooter from '../../../Molecules/ExpandedRHS/ExpandedRHSFooter/ExpandedRHSFooter';

const font = '"Roboto", arial, sans-serif';

const DIVIDER = (
  <div style={{ width: 1, background: '#e5e9f0', flexShrink: 0 }} />
);

export default function ExpandedRHSModal({
  title = 'Title',
  onCancel,
  onSave,
  onClose,
  showPromptStrength = false,
  promptStrength = 'Weak',
  promptFillWidth = 52,
  formContent,
  testContent,
  viewOnly = false,
}) {
  const noop = () => {};
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      background: '#ffffff',
      borderRadius: 8,
      fontFamily: font,
      overflow: 'hidden',
    }}>
      <ExpandedRHSHeader
        title={title}
        onClose={onClose || noop}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ pointerEvents: viewOnly ? 'none' : undefined, userSelect: viewOnly ? 'text' : undefined }}>
            {formContent}
          </div>
        </div>
        {DIVIDER}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#fafafa' }}>
          {testContent}
        </div>
      </div>

      {viewOnly ? (
        <div style={{
          borderTop: '1px solid #eaeaea',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#ffffff',
          borderRadius: '0 0 8px 8px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#8f8f8f' }}>visibility</span>
          <span style={{ fontSize: 12, color: '#8f8f8f', fontFamily: font, letterSpacing: '-0.24px' }}>
            View only — editing is disabled
          </span>
        </div>
      ) : (
        <ExpandedRHSFooter
          onCancel={onCancel || noop}
          onSave={onSave || noop}
          showPromptStrength={showPromptStrength}
          promptStrength={promptStrength}
          promptFillWidth={promptFillWidth}
        />
      )}
    </div>
  );
}
