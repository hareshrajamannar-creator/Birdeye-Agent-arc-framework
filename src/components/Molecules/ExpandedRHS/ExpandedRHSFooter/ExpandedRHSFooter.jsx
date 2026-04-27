import React from 'react';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import PromptStrength from '../../PromptStrength/PromptStrength';

export default function ExpandedRHSFooter({
  onCancel,
  onSave,
  showPromptStrength = false,
  promptStrength = 'Weak',
  promptFillWidth = 83,
}) {
  return (
    <div style={{
      position: 'sticky',
      bottom: 0,
      zIndex: 10,
      background: '#ffffff',
      borderTop: '1px solid #eaeaea',
      borderRadius: '0 0 8px 8px',
      padding: '8px 24px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      boxSizing: 'border-box',
      width: '100%',
    }}>
      <div style={{ flex: 1 }}>
        {showPromptStrength && (
          <PromptStrength
            promptStrength={promptStrength}
            promptFillWidth={promptFillWidth}
          />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button type="link" label="Cancel" onClick={onCancel} />
        <Button type="primary" label="Save" onClick={onSave} />
      </div>
    </div>
  );
}
