import React from 'react';
import './CanvasNodeBody.css';

export default function CanvasNodeBody({ stepNumber, title, description, nodeType = 'task' }) {
  return (
    <div className="cnb">
      <ol className={`cnb__step cnb__step--${nodeType}`} start={stepNumber}>
        <li><span>{title}</span></li>
      </ol>
      {description && (
        <p className="cnb__description">{description}</p>
      )}
    </div>
  );
}
