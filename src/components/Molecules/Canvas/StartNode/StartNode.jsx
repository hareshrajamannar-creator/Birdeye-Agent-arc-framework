import React from 'react';
import './StartNode.css';

export default function StartNode({ title = 'Agent workflow', subtitle = 'All locations' }) {
  return (
    <div className="start-node">
      <div className="start-node__icon">
        <span className="material-symbols-outlined">auto_awesome</span>
      </div>
      <div className="start-node__content">
        <span className="start-node__title">{title}</span>
        <span className="start-node__subtitle">{subtitle}</span>
      </div>
    </div>
  );
}
