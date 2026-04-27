import React, { useState } from 'react';
import PropTypes from 'prop-types';

const font = '"Roboto", sans-serif';

const DEFAULT_MENU_ITEMS = [
  { id: 'actions',     label: 'Actions' },
  { id: 'reports',     label: 'Reports' },
  { id: 'competitors', label: 'Competitors' },
  {
    id: 'agents',
    label: 'Agents',
    defaultExpanded: true,
    children: [
      { id: 'review-generation', label: 'Review generation agents' },
      { id: 'review-response',   label: 'Review response agents' },
    ],
  },
  { id: 'settings', label: 'Settings' },
];

const CHEVRON_STYLE = {
  fontSize: 20,
  color: '#212121',
  lineHeight: 1,
  flexShrink: 0,
  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20",
  display: 'block',
};

export default function SecondaryRailNav({
  title = 'ReviewsAI',
  menuItems = DEFAULT_MENU_ITEMS,
  activeItemId,
  ctaLabel = 'Send a review request',
  onCtaClick,
  onItemClick,
}) {
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(menuItems.filter(i => i.defaultExpanded).map(i => i.id))
  );

  function toggleExpand(id) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <nav style={{
      width: 222,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#fafafa',
      borderRight: '1px solid #eaeaea',
      height: '100%',
    }}>
      {/* Title */}
      <div style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        padding: '15px 24px',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        <span style={{
          fontSize: 18,
          fontWeight: 400,
          lineHeight: '26px',
          letterSpacing: '-0.36px',
          color: '#212121',
          fontFamily: font,
          whiteSpace: 'nowrap',
        }}>
          {title}
        </span>
      </div>

      {/* Body */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '8px 16px 16px',
        overflowY: 'auto',
      }}>
        {/* CTA */}
        <button
          onClick={onCtaClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 28,
            padding: '4px 8px',
            borderRadius: 4,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            width: '100%',
            flexShrink: 0,
          }}
        >
          <span style={{
            flex: 1,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: '-0.28px',
            color: '#212121',
            fontFamily: font,
            textAlign: 'left',
          }}>
            {ctaLabel}
          </span>
          <div style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#1976d2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 14,
              color: '#fff',
              lineHeight: 1,
              fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20",
            }}>
              add
            </span>
          </div>
        </button>

        {/* Menu items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {menuItems.map(item => {
            const isExpanded = expandedIds.has(item.id);

            if (item.children) {
              return (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      height: 28,
                      padding: '6px 8px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      width: '100%',
                    }}
                  >
                    <span style={{
                      flex: 1,
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#212121',
                      fontFamily: font,
                      textAlign: 'left',
                    }}>
                      {item.label}
                    </span>
                    <span className="material-symbols-outlined" style={CHEVRON_STYLE}>
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {isExpanded && item.children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => onItemClick?.(child.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 28,
                        padding: '6px 8px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        border: 'none',
                        background: activeItemId === child.id ? '#e5e9f0' : 'none',
                        width: '100%',
                      }}
                    >
                      <span style={{
                        flex: 1,
                        fontSize: 14,
                        fontWeight: 300,
                        lineHeight: 'normal',
                        letterSpacing: '-0.28px',
                        color: '#212121',
                        fontFamily: font,
                        textAlign: 'left',
                      }}>
                        {child.label}
                      </span>
                    </button>
                  ))}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onItemClick?.(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 28,
                  padding: '4px 8px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  width: '100%',
                }}
              >
                <span style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: '20px',
                  letterSpacing: '-0.28px',
                  color: '#212121',
                  fontFamily: font,
                  textAlign: 'left',
                }}>
                  {item.label}
                </span>
                <span className="material-symbols-outlined" style={CHEVRON_STYLE}>
                  expand_more
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

SecondaryRailNav.propTypes = {
  title: PropTypes.string,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    defaultExpanded: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })),
  })),
  activeItemId: PropTypes.string,
  ctaLabel: PropTypes.string,
  onCtaClick: PropTypes.func,
  onItemClick: PropTypes.func,
};
