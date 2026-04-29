import React, { useState, useEffect, useRef } from 'react';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import ExpandedRHSTestInput from '../../../Molecules/ExpandedRHS/ExpandedRHSTestInput/ExpandedRHSTestInput';
import ExpandedRHSTestOutput from '../../../Molecules/ExpandedRHS/ExpandedRHSTestOutput/ExpandedRHSTestOutput';
import ExpandedRHSTestFeedback from '../../../Molecules/ExpandedRHS/ExpandedRHSTestFeedback/ExpandedRHSTestFeedback';
import styles from './ExpandedRHSTest.module.css';

function normalizeFields(raw) {
  return (raw ?? []).map((f) =>
    typeof f === 'string'
      ? { name: f, value: '', type: 'variable', images: [] }
      : { name: f.name ?? '', value: f.value ?? '', type: f.type ?? 'variable', images: f.images ?? [] }
  );
}

function fieldsKey(raw) {
  return (raw ?? []).map((f) => (typeof f === 'string' ? f : (f.name ?? ''))).join('\x00');
}

export default function ExpandedRHSTest({
  inputFields = [],
  outputFields = [],
  onRun,
  defaultRun = false,
}) {
  const [hasRun, setHasRun] = useState(defaultRun);
  const [localInputFields, setLocalInputFields] = useState(() => normalizeFields(inputFields));
  const [localOutputFields, setLocalOutputFields] = useState(() => normalizeFields(outputFields));
  const [feedback, setFeedback] = useState('');

  const inputKeyRef = useRef(fieldsKey(inputFields));
  const outputKeyRef = useRef(fieldsKey(outputFields));

  useEffect(() => {
    const key = fieldsKey(inputFields);
    if (key === inputKeyRef.current) return;
    inputKeyRef.current = key;
    setLocalInputFields(normalizeFields(inputFields));
  }, [inputFields]);

  useEffect(() => {
    const key = fieldsKey(outputFields);
    if (key === outputKeyRef.current) return;
    outputKeyRef.current = key;
    setLocalOutputFields(normalizeFields(outputFields));
  }, [outputFields]);

  const handleRun = () => {
    setHasRun(true);
    onRun?.(localInputFields);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.previewLabel}>Preview</span>
        <Button
          type="secondary"
          label="Run task"
          icon="play_arrow"
          iconPosition="left"
          onClick={handleRun}
        />
      </div>

      <ExpandedRHSTestInput
        fields={localInputFields}
        onChange={setLocalInputFields}
      />

      <ExpandedRHSTestOutput
        rows={localOutputFields}
        onChange={setLocalOutputFields}
      />

      {hasRun && (
        <ExpandedRHSTestFeedback
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          onSubmit={handleRun}
        />
      )}
    </div>
  );
}
