import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import ToolSelectionDrawer from '../../Drawers/ToolSelectionDrawer/ToolSelectionDrawer.jsx';
import CustomToolBuilder from '../../Drawers/CustomToolBuilder/CustomToolBuilder.jsx';

const font = '"Roboto", arial, sans-serif';

function SectionLabel({ label, showInfo }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18 }}>
      <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: '#212121', fontFamily: font }}>
        {label}
      </span>
      {showInfo && <i className="icon_phoenix-info" style={{ fontSize: 16, color: '#8f8f8f', cursor: 'pointer' }} />}
    </div>
  );
}

function AddBox({ onAdd, children }) {
  return (
    <div style={{ border: '1px solid #e5e9f0', borderRadius: 4, padding: '12px 10px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        onClick={onAdd}
        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <i className="icon_phoenix-add_circle" style={{ fontSize: 20, color: '#1976d2' }} />
        <span style={{ fontSize: 12, lineHeight: '18px', letterSpacing: '-0.24px', color: '#1976d2', fontFamily: font }}>Add</span>
      </button>
      {children}
    </div>
  );
}

export default function EntityTaskBody({ initialValues = {}, onFieldChange }) {
  const [taskName, setTaskName] = useState(initialValues.taskName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [isToolDrawerOpen, setIsToolDrawerOpen] = useState(false);
  const [isCustomToolBuilderOpen, setIsCustomToolBuilderOpen] = useState(false);
  const [customTools, setCustomTools] = useState([]);

  const handleTaskName = (e) => {
    const val = e.target.value;
    setTaskName(val);
    onFieldChange?.('taskName', val);
  };

  const handleDescription = (e) => {
    const val = e.target.value;
    setDescription(val);
    onFieldChange?.('description', val);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <FormInput
          name="taskName"
          type="text"
          label="Task name"
          placeholder="Enter name"
          value={taskName}
          onChange={handleTaskName}
          required
        />
        <TextArea
          name="description"
          label="Description"
          placeholder="Enter description"
          value={description}
          onChange={handleDescription}
          noFloatingLabel
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SectionLabel label="Tools" showInfo />
          <AddBox onAdd={() => setIsToolDrawerOpen(true)} />
        </div>
      </div>
      <ToolSelectionDrawer
        isOpen={isToolDrawerOpen}
        onClose={() => setIsToolDrawerOpen(false)}
        onToolSelect={() => setIsToolDrawerOpen(false)}
        onConnect={() => {}}
        onAddCustom={() => {
          setIsToolDrawerOpen(false);
          setIsCustomToolBuilderOpen(true);
        }}
      />
      <CustomToolBuilder
        isOpen={isCustomToolBuilderOpen}
        onClose={() => setIsCustomToolBuilderOpen(false)}
        onSave={(tool) => {
          setCustomTools((prev) => [...prev, tool]);
          setIsCustomToolBuilderOpen(false);
        }}
      />
    </>
  );
}
