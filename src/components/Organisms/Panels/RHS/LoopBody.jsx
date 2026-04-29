import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import SingleSelect from '@birdeye/elemental/core/atoms/SingleSelect/index.js';

const font = '"Roboto", arial, sans-serif';

const helpTextStyle = { fontSize: 11, lineHeight: '16px', color: '#8f8f8f', fontFamily: font };

const LOOP_OVER_OPTIONS = [
  { value: 'reviews_list', label: '{{reviews_list}}' },
  { value: 'items', label: '{{items}}' },
  { value: 'contacts', label: '{{contacts}}' },
  { value: 'results', label: '{{results}}' },
];


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

export default function LoopBody({ initialValues = {}, onFieldChange }) {
  const [name, setName] = useState(initialValues.name ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [loopMode, setLoopMode] = useState(initialValues.loopMode ?? 'manual');
  const [loopOver, setLoopOver] = useState(initialValues.loopOver ?? null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormInput
        name="loopName"
        type="text"
        label="Name"
        placeholder="Enter name"
        value={name}
        onChange={(e) => { setName(e.target.value); onFieldChange?.('name', e.target.value); }}
        required
      />
      <TextArea
        name="description"
        label="Description"
        placeholder="Enter description"
        value={description}
        onChange={(e) => { setDescription(e.target.value); onFieldChange?.('description', e.target.value); }}
        noFloatingLabel
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', color: '#212121', fontFamily: font }}>
          How should this loop run?
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FormInput type="radio" name="loopMode" value="manual" label="Manual" checked={loopMode === 'manual'} onChange={() => { setLoopMode('manual'); onFieldChange?.('loopMode', 'manual'); }} labelInside />
          <FormInput type="radio" name="loopMode" value="variable" label="Set from variable" checked={loopMode === 'variable'} onChange={() => { setLoopMode('variable'); onFieldChange?.('loopMode', 'variable'); }} labelInside />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SectionLabel label="Loop over" showInfo />
        <SingleSelect
          name="loopOver"
          selected={loopOver}
          options={LOOP_OVER_OPTIONS}
          onChange={(opt) => { setLoopOver(opt.value); onFieldChange?.('loopOver', opt.value); }}
          placeholder="Select"
        />
        <span style={helpTextStyle}>Select the variable to iterate over</span>
      </div>
    </div>
  );
}
