import React from 'react';

const font = '"Roboto", arial, sans-serif';

const STRENGTH_COLOR = {
  Weak: '#de1b0c',
  Medium: '#fbc123',
  Strong: '#49a830',
};

export default function PromptStrength({
  promptStrength = 'Weak',
  promptFillWidth = 52,
  onToggle,
  toggleLabel = 'View suggestions',
}) {
  const strengthColor = STRENGTH_COLOR[promptStrength] || STRENGTH_COLOR.Weak;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 18 }}>
        <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', fontFamily: font, color: '#212121' }}>
          {'Prompt strength: '}
          <span style={{ color: strengthColor }}>{promptStrength}</span>
        </span>
        {onToggle && (
          <button
            onClick={onToggle}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, lineHeight: '18px', color: '#8f8f8f', fontFamily: font }}
          >
            {toggleLabel}
          </button>
        )}
      </div>
      <div style={{ position: 'relative', height: 5, width: '100%', borderRadius: 4, background: '#eaeaea' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: 5, width: promptFillWidth, borderRadius: 4, background: strengthColor }} />
      </div>
    </div>
  );
}
