import React from 'react';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';

const font = '"Roboto", sans-serif';

const SearchIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#616161', lineHeight: 1 }}>
    search
  </span>
);

const FilterIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#616161', lineHeight: 1 }}>
    tune
  </span>
);

export default function Header({
  title = '',
  primaryAction = null,
  onSearch,
  onFilter,
  showSearch = true,
  showFilter = true,
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 24px',
      background: '#ffffff',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: font,
    }}>
      {/* Title — flex: 1 to push CTAs to the right */}
      <div style={{ flex: '1 0 0', minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 400,
          lineHeight: '26px',
          letterSpacing: '-0.36px',
          color: '#212121',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {title}
        </p>
      </div>

      {/* Header CTAs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {showSearch && (
          <Button
            type="secondary"
            customIcon={<SearchIcon />}
            onClick={onSearch}
            aria-label="Search"
          />
        )}
        {primaryAction && (
          <Button
            type="primary"
            label={primaryAction.label}
            onClick={primaryAction.onClick}
          />
        )}
        {showFilter && (
          <Button
            type="link"
            customIcon={<FilterIcon />}
            onClick={onFilter}
            noHover
            aria-label="Filter"
          />
        )}
      </div>
    </div>
  );
}
