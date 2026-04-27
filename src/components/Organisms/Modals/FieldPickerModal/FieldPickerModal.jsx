import React, { useState } from 'react';
import Modal from '@birdeye/elemental/core/atoms/Modal/index.js';
import { gray900, gray90, gray2000, white } from '@birdeye/elemental/core/sass/js/colors.js';
import CloseIcon from '../../../Molecules/RHS/RHSHeader/icons/close.svg';

const font = '"Roboto", arial, sans-serif';

const MOCK_NODES = [
  {
    id: 1,
    label: '1.Trigger',
    fields: ['Review.source', 'Review.sentiment', 'Review.rating', 'Review.spam', 'Review.comment'],
  },
  {
    id: 2,
    label: '2.Task: Identify relevant...',
    fields: ['Task.input', 'Task.output', 'Task.score', 'Task.tags'],
  },
  {
    id: 3,
    label: '3.Task: custom tokens',
    fields: ['Token.id', 'Token.value', 'Token.type', 'Token.scope', 'Token.expiry'],
  },
  {
    id: 4,
    label: '4.Task: Generate resp...',
    fields: ['Response.text', 'Response.status'],
  },
  {
    id: 5,
    label: '5.Task : Send a review r...',
    fields: ['Review.id', 'Review.author', 'Review.date', 'Review.channel', 'Review.body'],
  },
];

function FieldChip({ name, index }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2,
      border: '1px solid #d1e5f9', borderRadius: 4,
      background: white, flexShrink: 0,
    }}>
      <div style={{
        background: '#ecf5fd', borderRight: '1px solid #d1e5f9',
        height: 24, width: 25, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <i className="icon_phoenix-data_object" style={{ fontSize: 14, color: '#1976d2' }} />
      </div>
      <span style={{
        fontSize: 12, lineHeight: '16px', color: '#555555',
        fontFamily: font, whiteSpace: 'nowrap', paddingRight: 9,
      }}>
        {index + 1}. {name}
      </span>
    </div>
  );
}

export default function FieldPickerModal({ onClose, onSelectField }) {
  const [activeTab, setActiveTab] = useState('local');
  const [search, setSearch] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(1);

  const selectedNode = MOCK_NODES.find((n) => n.id === selectedNodeId);
  const filteredFields = selectedNode
    ? selectedNode.fields.filter((f) => f.toLowerCase().includes(search.toLowerCase()))
    : [];

  const tabStyle = (tab) => ({
    display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start',
    justifyContent: 'flex-end', flexShrink: 0, cursor: 'pointer',
  });

  const tabLabelStyle = (tab) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: 32, padding: 8, borderRadius: 4,
    fontSize: 14, lineHeight: '20px', letterSpacing: '-0.28px',
    fontFamily: font, fontWeight: 400, background: 'none', border: 'none', cursor: 'pointer',
    color: activeTab === tab ? '#212121' : '#555555',
  });

  return (
    <Modal
      dialogOptions={{
        isOpen: true,
        onCloseModal: onClose,
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEsc: true,
        showCloseIcon: false,
        title: 'Fields',
        dialogStyles: {
          content: { padding: 0, maxWidth: 480, width: 480 },
        },
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 12px' }}>
        <span style={{ fontSize: 16, fontWeight: 400, lineHeight: '24px', letterSpacing: '-0.32px', color: gray900, fontFamily: font }}>
          Fields
        </span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}>
          <img src={CloseIcon} alt="Close" style={{ width: 24, height: 24 }} />
        </button>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 24px 24px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, background: white }}>
          {[{ key: 'system', label: 'System' }, { key: 'local', label: 'Local' }].map(({ key, label }) => (
            <div key={key} style={tabStyle(key)} onClick={() => setActiveTab(key)}>
              <button style={tabLabelStyle(key)}>{label}</button>
              <div style={{
                height: 1, width: '100%',
                background: '#1976d2',
                opacity: activeTab === key ? 1 : 0,
              }} />
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          height: 36, border: `1px solid ${gray2000}`, borderRadius: 4,
          padding: '0 12px', boxSizing: 'border-box', width: '100%',
        }}>
          <i className="icon_phoenix-search" style={{ fontSize: 20, color: gray90, flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 14,
              lineHeight: '20px', color: gray900, fontFamily: font, background: 'transparent',
            }}
          />
        </div>

        {/* Two-panel content */}
        <div style={{ display: 'flex', gap: 10, height: 156, overflow: 'hidden' }}>
          {/* Left: node list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, width: 182, overflowY: 'auto' }}>
            {MOCK_NODES.map((node) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    height: 28, padding: 8, borderRadius: 2,
                    background: isSelected ? '#f2f4f7' : white,
                    border: 'none', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                  }}
                >
                  <span style={{
                    flex: 1, fontSize: 12, lineHeight: '18px', fontFamily: font,
                    color: isSelected ? '#212121' : '#555555',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    textAlign: 'left',
                  }}>
                    {node.label}
                  </span>
                  <span style={{ fontSize: 12, lineHeight: '18px', color: '#8f8f8f', fontFamily: font, flexShrink: 0 }}>
                    {node.fields.length}
                  </span>
                  <i className="icon_phoenix-chevron_right" style={{ fontSize: 16, color: '#8f8f8f', flexShrink: 0 }} />
                </button>
              );
            })}
          </div>

          {/* Right: field chips */}
          <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignContent: 'flex-start' }}>
              {filteredFields.map((field, i) => (
                <div
                  key={field}
                  onClick={() => onSelectField && onSelectField(field)}
                  style={{ cursor: onSelectField ? 'pointer' : 'default' }}
                >
                  <FieldChip name={field} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
