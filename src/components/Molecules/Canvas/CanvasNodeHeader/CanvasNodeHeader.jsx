import React, { useState, useRef, useEffect } from 'react';
import Toggle from '@birdeye/elemental/core/atoms/Toggle/index.js';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import './CanvasNodeHeader.css';

const AddIcon = () => <span className="material-symbols-outlined cnh__btn-icon">add_circle</span>;
const MoreIcon = () => <span className="material-symbols-outlined cnh__btn-icon">more_vert</span>;
const DeleteIcon = () => <span className="material-symbols-outlined cnh__btn-icon cnh__btn-icon--delete">delete</span>;

const TaskSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask-task" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
      <rect width="24" height="24" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask-task)">
      <path d="M12.5 10.4706H16.1765V9.32353H12.5V10.4706ZM12.5 14.6765H16.1765V13.5294H12.5V14.6765ZM10.2059 11.1322C10.5481 11.1322 10.8395 11.0119 11.0801 10.7713C11.3208 10.5307 11.4411 10.2393 11.4411 9.89706C11.4411 9.55498 11.3208 9.26356 11.0801 9.02281C10.8395 8.78218 10.5481 8.66187 10.2059 8.66187C9.86368 8.66187 9.57226 8.78218 9.33163 9.02281C9.091 9.26356 8.97069 9.55498 8.97069 9.89706C8.97069 10.2393 9.091 10.5307 9.33163 10.7713C9.57226 11.0119 9.86368 11.1322 10.2059 11.1322ZM10.2059 15.3381C10.5481 15.3381 10.8395 15.2178 11.0801 14.9772C11.3208 14.7364 11.4411 14.445 11.4411 14.1029C11.4411 13.7607 11.3208 13.4693 11.0801 13.2287C10.8395 12.9881 10.5481 12.8678 10.2059 12.8678C9.86368 12.8678 9.57226 12.9881 9.33163 13.2287C9.091 13.4693 8.97069 13.7607 8.97069 14.1029C8.97069 14.445 9.091 14.7364 9.33163 14.9772C9.57226 15.2178 9.86368 15.3381 10.2059 15.3381ZM7.3824 18.5C6.99609 18.5 6.66912 18.3662 6.40147 18.0985C6.13382 17.8309 6 17.5039 6 17.1176V6.8824C6 6.49609 6.13382 6.16912 6.40147 5.90147C6.66912 5.63382 6.99609 5.5 7.3824 5.5H17.6176C18.0039 5.5 18.3309 5.63382 18.5985 5.90147C18.8662 6.16912 19 6.49609 19 6.8824V17.1176C19 17.5039 18.8662 17.8309 18.5985 18.0985C18.3309 18.3662 18.0039 18.5 17.6176 18.5H7.3824ZM7.3824 17.3529H17.6176C17.6765 17.3529 17.7304 17.3284 17.7793 17.2793C17.8284 17.2304 17.8529 17.1765 17.8529 17.1176V6.8824C17.8529 6.82351 17.8284 6.7696 17.7793 6.72066C17.7304 6.67159 17.6765 6.64706 17.6176 6.64706H7.3824C7.32351 6.64706 7.2696 6.67159 7.22066 6.72066C7.17159 6.7696 7.14706 6.82351 7.14706 6.8824V17.1176C7.14706 17.1765 7.17159 17.2304 7.22066 17.2793C7.2696 17.3284 7.32351 17.3529 7.3824 17.3529Z" fill="#37A248"/>
    </g>
  </svg>
);

const TriggerSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask-trigger" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="2" y="2" width="20" height="20">
      <rect x="2" y="2" width="20" height="20" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask-trigger)">
      <path d="M11.2964 13.7901L6.76765 13.0641C6.48876 13.014 6.30952 12.8529 6.22994 12.581C6.15036 12.309 6.22063 12.0796 6.44077 11.8926L14.4647 4.5466C14.5181 4.49313 14.5779 4.45653 14.6441 4.43681C14.7104 4.41709 14.8012 4.40723 14.9166 4.40723C15.1024 4.40723 15.2467 4.48813 15.3493 4.64994C15.4518 4.81174 15.4609 4.97709 15.3766 5.14598L12.6793 10.2149L17.2243 10.9408C17.5031 10.991 17.6836 11.1508 17.766 11.4199C17.8482 11.6892 17.7792 11.9174 17.5591 12.1043L9.53515 19.4585C9.48181 19.5118 9.42202 19.547 9.35577 19.5641C9.28952 19.5812 9.19869 19.5897 9.08327 19.5897C8.89744 19.5897 8.75591 19.5088 8.65869 19.347C8.56147 19.1852 8.55237 19.0226 8.6314 18.8591L11.2964 13.7901ZM10.9422 16.662L16.2356 11.8622L11.0706 11.032L13.0818 7.31098L7.76431 12.1395L12.9293 12.9808L10.9422 16.662Z" fill="#F88078"/>
    </g>
  </svg>
);

const ICON_CONFIG = {
  trigger:  { svgComponent: TriggerSvg, modifier: 'trigger'  },
  task:     { svgComponent: TaskSvg,    modifier: 'task'     },
  branch:   { icon: 'account_tree',     modifier: 'branch'   },
  parallel: { icon: 'splitscreen_add', modifier: 'parallel' },
  loop:     { icon: 'repeat',          modifier: 'loop'     },
  delay:    { icon: 'hourglass_empty', modifier: 'delay'    },
};

export default function CanvasNodeHeader({
  nodeType = 'task',
  label,
  hasToggle = false,
  toggleEnabled = true,
  onToggleChange,
  hasAiIcon = false,
  hasAddButton = false,
  onAddClick,
  onMenuClick,
  onDelete,
}) {
  const config = ICON_CONFIG[nodeType] || ICON_CONFIG.task;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setMenuOpen((v) => !v);
    onMenuClick?.();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.();
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <div className="cnh">
      <div className="cnh__left">
        <div className={`cnh__icon-circle cnh__icon-circle--${config.modifier}`}>
          {config.svgComponent ? <config.svgComponent /> : <span className="material-symbols-outlined">{config.icon}</span>}
        </div>
        <span className="cnh__label">{label}</span>
      </div>
      <div className="cnh__right">
        {hasAiIcon && (
          <div className="cnh__ai-icon">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
        )}
        {hasToggle && (
          <Toggle
            name={`cnh-toggle-${nodeType}`}
            checked={toggleEnabled}
            onChange={(_, e) => onToggleChange?.(e.target.checked)}
            roundedToggle
          />
        )}
        {hasAddButton && (
          <Button type="link" customIcon={<AddIcon />} onClick={onAddClick} noHover aria-label="Add" />
        )}
        <div className="cnh__more-wrapper" ref={menuRef}>
          <Button type="link" customIcon={<MoreIcon />} onClick={handleMoreClick} noHover aria-label="More options" />
          {menuOpen && (
            <div className="cnh__context-menu">
              <button className="cnh__context-menu-item cnh__context-menu-item--delete" onClick={handleDelete}>
                <DeleteIcon />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
