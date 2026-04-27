import React, { useState } from 'react';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import CloseIcon from '../RHSHeader/icons/close.svg';
import PromptStrength from '../../PromptStrength/PromptStrength';

const font = '"Roboto", arial, sans-serif';

const SUGGESTIONS = [
  'Add examples of reviews and expected outputs to improve accuracy',
  'Specify what to return if no product or service is mentioned',
];

export default function RHSPanelFooter({
  onSave,
  saveLabel = 'Save',
  disabled = false,
  showPromptStrength = false,
  promptStrength = 'Weak',
  promptFillWidth = 52,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: '#ffffff',
      borderBottom: '1px solid #e5e9f0',
      borderLeft: '1px solid #e5e9f0',
      borderRight: '1px solid #e5e9f0',
      borderRadius: '0 0 8px 8px',
      padding: '16px 16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      boxShadow: expanded ? '0px 2px 12px 0px rgba(33,33,33,0.06)' : 'none',
      transition: 'box-shadow 0.2s ease',
    }}>
      {showPromptStrength && expanded && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setExpanded(false)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              aria-label="Close suggestions"
            >
              <img src={CloseIcon} alt="Close" style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <p style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: '#8f8f8f', fontFamily: font, margin: 0 }}>
            Suggestions to improve your prompt
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {SUGGESTIONS.map((s) => (
              <li key={s} style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: '#8f8f8f', fontFamily: font }}>
                {s}
              </li>
            ))}
          </ul>
        </>
      )}
      {showPromptStrength && (
        <PromptStrength
          promptStrength={promptStrength}
          promptFillWidth={promptFillWidth}
          onToggle={() => setExpanded((v) => !v)}
          toggleLabel={expanded ? 'Hide' : 'View suggestions'}
        />
      )}
      <Button
        type="primary"
        label={saveLabel}
        expanded
        disabled={disabled}
        onClick={onSave}
      />
    </div>
  );
}
