import React, { useState } from 'react';
import Chip from '@birdeye/elemental/core/atoms/Chip/index.js';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import LocationsDrawer from '../../../RHSDrawer/LocationsDrawer.jsx';
import styles from './AgentDetailsBody.module.css';

const DEFAULT_LOCATIONS = [
  { id: '1001', name: '1001 - Mountain view, CA' },
  { id: '1002', name: '1002 - Seattle, WA' },
  { id: '1004', name: '1004 - Chicago, IL' },
  { id: '1006', name: '1006 - Las Vegas, NV' },
  { id: '1007', name: '1007 - Austin, TX' },
  { id: '1008', name: '1008 - New York, NY' },
  { id: '1009', name: '1009 - Miami, FL' },
  { id: '1010', name: '1010 - Denver, CO' },
  { id: '1011', name: '1011 - Portland, OR' },
  { id: '1012', name: '1012 - Phoenix, AZ' },
];

const VISIBLE_COUNT = 4;

/* rightIcon component consumed by Chip — must be a component, not JSX */
const CloseIcon = () => (
  <span className={`material-symbols-outlined ${styles.chipCloseIcon}`}>close</span>
);

export default function AgentDetailsBody({ values: externalValues, onChange }) {
  const [internalValues, setInternalValues] = useState({
    agentName: '',
    goals: '',
    outcomes: '',
    locations: [],
  });
  const [showLocations, setShowLocations] = useState(false);
  const [showAllChips, setShowAllChips] = useState(false);

  const values = externalValues ?? internalValues;

  /* Use DEFAULT_LOCATIONS when the saved list is empty (first open) */
  const locations =
    values.locations && values.locations.length > 0
      ? values.locations
      : DEFAULT_LOCATIONS;

  /* Generic text-field setter */
  const set = onChange
    ? (field) => (e) => onChange(field, e.target.value)
    : (field) => (e) => setInternalValues((v) => ({ ...v, [field]: e.target.value }));

  const updateLocations = (updated) => {
    if (onChange) {
      onChange('locations', updated);
    } else {
      setInternalValues((v) => ({ ...v, locations: updated }));
    }
  };

  const handleRemoveChip = (id) => {
    updateLocations(locations.filter((l) => l.id !== id));
  };

  const handleLocationsSave = (selected) => {
    updateLocations(selected);
    setShowLocations(false);
  };

  /* LocationsDrawer replaces the whole body when open */
  if (showLocations) {
    return (
      <LocationsDrawer
        selectedIds={(values.locations || []).map((l) => l.id)}
        onBack={() => setShowLocations(false)}
        onSave={handleLocationsSave}
      />
    );
  }

  const visibleLocations = showAllChips
    ? locations
    : locations.slice(0, VISIBLE_COUNT);
  const overflowCount = locations.length - VISIBLE_COUNT;

  return (
    <div className={styles.body}>
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

      {/* ─── Locations ─── */}
      <div className={styles.locationsField}>
        <div className={styles.locationsLabel}>
          <span className={styles.locationsLabelText}>Locations</span>
          <span className={styles.locationsRequired}>*</span>
          <span className={`material-symbols-outlined ${styles.locationsInfoIcon}`}>
            info
          </span>
        </div>

        <div className={styles.chipsRow}>
          {visibleLocations.map((loc) => (
            <Chip
              key={loc.id}
              label={loc.name}
              rightIcon={CloseIcon}
              onIconClick={() => handleRemoveChip(loc.id)}
              size="small"
            />
          ))}
          {!showAllChips && overflowCount > 0 && (
            <button
              className={styles.moreLink}
              onClick={() => setShowAllChips(true)}
            >
              + {overflowCount} more
            </button>
          )}
        </div>

        <button className={styles.addLink} onClick={() => setShowLocations(true)}>
          + Add
        </button>
      </div>
    </div>
  );
}
