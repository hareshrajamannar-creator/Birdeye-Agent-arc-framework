import React from 'react';
import './EndNode.css';

export default function EndNode({ selected = false }) {
  return <div className={`end-node${selected ? ' end-node--selected' : ''}`}>End</div>;
}
