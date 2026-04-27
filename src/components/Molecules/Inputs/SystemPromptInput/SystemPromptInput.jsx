import React, { useRef, useEffect, useCallback } from 'react';
import ExpandAllIcon from '../../RHS/RHSHeader/icons/expand_all.svg';
import ExpandAllBtnIcon from '../icons/expand_all.svg';
import EditNoteIcon from '../icons/edit_note.svg';

const font = '"Roboto", arial, sans-serif';
const LINE_HEIGHT = 20;
const MAX_LINES = 8;
const MAX_TEXTAREA_HEIGHT = MAX_LINES * LINE_HEIGHT + 8 + 8; // padding top + bottom

export default function SystemPromptInput({ value, onChange, onFieldIconClick, required }) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18 }}>
        <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: '#212121', fontFamily: font, whiteSpace: 'nowrap' }}>
          System prompt
        </span>
        {required && <span style={{ fontSize: 12, lineHeight: '18px', color: '#de1b0c', fontFamily: font }}>*</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #e5e9f0', borderRadius: 4, boxSizing: 'border-box', background: '#ffffff', width: '100%' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          placeholder="Enter prompt"
          rows={1}
          style={{
            width: '100%', border: 'none', outline: 'none', resize: 'none',
            padding: '8px 12px', fontSize: 14, fontWeight: 400, lineHeight: `${LINE_HEIGHT}px`,
            letterSpacing: '-0.28px', color: '#212121', fontFamily: font,
            boxSizing: 'border-box', background: 'transparent', overflowY: 'hidden',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 11px', height: 44, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={ExpandAllBtnIcon} alt="Expand all" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={onFieldIconClick} />
            <img src={EditNoteIcon} alt="Edit note" style={{ width: 20, height: 20, cursor: 'pointer' }} />
          </div>
          <img src={ExpandAllIcon} alt="Expand" style={{ width: 20, height: 20, transform: 'rotate(90deg)', cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );
}
