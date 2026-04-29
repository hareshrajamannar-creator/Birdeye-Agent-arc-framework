import React, { useState } from 'react';
import SingleSelect from '@birdeye/elemental/core/atoms/SingleSelect/index.js';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';

const font = '"Roboto", arial, sans-serif';

const BASED_ON_OPTIONS = [
  { value: 'conditions', label: 'Conditions' },
  { value: 'field', label: 'Field' },
  { value: 'percentage', label: 'Percentage' },
];

function SectionLabel({ label, required }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18 }}>
      <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', color: '#212121', fontFamily: font }}>
        {label}
      </span>
      {required && <span style={{ fontSize: 12, lineHeight: '18px', color: '#de1b0c', fontFamily: font }}>*</span>}
    </div>
  );
}

function BranchItem({ index, name }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 12px', border: '1px solid #e5e9f0', borderRadius: 4,
      background: '#fff', gap: 8,
    }}>
      <span style={{ fontSize: 14, lineHeight: '20px', color: '#212121', fontFamily: font, letterSpacing: '-0.28px' }}>
        {index + 1}. {name}
      </span>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#8f8f8f', flexShrink: 0 }}>
        drag_indicator
      </span>
    </div>
  );
}

function PercentageBranchItem({ index, name, percentage, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '8px 12px', border: '1px solid #e5e9f0', borderRadius: 4,
      background: '#fff', gap: 8,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#8f8f8f', flexShrink: 0 }}>
        drag_indicator
      </span>
      <span style={{ flex: 1, fontSize: 14, lineHeight: '20px', color: '#212121', fontFamily: font, letterSpacing: '-0.28px' }}>
        {index + 1}. {name}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, width: 80 }}>
        <FormInput
          name={`branch-pct-${index}`}
          type="number"
          value={String(percentage)}
          onChange={(e) => onChange(index, Number(e.target.value))}
          min="0"
          max="100"
        />
        <span style={{ fontSize: 13, color: '#555', fontFamily: font }}>%</span>
      </div>
    </div>
  );
}

export default function ControlBranchBody({ initialValues = {}, onFieldChange }) {
  const [basedOn, setBasedOn] = useState(initialValues.basedOn ?? 'conditions');
  const [fieldName, setFieldName] = useState(initialValues.fieldName ?? '');
  const [branches, setBranches] = useState(() => {
    const initial = initialValues.branches ?? [];
    return initial.map((b) => ({ ...b, percentage: b.percentage ?? 0 }));
  });
  const [nextId, setNextId] = useState((initialValues.branches?.length ?? 0) + 1);

  function addBranch() {
    setBranches((prev) => {
      const next = [...prev, { id: nextId, name: `Branch ${nextId}`, percentage: 0 }];
      onFieldChange?.('branches', next);
      return next;
    });
    setNextId((n) => n + 1);
  }

  function updatePercentage(index, value) {
    setBranches((prev) => {
      const next = prev.map((b, i) => i === index ? { ...b, percentage: value } : b);
      onFieldChange?.('branches', next);
      return next;
    });
  }

  const totalPercentage = branches.reduce((sum, b) => sum + (b.percentage || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SectionLabel label="Based on" required />
        <SingleSelect
          name="basedOn"
          selected={basedOn}
          options={BASED_ON_OPTIONS}
          onChange={(opt) => { setBasedOn(opt.value); onFieldChange?.('basedOn', opt.value); }}
          placeholder="Select"
        />
      </div>

      {basedOn === 'field' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SectionLabel label="Field" required />
          <FormInput
            name="fieldName"
            type="text"
            label="Field name"
            value={fieldName}
            onChange={(e) => { setFieldName(e.target.value); onFieldChange?.('fieldName', e.target.value); }}
          />
          <span style={{ fontSize: 11, lineHeight: '16px', color: '#8f8f8f', fontFamily: font }}>
            Select the field whose value determines the branch
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <SectionLabel label="Branches" />
          {basedOn === 'percentage' && (
            <span style={{
              fontSize: 11, fontFamily: font,
              color: totalPercentage === 100 ? '#2e7d32' : '#de1b0c',
            }}>
              Total: {totalPercentage}%
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {branches.map((b, i) =>
            basedOn === 'percentage' ? (
              <PercentageBranchItem key={b.id} index={i} name={b.name} percentage={b.percentage} onChange={updatePercentage} />
            ) : (
              <BranchItem key={b.id} index={i} name={b.name} />
            )
          )}
        </div>
        <button
          onClick={addBranch}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', alignSelf: 'flex-start' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#1976d2' }}>add_circle</span>
          <span style={{ fontSize: 14, lineHeight: '20px', color: '#1976d2', fontFamily: font }}>Add</span>
        </button>
      </div>
    </div>
  );
}
