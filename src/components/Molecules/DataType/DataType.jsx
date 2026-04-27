import React from 'react';
import {
  blue20, blue50, blue100,
  green20, green50, green300,
  gray30, gray60, gray300,
} from '@birdeye/elemental/core/sass/colors.js';
import './DataType.css';

const VARIANT_CONFIG = {
  variable: {
    icon: 'data_object',
    label: 'Variable',
    borderColor: blue50,
    iconBg: blue20,
    iconColor: blue100,
  },
  document: {
    icon: 'draft',
    label: 'Document',
    borderColor: green50,
    iconBg: green20,
    iconColor: green300,
  },
  link: {
    icon: 'link',
    label: 'link',
    borderColor: 'rgba(152, 0, 109, 0.2)',
    iconBg: '#ffe8f8',
    iconColor: '#98006d',
  },
  tool: {
    icon: 'build',
    label: 'Tool',
    borderColor: gray60,
    iconBg: gray30,
    iconColor: gray300,
  },
};

export default function DataType({ type = 'variable', label, onRemove }) {
  const config = VARIANT_CONFIG[type];
  const displayLabel = label ?? config.label;

  return (
    <div className="data-type" style={{ borderColor: config.borderColor }}>
      <div
        className="data-type__icon-container"
        style={{ background: config.iconBg, borderRightColor: config.borderColor, color: config.iconColor }}
      >
        <span className="material-symbols-outlined">{config.icon}</span>
      </div>
      <span className="data-type__label">{displayLabel}</span>
      {onRemove && (
        <button className="data-type__close" onClick={onRemove} aria-label="Remove">
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
}
