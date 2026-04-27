import React from 'react';
import CanvasNode from './CanvasNode';

export default {
  title: 'Agent Builder/Molecules/Canvas/CanvasNode',
  component: CanvasNode,
  parameters: { layout: 'padded' },
};

export const Trigger = {
  render: () => (
    <CanvasNode
      nodeType="trigger"
      label="Trigger"
      hasToggle
      toggleEnabled
      stepNumber={1}
      title="When a new review is received or updated"
      description="Reviews: Triggers on new or updated reviews across all sources and locations"
    />
  ),
};

export const Task = {
  render: () => (
    <CanvasNode
      nodeType="task"
      label="Task"
      hasToggle
      toggleEnabled
      stepNumber={2}
      title="Identify relevant mentions in the review"
      description="Extract product or service-specific feedback from the review"
    />
  ),
};

export const TaskLLM = {
  render: () => (
    <CanvasNode
      nodeType="task"
      label="Task"
      hasAiIcon
      hasToggle
      toggleEnabled
      stepNumber={2}
      title="Identify relevant mentions in the review"
      description="LLM: Extract product or service-specific feedback from the review"
    />
  ),
};

export const Branch = {
  render: () => (
    <CanvasNode
      nodeType="branch"
      label="Branch"
      hasToggle
      toggleEnabled
      hasAddButton
      stepNumber={3}
      title="Based on conditions"
      description="Build condition-specific flows"
    />
  ),
};

export const Loop = {
  render: () => (
    <CanvasNode
      nodeType="loop"
      label="Loop"
      hasToggle
      toggleEnabled
      stepNumber={4}
      title="Repeat until condition is met"
      description="Iterate over a set of steps until the exit condition is true"
    />
  ),
};

export const Parallel = {
  render: () => (
    <CanvasNode
      nodeType="parallel"
      label="Parallel tasks"
      hasToggle
      toggleEnabled
      hasAddButton
      stepNumber={3}
      title="Run tasks simultaneously"
      description="Execute multiple branches in parallel"
    />
  ),
};

export const Delay = {
  render: () => (
    <CanvasNode
      nodeType="delay"
      label="Delay"
      hasToggle
      toggleEnabled
      stepNumber={4}
      title="Wait before continuing"
      description="Pause the workflow for a set duration"
    />
  ),
};

export const AllTypes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CanvasNode nodeType="trigger" label="Trigger" hasToggle toggleEnabled stepNumber={1} title="When a new review is received or updated" description="Reviews: Triggers on new or updated reviews" />
      <CanvasNode nodeType="task" label="Task" hasAiIcon hasToggle toggleEnabled stepNumber={2} title="Identify relevant mentions in the review" description="LLM: Extract product or service-specific feedback" />
      <CanvasNode nodeType="task" label="Task" hasToggle toggleEnabled stepNumber={2} title="Send a review response" description="Reviews: Post a reply to the selected review" />
      <CanvasNode nodeType="branch" label="Branch" hasToggle toggleEnabled hasAddButton stepNumber={3} title="Based on conditions" description="Build condition-specific flows" />
      <CanvasNode nodeType="loop" label="Loop" hasToggle toggleEnabled stepNumber={4} title="Repeat until condition is met" description="Iterate over a set of steps until the exit condition is true" />
      <CanvasNode nodeType="parallel" label="Parallel tasks" hasToggle toggleEnabled hasAddButton stepNumber={3} title="Run tasks simultaneously" description="Execute multiple branches in parallel" />
      <CanvasNode nodeType="delay" label="Delay" hasToggle toggleEnabled stepNumber={4} title="Wait before continuing" description="Pause the workflow for a set duration" />
    </div>
  ),
};

export const Hover = {
  render: () => (
    <CanvasNode
      nodeType="task"
      label="Task"
      hasToggle
      toggleEnabled
      stepNumber={2}
      title="Identify relevant mentions in the review"
      description="Extract product or service-specific feedback from the review"
      state="hover"
    />
  ),
};

export const Selected = {
  render: () => (
    <CanvasNode
      nodeType="task"
      label="Task"
      hasToggle
      toggleEnabled
      stepNumber={2}
      title="Identify relevant mentions in the review"
      description="Extract product or service-specific feedback from the review"
      state="selected"
    />
  ),
};

export const Disabled = {
  render: () => (
    <CanvasNode
      nodeType="task"
      label="Task"
      hasToggle
      toggleEnabled
      stepNumber={2}
      title="Identify relevant mentions in the review"
      description="Extract product or service-specific feedback from the review"
      state="disabled"
    />
  ),
};

export const TestSuccess = {
  name: 'Test (Success)',
  render: () => (
    <CanvasNode
      nodeType="task"
      label="Task"
      hasToggle
      toggleEnabled
      stepNumber={2}
      title="Identify relevant mentions in the review"
      description="Extract product or service-specific feedback from the review"
      state="test-success"
    />
  ),
};

export const TestFail = {
  name: 'Test (Fail)',
  render: () => (
    <CanvasNode
      nodeType="task"
      label="Task"
      hasToggle
      toggleEnabled
      stepNumber={2}
      title="Identify relevant mentions in the review"
      description="Extract product or service-specific feedback from the review"
      state="test-fail"
    />
  ),
};

export const AllStates = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CanvasNode nodeType="task" label="Task" hasToggle toggleEnabled stepNumber={2} title="Default state" description="No state modifier applied" />
      <CanvasNode nodeType="task" label="Task" hasToggle toggleEnabled stepNumber={2} title="Hover state" description="Mouse is hovering over the node" state="hover" />
      <CanvasNode nodeType="task" label="Task" hasToggle toggleEnabled stepNumber={2} title="Selected state" description="Node is currently selected" state="selected" />
      <CanvasNode nodeType="task" label="Task" hasToggle toggleEnabled stepNumber={2} title="Disabled state" description="Node is disabled and non-interactive" state="disabled" />
      <CanvasNode nodeType="task" label="Task" hasToggle toggleEnabled stepNumber={2} title="Test success" description="Node passed its test run" state="test-success" />
      <CanvasNode nodeType="task" label="Task" hasToggle toggleEnabled stepNumber={2} title="Test fail" description="Node failed its test run" state="test-fail" />
    </div>
  ),
};
