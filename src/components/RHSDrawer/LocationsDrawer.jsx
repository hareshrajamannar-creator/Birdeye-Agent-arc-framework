import React, { useState, useMemo } from 'react';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import './LocationsDrawer.css';

const font = '"Roboto", arial, sans-serif';

const ALL_LOCATIONS = [
  { id: '1001', name: 'Mountain view, CA' },
  { id: '1002', name: 'Seattle, WA' },
  { id: '1003', name: 'Dallas, TX' },
  { id: '1004', name: 'Chicago, IL' },
  { id: '1008', name: 'Phoenix, AZ' },
  { id: '1014', name: 'Atlanta, GA' },
  { id: '1009', name: 'Denver, CO' },
  { id: '1015', name: 'Boston, MA' },
  { id: '1010', name: 'New York, NY' },
  { id: '1016', name: 'Philadelphia, PA' },
  { id: '1011', name: 'Austin, TX' },
  { id: '1017', name: 'San Antonio, TX' },
  { id: '1012', name: 'Portland, OR' },
  { id: '1018', name: 'San Diego, CA' },
  { id: '1013', name: 'Miami, FL' },
  { id: '1019', name: 'Dallas, TX' },
];

const SELECT_BY_OPTIONS = [
  { label: 'Location', value: 'location' },
  { label: 'Region', value: 'region' },
  { label: 'Division', value: 'division' },
  { label: 'City', value: 'city' },
  { label: 'Zip', value: 'zip' },
];

const DEFAULT_SELECTED = ['1001', '1002', '1004', '1011', '1014', '1017'];

export default function LocationsDrawer({ selectedIds: initialSelectedIds, onBack, onSave }) {
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds || DEFAULT_SELECTED);
  const [search, setSearch] = useState('');
  const [selectBy, setSelectBy] = useState('location');

  const filteredLocations = useMemo(() => {
    if (!search.trim()) return ALL_LOCATIONS;
    const q = search.toLowerCase();
    return ALL_LOCATIONS.filter(
      (loc) => loc.id.includes(q) || loc.name.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedCount = selectedIds.length;
  const allSelected = filteredLocations.length > 0 && filteredLocations.every((loc) => selectedIds.includes(loc.id));
  const someSelected = filteredLocations.some((loc) => selectedIds.includes(loc.id)) && !allSelected;

  const toggleLocation = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    const ids = filteredLocations.map((l) => l.id);
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const handleSave = () => onSave?.(ALL_LOCATIONS.filter((loc) => selectedIds.includes(loc.id)));

  return (
    <div className="loc-overlay">
      <div className="loc-drawer">

        {/* Header */}
        <div className="loc-header">
          <div className="loc-header__left">
            <button className="loc-back-btn" onClick={onBack}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className="loc-title">Locations</span>
          </div>
          <Button theme="primary" label="Save" onClick={handleSave} />
        </div>

        {/* Body */}
        <div className="loc-body">
          <div className="loc-inner">

            {/* Description + select by */}
            <div className="loc-description">
              <span>Choose the locations this agent will work for. Select by</span>
              <div className="loc-select-wrapper">
                <select
                  className="loc-select-by"
                  value={selectBy}
                  onChange={(e) => setSelectBy(e.target.value)}
                >
                  {SELECT_BY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined loc-select-chevron">expand_more</span>
              </div>
              <span className="material-symbols-outlined loc-info-icon">info</span>
            </div>

            {/* Search */}
            <div className="loc-search">
              <span className="material-symbols-outlined loc-search-icon">search</span>
              <input
                className="loc-search-input"
                type="text"
                placeholder="Search location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* List */}
            <div className="loc-list">
              {/* Select all */}
              <div className="loc-row" onClick={toggleAll}>
                <Checkbox checked={allSelected} indeterminate={someSelected} />
                <span className="loc-row__label">Select all</span>
                <span className="loc-row__count">{selectedCount} locations selected</span>
              </div>

              {filteredLocations.map((loc) => (
                <div key={loc.id} className="loc-row" onClick={() => toggleLocation(loc.id)}>
                  <Checkbox checked={selectedIds.includes(loc.id)} />
                  <span className="loc-row__label">{loc.id} - {loc.name}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, indeterminate }) {
  return (
    <div className={`loc-checkbox ${checked || indeterminate ? 'loc-checkbox--on' : ''}`}>
      {checked && !indeterminate && (
        <span className="material-symbols-outlined loc-checkbox__check">check</span>
      )}
      {indeterminate && <span className="loc-checkbox__dash" />}
    </div>
  );
}
