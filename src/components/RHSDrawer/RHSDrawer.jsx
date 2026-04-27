import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import LocationsDrawer from './LocationsDrawer';
import './RHSDrawer.css';

export default function RHSDrawer({
  agentName = '',
  goals = '',
  outcomes = '',
  locations = [],
  moreLocationsCount = 0,
  onClose,
  onSave,
  onChange,
}) {
  const [showLocations, setShowLocations] = useState(false);

  if (showLocations) {
    return (
      <LocationsDrawer
        selectedIds={locations.map((loc) => loc.id)}
        onBack={() => setShowLocations(false)}
        onSave={(selectedLocations) => {
          // Show first 3 as chips, rest as "+ N more"
          const chips = selectedLocations.slice(0, 3);
          const moreCount = Math.max(0, selectedLocations.length - 3);
          onChange?.('locations', chips);
          onChange?.('moreLocationsCount', moreCount);
          setShowLocations(false);
        }}
      />
    );
  }

  return (
    <div className="rhs-drawer">
      <div className="rhs-drawer__header">
        <span className="rhs-drawer__header-title">Agent details</span>
        <div className="rhs-drawer__header-actions">
          <button className="rhs-drawer__icon-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <div className="rhs-drawer__body">
        <div className="rhs-drawer__field">
          <FormInput
            name="agentName"
            type="text"
            label="Agent name *"
            value={agentName}
            placeholder="Enter agent name"
            onChange={(e, value) => onChange?.('agentName', value)}
          />
        </div>

        <div className="rhs-drawer__textarea">
          <label>
            Goals<span className="rhs-drawer__required"> *</span>
          </label>
          <textarea
            value={goals}
            placeholder="Enter goals"
            onChange={(e) => onChange?.('goals', e.target.value)}
          />
        </div>

        <div className="rhs-drawer__textarea">
          <label>Outcomes</label>
          <textarea
            value={outcomes}
            placeholder="Enter outcomes"
            onChange={(e) => onChange?.('outcomes', e.target.value)}
          />
        </div>

        <div className="rhs-drawer__locations">
          <div className="rhs-drawer__locations-label">
            <span>Locations</span>
            <span className="rhs-drawer__required">*</span>
            <span className="material-symbols-outlined">info</span>
          </div>
          <div className="rhs-drawer__chips">
            {locations.map((loc) => (
              <span key={loc.id} className="rhs-drawer__chip">
                {loc.id} - {loc.name}
              </span>
            ))}
          </div>
          {moreLocationsCount > 0 && (
            <button
              className="rhs-drawer__more-link"
              onClick={() => setShowLocations(true)}
            >
              + {moreLocationsCount} more
            </button>
          )}
          {locations.length === 0 && (
            <button
              className="rhs-drawer__add-condition"
              onClick={() => setShowLocations(true)}
            >
              <span className="material-symbols-outlined">add_circle</span>
              <span>Select locations</span>
            </button>
          )}
        </div>
      </div>

      <div className="rhs-drawer__footer">
        <Button
          theme="primary"
          label="Save"
          onClick={onSave}
        />
      </div>
    </div>
  );
}
