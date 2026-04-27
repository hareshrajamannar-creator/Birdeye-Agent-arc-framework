import React from 'react';
import './LHSEntityGroup.css';

export default function LHSEntityGroup({ title, items = [], nodeType, parentLabel }) {
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/reactflow-type', nodeType);
    e.dataTransfer.setData('application/reactflow-label', parentLabel);
    e.dataTransfer.setData('application/reactflow-description', item);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="lhs-entity-group">
      <p className="lhs-entity-group__title">{title}</p>
      <div className="lhs-entity-group__items">
        {items.map((item) => (
          <div
            key={item}
            className="lhs-entity-group__item"
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
          >
            <span className="lhs-entity-group__item-label">{item}</span>
            <span className="lhs-entity-group__item-drag material-symbols-outlined">
              drag_indicator
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
