import React, { useState, useRef, useEffect } from 'react';
import Modal from '@birdeye/elemental/core/atoms/Modal/index.js';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import {
  gray900, gray90, gray2000, red100, white,
} from '@birdeye/elemental/core/sass/js/colors.js';
import CloseIcon from '../../../Molecules/RHS/RHSHeader/icons/close.svg';

const font = '"Roboto", arial, sans-serif';

const FIELD_TYPE_OPTIONS = [
  'Text', 'Number', 'Boolean', 'Email', 'Phone number',
  'URL', 'Object', 'Date and time', 'Time',
  'Category - Multi select', 'Category - Single select',
];

function FieldTypeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = FIELD_TYPE_OPTIONS.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 8px 0 12px', border: `1px solid ${gray2000}`, borderRadius: 4,
          background: white, cursor: 'pointer', boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: 14, lineHeight: '20px', letterSpacing: '-0.28px', fontFamily: font, color: value ? gray900 : gray90 }}>
          {value || 'Select'}
        </span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
            <path d="M5 7.5L10 12.5L15 7.5" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
          background: white, borderRadius: 4,
          boxShadow: '0px 4px 8px 0px rgba(33,33,33,0.18)',
          paddingBottom: 12,
        }}>
          <div style={{ padding: '8px 20px 8px 16px' }}>
            <span style={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', letterSpacing: '-0.24px', color: gray90, fontFamily: font }}>
              Field type
            </span>
          </div>

          <div style={{ padding: '0 16px 4px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 36, border: `1px solid ${gray2000}`, borderRadius: 4,
              padding: '0 12px', boxSizing: 'border-box',
            }}>
              <i className="icon_phoenix-search" style={{ fontSize: 20, color: gray90, flexShrink: 0 }} />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: 14,
                  lineHeight: '20px', letterSpacing: '-0.28px', color: gray900,
                  fontFamily: font, background: 'transparent',
                }}
              />
            </div>
          </div>

          <div style={{ maxHeight: 240, overflowY: 'auto', padding: '4px 16px 0' }}>
            {filtered.map((opt) => {
              const selected = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', height: 36, padding: '0 8px 0 12px',
                    borderRadius: 4, border: 'none', cursor: 'pointer', boxSizing: 'border-box',
                    background: selected ? gray2000 : white, textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 14, lineHeight: '20px', letterSpacing: '-0.28px', fontFamily: font, color: gray900 }}>
                    {opt}
                  </span>
                  {selected && (
                    <i className="icon_phoenix-check" style={{ fontSize: 20, color: gray900, flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddOutputFieldModal({ onClose, onAdd }) {
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('');
  const [description, setDescription] = useState('');

  function handleAdd() {
    if (!fieldName || !fieldType) return;
    onAdd({ fieldName, fieldType, description });
    onClose();
  }

  return (
    <Modal
      dialogOptions={{
        isOpen: true,
        onCloseModal: onClose,
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEsc: true,
        showCloseIcon: false,
        title: 'Add output field',
        dialogStyles: {
          content: { padding: 0, maxWidth: 600 },
        },
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 12px' }}>
        <span style={{ fontSize: 16, fontWeight: 400, lineHeight: '24px', letterSpacing: '-0.32px', color: gray900, fontFamily: font }}>
          Add output field
        </span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}>
          <img src={CloseIcon} alt="Close" style={{ width: 24, height: 24 }} />
        </button>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '0 24px' }}>
        {/* Field name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: gray900, fontFamily: font }}>
              Field name
            </span>
            <span style={{ fontSize: 12, lineHeight: '18px', color: red100, fontFamily: font }}>*</span>
          </div>
          <input
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="Enter field name"
            style={{
              width: '100%', height: 36, border: `1px solid ${gray2000}`, borderRadius: 4,
              padding: '0 12px', fontSize: 14, lineHeight: '20px', letterSpacing: '-0.28px',
              color: gray900, fontFamily: font, outline: 'none', boxSizing: 'border-box',
              background: white,
            }}
          />
        </div>

        {/* Field type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: gray900, fontFamily: font }}>
              Field type
            </span>
            <span style={{ fontSize: 12, lineHeight: '18px', color: red100, fontFamily: font }}>*</span>
          </div>
          <FieldTypeDropdown value={fieldType} onChange={setFieldType} />
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: gray900, fontFamily: font }}>
            Description
          </span>
          <div style={{ position: 'relative', border: `1px solid ${gray2000}`, borderRadius: 4, height: 120, background: white }}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add optional instruction or examples to help generate this output"
              style={{
                width: '100%', height: '100%', border: 'none', outline: 'none', resize: 'none',
                padding: '8px 12px 32px', fontSize: 14, lineHeight: '20px', letterSpacing: '-0.28px',
                color: gray900, fontFamily: font, boxSizing: 'border-box', background: 'transparent',
              }}
            />
            <div style={{ position: 'absolute', bottom: 8, left: 11 }}>
              <i className="icon_phoenix-data_object" style={{ fontSize: 16, color: '#555555', cursor: 'pointer' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, padding: '12px 24px 24px' }}>
        <Button type="link" label="Cancel" onClick={onClose} />
        <Button type="primary" label="Add" onClick={handleAdd} disabled={!fieldName || !fieldType} />
      </div>
    </Modal>
  );
}
