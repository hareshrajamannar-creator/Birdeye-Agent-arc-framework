import React from 'react';
import CloseIcon from './icons/close.svg';

const font = '"Roboto", arial, sans-serif';

export default function ExpandedRHSHeader({ title = 'Title', onClose }) {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: '#ffffff',
      borderRadius: '8px 8px 0 0',
      borderBottom: '1px solid #e5e9f0',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      width: '100%',
    }}>
      <span style={{
        flex: 1,
        fontSize: 18,
        fontWeight: 400,
        lineHeight: '26px',
        letterSpacing: '-0.36px',
        color: '#212121',
        fontFamily: font,
      }}>
        {title}
      </span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', borderRadius: 4 }}
        aria-label="Close"
      >
        <img src={CloseIcon} alt="Close" style={{ width: 24, height: 24, display: 'block' }} />
      </button>
    </div>
  );
}
