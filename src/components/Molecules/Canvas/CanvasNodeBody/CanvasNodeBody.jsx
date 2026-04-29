import React from 'react';
import './CanvasNodeBody.css';

export default function CanvasNodeBody({
  stepNumber,
  title,
  description,
  nodeType = 'task',
  titlePlaceholder = 'Enter name',
  descriptionPlaceholder = 'Enter description',
}) {
  const hasTitle = Boolean(String(title || '').trim());
  const hasDescription = Boolean(String(description || '').trim());

  return (
    <div className="cnb">
      <ol className={`cnb__step cnb__step--${nodeType}`} start={stepNumber}>
        <li>
          <span className={hasTitle ? undefined : 'cnb__placeholder'}>
            {hasTitle ? title : titlePlaceholder}
          </span>
        </li>
      </ol>
      {(hasDescription || descriptionPlaceholder) && (
        <p className={`cnb__description${hasDescription ? '' : ' cnb__placeholder'}`}>
          {hasDescription ? description : descriptionPlaceholder}
        </p>
      )}
    </div>
  );
}
