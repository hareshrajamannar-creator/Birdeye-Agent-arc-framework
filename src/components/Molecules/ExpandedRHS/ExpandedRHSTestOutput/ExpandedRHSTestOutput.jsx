import React, { useState } from 'react';
import DataType from '../../DataType/DataType';

const font = '"Roboto", arial, sans-serif';

const colHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  height: 40,
  padding: '0 16px',
  background: '#fff',
  boxSizing: 'border-box',
  flexShrink: 0,
};

const colHeaderLabelStyle = {
  fontFamily: font,
  fontSize: 12,
  fontWeight: 400,
  lineHeight: '18px',
  letterSpacing: '-0.24px',
  color: '#555',
  whiteSpace: 'nowrap',
};

const chevronStyle = {
  fontSize: 16,
  width: 16,
  height: 16,
  lineHeight: 1,
  overflow: 'hidden',
  color: '#555',
  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20",
  flexShrink: 0,
  userSelect: 'none',
};

export default function ExpandedRHSTestOutput({ rows = [], onMenuOpen }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 8, border: '1px solid #e9e9eb', overflow: 'hidden', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e9e9eb' }}>
        <div style={{ ...colHeaderStyle, width: 186 }}>
          <span style={colHeaderLabelStyle}>Output fields</span>
          <span className="material-symbols-outlined" style={chevronStyle}>expand_more</span>
        </div>
        <div style={{ ...colHeaderStyle, flex: 1, minWidth: 0, borderLeft: '1px solid #e9e9eb' }}>
          <span style={colHeaderLabelStyle}>Values</span>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoveredRow(i)}
          onMouseLeave={() => setHoveredRow(null)}
          style={{
            display: 'flex',
            borderBottom: i < rows.length - 1 ? '1px solid #e9e9eb' : 'none',
            minHeight: 58,
          }}
        >
          <div style={{ width: 186, flexShrink: 0, display: 'flex', alignItems: 'center', padding: 16, background: '#fff', boxSizing: 'border-box' }}>
            <DataType type={row.type || 'variable'} label={row.label} />
          </div>

          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', padding: '16px 8px 16px 16px', background: '#fff', borderLeft: '1px solid #e9e9eb', boxSizing: 'border-box', gap: 8 }}>
            <span style={{
              flex: 1,
              minWidth: 0,
              fontFamily: font,
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 'normal',
              color: row.value ? '#212121' : '#aaa',
              fontStyle: row.value ? 'normal' : 'italic',
              wordBreak: 'break-word',
            }}>
              {row.value || 'No value'}
            </span>
            <button
              onClick={() => onMenuOpen?.(row.label)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, flexShrink: 0, background: 'none', border: 'none',
                padding: 0, cursor: 'pointer', color: '#555', borderRadius: 4,
                visibility: hoveredRow === i ? 'visible' : 'hidden',
              }}
              aria-label={`Options for ${row.label}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, width: 20, height: 20, lineHeight: 1, overflow: 'hidden', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                more_vert
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
