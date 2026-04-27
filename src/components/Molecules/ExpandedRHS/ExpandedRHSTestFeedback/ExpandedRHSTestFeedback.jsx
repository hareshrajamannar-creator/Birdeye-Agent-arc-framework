import React, { useRef, useEffect, useCallback } from 'react';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';

const font = '"Roboto", arial, sans-serif';
const LINE_HEIGHT = 20;
const MAX_LINES = 6;
const MAX_TEXTAREA_HEIGHT = MAX_LINES * LINE_HEIGHT + 8 + 8;

export default function ExpandedRHSTestFeedback({ value, onChange, onSubmit }) {
  const textareaRef = useRef(null);

  const resize = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const capped = Math.min(ta.scrollHeight, MAX_TEXTAREA_HEIGHT);
    ta.style.height = capped + 'px';
    ta.style.overflowY = ta.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden';
  }, []);

  useEffect(() => { resize(); }, [value, resize]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18 }}>
        <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: '#555555', fontFamily: font, whiteSpace: 'nowrap' }}>
          Your feedback
        </span>
      </div>
      <div style={{ border: '1px solid #e5e9f0', borderRadius: 4, background: '#ffffff', boxSizing: 'border-box', width: '100%', padding: '8px 12px' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          placeholder="Output look wrong? Provide feedback to improve your prompt"
          rows={4}
          style={{
            width: '100%', border: 'none', outline: 'none', resize: 'none',
            padding: 0, fontSize: 14, fontWeight: 400, lineHeight: `${LINE_HEIGHT}px`,
            letterSpacing: '-0.28px', color: '#212121', fontFamily: font,
            boxSizing: 'border-box', background: 'transparent', overflowY: 'hidden',
            minHeight: 66,
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <Button
          type="tertiary-outline"
          label="Submit to revise prompt"
          size="small"
          disabled={!value || !value.trim()}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
}
