import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import LocationsDrawer from '../../../RHSDrawer/LocationsDrawer.jsx';

const font = '"Roboto", arial, sans-serif';

export default function AgentDetailsBody({ values: externalValues, onChange }) {
  const [internalValues, setInternalValues] = useState({ agentName: '', goals: '', outcomes: '', locations: [] });
  const [showLocations, setShowLocations] = useState(false);
  const values = externalValues ?? internalValues;
  const set = onChange
    ? (field) => (e) => onChange(field, e.target.value)
    : (field) => (e) => setInternalValues((v) => ({ ...v, [field]: e.target.value }));

  const handleLocationsSave = (selected) => {
    if (onChange) {
      onChange('locations', selected);
    } else {
      setInternalValues((v) => ({ ...v, locations: selected }));
    }
    setShowLocations(false);
  };

  if (showLocations) {
    return (
      <LocationsDrawer
        selectedIds={(values.locations || []).map((l) => l.id)}
        onBack={() => setShowLocations(false)}
        onSave={handleLocationsSave}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormInput
        name="agentName"
        type="text"
        label="Agent name"
        value={values.agentName}
        onChange={set('agentName')}
        required
      />
      <TextArea
        name="goals"
        label="Goals"
        value={values.goals}
        onChange={set('goals')}
        required
        noFloatingLabel
      />
      <TextArea
        name="outcomes"
        label="Outcomes"
        value={values.outcomes}
        onChange={set('outcomes')}
        noFloatingLabel
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 400, lineHeight: '18px', fontFamily: font }}>
          <span style={{ color: '#212121' }}>Locations</span>
          <span style={{ color: '#de1b0c' }}>*</span>
          <i className="icon_phoenix-info" style={{ fontSize: 16, color: '#8f8f8f', cursor: 'pointer' }} />
        </div>
        <span onClick={() => setShowLocations(true)} style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: '#1976d2', cursor: 'pointer', fontFamily: font }}>
          + Add
        </span>
      </div>
    </div>
  );
}
