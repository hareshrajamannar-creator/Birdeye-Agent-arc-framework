import React, { useState, useRef, useEffect } from 'react';
import AiWandIcon from '../../../Organisms/Panels/RHS/icons/ai_text_grammar_wand.svg';
import CloseIcon from '../../RHS/RHSHeader/icons/close.svg';
import DotsIcon from '../../../Organisms/Panels/RHS/icons/dots.svg';

const font = '"Roboto", arial, sans-serif';

const MOCK_GENERATED_FIELDS = [
  'sentiment_score',
  'key_themes',
  'staff_rating',
  'overall_experience',
  'recommendation_likelihood',
];

const menuItemBase = {
  display: 'flex', alignItems: 'center', gap: 4, width: '100%',
  background: 'none', border: 'none', padding: '8px', cursor: 'pointer',
  borderRadius: 4, textAlign: 'left', boxSizing: 'border-box',
};

const aiBoxStyle = {
  background: '#f9f7fd',
  border: '1px solid #6d36bf',
  borderRadius: 8,
  padding: '10px 20px',
  position: 'relative',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 80,
};

function Spinner() {
  return (
    <>
      <style>{`@keyframes of-spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{
        width: 16, height: 16, borderRadius: '50%',
        border: '2px solid #e5e9f0', borderTopColor: '#6d36bf',
        animation: 'of-spin 0.8s linear infinite', flexShrink: 0,
      }} />
    </>
  );
}

function MoreActionsMenu({ onClose, onRestore, onRegenerate }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: 'absolute', bottom: 28, left: 0, zIndex: 100,
      background: '#ffffff', borderRadius: 4,
      boxShadow: '0px 3px 14px 2px rgba(0,0,0,0.15)',
      padding: 8, width: 200,
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.8px', color: '#cccccc', textTransform: 'uppercase', fontFamily: font, padding: '0 8px', marginBottom: 8 }}>
          Generate
        </div>
        <button onClick={onRestore} style={{ ...menuItemBase, background: '#f9f7fd' }}>
          <i className="icon_phoenix-history" style={{ fontSize: 16, color: '#6834b7', flexShrink: 0 }} />
          <span style={{ fontSize: 13, lineHeight: '16px', color: '#6834b7', fontFamily: font }}>Restore original</span>
        </button>
        <button onClick={onRegenerate} style={menuItemBase}>
          <i className="icon_phoenix-restart_alt" style={{ fontSize: 16, color: '#212121', flexShrink: 0 }} />
          <span style={{ fontSize: 13, lineHeight: '16px', color: '#212121', fontFamily: font }}>Regenerate</span>
        </button>
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.8px', color: '#cccccc', textTransform: 'uppercase', fontFamily: font, padding: '0 8px', marginBottom: 8 }}>
          Modify
        </div>
        {[
          { icon: 'icon_phoenix-mic', label: 'Change tone', hasArrow: true },
          { icon: 'icon_phoenix-short_text', label: 'Make shorter' },
          { icon: 'icon_phoenix-notes', label: 'Make longer' },
          { icon: 'icon_phoenix-spellcheck', label: 'Fix spelling and grammar' },
        ].map(({ icon, label, hasArrow }) => (
          <button key={label} style={menuItemBase}>
            <i className={icon} style={{ fontSize: 16, color: '#212121', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, lineHeight: '16px', color: '#212121', fontFamily: font }}>{label}</span>
            {hasArrow && <i className="icon_phoenix-chevron_right" style={{ fontSize: 16, color: '#212121' }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OutputFields({ fields = [], onAddClick, showInfo }) {
  const [generateState, setGenerateState] = useState('idle'); // 'idle' | 'generating' | 'generated'
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  function handleGenerate() {
    setGenerateState('generating');
    setTimeout(() => setGenerateState('generated'), 2000);
  }

  function handleRegenerate() {
    setShowMoreMenu(false);
    setGenerateState('generating');
    setTimeout(() => setGenerateState('generated'), 2000);
  }

  function handleClose() {
    setGenerateState('idle');
    setShowMoreMenu(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18 }}>
        <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: '#212121', fontFamily: font, whiteSpace: 'nowrap' }}>
          Output fields
        </span>
        {showInfo && <i className="icon_phoenix-info" style={{ fontSize: 16, color: '#8f8f8f', cursor: 'pointer' }} />}
      </div>

      {generateState === 'idle' && (
        <div style={{ border: '1px solid #e5e9f0', borderRadius: 4, padding: '16px 10px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onAddClick} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <i className="icon_phoenix-add_circle" style={{ fontSize: 20, color: '#1976d2' }} />
              <span style={{ fontSize: 12, lineHeight: '18px', letterSpacing: '-0.24px', color: '#1976d2', fontFamily: font }}>Add</span>
            </button>
            <div style={{ width: 1, height: 16, background: '#e5e9f0', flexShrink: 0 }} />
            <button onClick={handleGenerate} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <img src={AiWandIcon} alt="Generate" style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: 12, lineHeight: '18px', letterSpacing: '-0.24px', color: '#8f8f8f', fontFamily: font }}>Generate from prompt</span>
            </button>
          </div>
        </div>
      )}

      {generateState === 'generating' && (
        <div style={aiBoxStyle}>
          <div style={{ position: 'absolute', bottom: 10, left: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Spinner />
            <span style={{ fontSize: 11, color: '#212121', opacity: 0.3, fontFamily: font }}>Generating summary</span>
          </div>
        </div>
      )}

      {generateState === 'generated' && (
        <div style={aiBoxStyle}>
          <button onClick={handleClose} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}>
            <img src={CloseIcon} alt="Close" style={{ width: 24, height: 24 }} />
          </button>
          <ul style={{ margin: '0 0 28px', padding: '0 0 0 16px', fontSize: 13, lineHeight: '21px', color: '#212121', fontFamily: font }}>
            {MOCK_GENERATED_FIELDS.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
            <button onClick={handleRegenerate} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <i className="icon_phoenix-restart_alt" style={{ fontSize: 16, color: '#6d36bf' }} />
              <span style={{ fontSize: 13, color: '#6d36bf', fontFamily: font }}>Regenerate</span>
            </button>
            <div style={{ width: 1, height: 13, background: '#d9d9d9', flexShrink: 0 }} />
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowMoreMenu((v) => !v)} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 4, cursor: 'pointer', borderRadius: '50%' }}>
                <img src={DotsIcon} alt="More options" style={{ width: 24, height: 24 }} />
              </button>
              {showMoreMenu && (
                <MoreActionsMenu
                  onClose={() => setShowMoreMenu(false)}
                  onRestore={handleClose}
                  onRegenerate={handleRegenerate}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {fields.map((f, i) => (
        <div key={i} style={{ fontSize: 12, lineHeight: '18px', color: '#212121', fontFamily: font, padding: '4px 0' }}>
          {f.fieldName} <span style={{ color: '#8f8f8f' }}>({f.fieldType})</span>
        </div>
      ))}
    </div>
  );
}
