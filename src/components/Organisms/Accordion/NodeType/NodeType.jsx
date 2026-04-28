import React from 'react';
import './NodeType.css';

export default function NodeType({ title, content, isOpen, onToggle }) {
  return (
    <div className="node-type-accordion">
      <ul className="accordionContentWrap">
        <li className={isOpen ? 'open' : ''}>
          <div className="accordionHeadingContent" onClick={onToggle}>
            <h2>{title}</h2>
            <span className="material-symbols-outlined accordionIcon">expand_more</span>
          </div>
          <div className="accordionBelowContent">
            <div className="accordionInnerContent">{content}</div>
          </div>
        </li>
      </ul>
    </div>
  );
}
