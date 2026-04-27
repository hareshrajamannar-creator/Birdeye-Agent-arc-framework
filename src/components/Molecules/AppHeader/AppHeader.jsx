import React from 'react';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import Avatar from '@birdeye/elemental/core/atoms/Avatar/index.js';

const AddIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#424242', lineHeight: 1 }}>
    add_circle
  </span>
);

const HelpIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#424242', lineHeight: 1 }}>
    help
  </span>
);

const MenuIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#424242', lineHeight: 1 }}>
    menu
  </span>
);

export default function AppHeader({
  user = null,
  onAdd,
  onHelp,
  onAvatar,
  onMenu,
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '12px 24px',
      background: '#ffffff',
      borderBottom: '1px solid #e9e9eb',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Button
          type="link"
          customIcon={<AddIcon />}
          onClick={onAdd}
          noHover
          aria-label="Add"
        />
        <Button
          type="link"
          customIcon={<HelpIcon />}
          onClick={onHelp}
          noHover
          aria-label="Help"
        />
        <button
          onClick={onAvatar}
          aria-label="Account"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar size="extra-small" variant="circular" alt={user?.name ?? 'User'}>
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </Avatar>
        </button>
        <Button
          type="link"
          customIcon={<MenuIcon />}
          onClick={onMenu}
          noHover
          aria-label="Menu"
        />
      </div>
    </div>
  );
}
