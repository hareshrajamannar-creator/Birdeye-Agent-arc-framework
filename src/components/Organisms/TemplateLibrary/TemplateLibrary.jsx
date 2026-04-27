import React, { useState, useRef, useEffect } from 'react';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import TemplateCard from '../../Molecules/TemplateCard/TemplateCard';

const font = '"Roboto", sans-serif';

const DEFAULT_TEMPLATES = [
  { id: '1', title: 'Review response agent replying using templates', description: 'Uses pre-defined templates and responds to reviews automatically.' },
  { id: '2', title: 'Review response agent replying autonomously', description: 'Uses AI to analyze review sentiment, generates and posts unique, context aware replies automatically.' },
  { id: '3', title: 'Review response agent replying after human approval', description: 'Uses AI to analyze review sentiment, generates and sends unique, context-aware replies for a human approval before posting.' },
  { id: '4', title: 'Review response agent suggesting replies in dashboard', description: 'Uses AI to analyze review sentiment, generates and shows unique, context-aware replies in the dashboard for one-click manual posting.' },
];

function TemplateListView({ templates, onUseTemplate }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!openMenuId) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  return (
    <div style={{ width: '100%', fontFamily: font }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', height: 48, padding: '0 4px', borderBottom: '1px solid #e9e9eb', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: '#555' }}>Name</span>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#555', lineHeight: 1 }}>expand_more</span>
        </div>
      </div>

      {/* Rows */}
      {templates.map((t) => {
        const isHovered = hoveredId === t.id;
        const isMenuOpen = openMenuId === t.id;
        return (
          <div
            key={t.id}
            onMouseEnter={() => setHoveredId(t.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', height: 60,
              padding: '0 4px', borderBottom: '1px solid #e5e9f0',
              background: isHovered || isMenuOpen ? '#f2f4f7' : '#fff',
            }}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
              <span style={{
                fontSize: 14, fontWeight: 400, lineHeight: '20px', letterSpacing: '-0.28px',
                color: isHovered || isMenuOpen ? '#1976d2' : '#212121',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {t.title}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px',
                color: '#8f8f8f',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {t.description}
              </span>
            </div>
            <div style={{ position: 'relative', flexShrink: 0, opacity: isHovered || isMenuOpen ? 1 : 0 }} ref={isMenuOpen ? menuRef : null}>
              <Button
                theme="noBorder"
                customIcon={<span className="material-symbols-outlined" style={{ fontSize: 20, color: '#555', lineHeight: 1 }}>more_vert</span>}
                onClick={() => setOpenMenuId(isMenuOpen ? null : t.id)}
              />
              {isMenuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', zIndex: 100,
                  background: '#fff',
                  boxShadow: '0px 4px 8px 0px rgba(33,33,33,0.18)',
                  borderRadius: 4,
                  width: 240,
                  padding: '12px 0',
                }}>
                  <button
                    onClick={() => { onUseTemplate?.(t.id); setOpenMenuId(null); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '8px 16px',
                      fontSize: 14, fontWeight: 400, lineHeight: '20px',
                      letterSpacing: '-0.28px', color: '#555',
                      fontFamily: font,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f2f4f7'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    Use agent
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TemplateLibrary({
  templates = DEFAULT_TEMPLATES,
  variant = 'grid',
  initialCount = 3,
  onUseTemplate,
  onSeeMore,
}) {
  const visible = variant === 'see-more' ? templates.slice(0, initialCount) : templates;
  const hasMore = variant === 'see-more' && templates.length > initialCount;

  if (variant === 'list') {
    return <TemplateListView templates={templates} onUseTemplate={onUseTemplate} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {visible.map((t) => (
          <TemplateCard
            key={t.id}
            title={t.title}
            description={t.description}
            onUse={() => onUseTemplate?.(t.id)}
          />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => onSeeMore?.()}
          style={{
            alignSelf: 'center',
            background: 'none',
            border: '1px solid #e5e9f0',
            borderRadius: 4,
            padding: '6px 16px',
            cursor: 'pointer',
            fontSize: 14,
            fontFamily: font,
            color: '#1976d2',
            letterSpacing: '-0.28px',
            lineHeight: '20px',
          }}
        >
          See more
        </button>
      )}
    </div>
  );
}
