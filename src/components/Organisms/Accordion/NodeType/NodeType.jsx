import React from 'react';
import Accordion from '@birdeye/elemental/core/atoms/Accordion/index.js';
import './NodeType.css';

export default function NodeType({ title, content, isDefaultOpen = false }) {
  return (
    <div className="node-type-accordion">
      <Accordion items={[{ title, content }]} isDefaultOpen={isDefaultOpen} />
    </div>
  );
}
