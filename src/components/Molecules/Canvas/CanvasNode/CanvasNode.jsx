import React, { useState } from 'react';
import CanvasNodeHeader from '../CanvasNodeHeader/CanvasNodeHeader';
import CanvasNodeBody from '../CanvasNodeBody/CanvasNodeBody';
import './CanvasNode.css';

export default function CanvasNode({
  nodeType = 'task',
  label,
  stepNumber,
  title,
  description,
  hasAiIcon = false,
  hasToggle = false,
  toggleEnabled = true,
  onToggleChange,
  hasAddButton = false,
  onAddClick,
  onDelete,
  state = 'default',
}) {
  const [on, setOn] = useState(toggleEnabled);

  const handleToggle = (val) => {
    setOn(val);
    onToggleChange?.(val);
  };

  const stateClass = state !== 'default' ? ` canvas-node--${state}` : '';

  return (
    <div className={`canvas-node${stateClass}`}>
      <CanvasNodeHeader
        nodeType={nodeType}
        label={label}
        hasAiIcon={hasAiIcon}
        hasToggle={hasToggle}
        toggleEnabled={on}
        onToggleChange={handleToggle}
        hasAddButton={hasAddButton}
        onAddClick={onAddClick}
        onDelete={onDelete}
      />
      {(stepNumber != null || title) && (
        <CanvasNodeBody
          nodeType={nodeType}
          stepNumber={stepNumber}
          title={title}
          description={description}
        />
      )}
    </div>
  );
}
