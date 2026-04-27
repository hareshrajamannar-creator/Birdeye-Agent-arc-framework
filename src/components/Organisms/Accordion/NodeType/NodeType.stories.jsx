import React from 'react';
import NodeType from './NodeType';
import { CardRow, TRIGGER_CARDS, TASK_CARDS, CONTROL_CARDS } from '../../../LHSDrawer/LHSDrawer';
import '../../../LHSDrawer/LHSDrawer.css';

export default {
  title: 'Agent Builder/Organisms/Accordion/NodeType',
  component: NodeType,
  parameters: { layout: 'padded' },
};

function CardList({ cards }) {
  return (
    <div className="lhs-drawer__cards">
      {cards.map((node) => (
        <div key={node.label} className="lhs-drawer__card-wrapper">
          <CardRow label={node.label} icon={node.icon} action={node.action} />
        </div>
      ))}
    </div>
  );
}

export const Trigger = {
  render: () => (
    <div style={{ width: 312, padding: 16 }}>
      <NodeType title="Trigger" isDefaultOpen={true} content={<CardList cards={TRIGGER_CARDS} />} />
    </div>
  ),
};

export const Task = {
  render: () => (
    <div style={{ width: 312, padding: 16 }}>
      <NodeType title="Task" isDefaultOpen={true} content={<CardList cards={TASK_CARDS} />} />
    </div>
  ),
};

export const Controls = {
  render: () => (
    <div style={{ width: 312, padding: 16 }}>
      <NodeType title="Controls" isDefaultOpen={true} content={<CardList cards={CONTROL_CARDS} />} />
    </div>
  ),
};
