import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import SingleSelect from '@birdeye/elemental/core/atoms/SingleSelect/index.js';

const font = '"Roboto", arial, sans-serif';

const UNIT_OPTIONS = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'seconds', label: 'Seconds' },
];

function SectionLabel({ label, required }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18 }}>
      <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: '#212121', fontFamily: font }}>
        {label}
      </span>
      {required && <span style={{ fontSize: 12, lineHeight: '18px', color: '#de1b0c', fontFamily: font }}>*</span>}
    </div>
  );
}

export default function DelayBody({ initialValues = {}, onFieldChange }) {
  const [name, setName] = useState(initialValues.name ?? '');
  const [duration, setDuration] = useState(initialValues.duration ?? '');
  const [unit, setUnit] = useState(initialValues.unit ?? '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormInput
        name="delayName"
        type="text"
        label="Name"
        placeholder="Enter name"
        value={name}
        onChange={(e) => { setName(e.target.value); onFieldChange?.('name', e.target.value); }}
        required
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SectionLabel label="Wait duration" required />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <FormInput
              name="duration"
              type="number"
              label="Amount"
              placeholder="Enter value"
              value={duration}
              onChange={(e) => { setDuration(e.target.value); onFieldChange?.('duration', e.target.value); }}
              min={1}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SectionLabel label="Unit" />
            <SingleSelect
              name="unit"
              selected={unit}
              options={UNIT_OPTIONS}
              onChange={(opt) => { setUnit(opt.value); onFieldChange?.('unit', opt.value); }}
              placeholder="Select"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
