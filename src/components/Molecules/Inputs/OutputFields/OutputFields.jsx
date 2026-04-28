import React, { useState } from 'react';
import VariableChip from '../VariableChip/VariableChip';
import AiWandIcon from '../../../Organisms/Panels/RHS/icons/ai_text_grammar_wand.svg';
import styles from './OutputFields.module.css';

const MOCK_GENERATED_FIELDS = [
  'sentiment_score',
  'key_themes',
  'staff_rating',
  'overall_experience',
  'recommendation_likelihood',
];

function Spinner() {
  return <div className={styles.spinner} />;
}

export default function OutputFields({ fields = [], onFieldsChange, showInfo }) {
  const [generateState, setGenerateState] = useState('idle');
  const [addingNew, setAddingNew] = useState(false);

  const handleGenerate = () => {
    setGenerateState('generating');
    setTimeout(() => setGenerateState('generated'), 2000);
  };

  const handleAcceptGenerated = () => {
    onFieldsChange?.([...fields, ...MOCK_GENERATED_FIELDS]);
    setGenerateState('idle');
  };

  const handleRegenerate = () => {
    setGenerateState('generating');
    setTimeout(() => setGenerateState('generated'), 2000);
  };

  const handleClose = () => setGenerateState('idle');

  const onChipChange = (i, v) => onFieldsChange?.(fields.map((f, idx) => (idx === i ? v : f)));
  const onChipDelete = (i) => onFieldsChange?.(fields.filter((_, idx) => idx !== i));
  const onCommitAdd = (v) => { onFieldsChange?.([...fields, v]); setAddingNew(false); };

  const hasChips = fields.length > 0 || addingNew;

  return (
    <div className={styles.wrap}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Output fields</span>
        {showInfo && <span className={`material-symbols-outlined ${styles.infoIcon}`}>info</span>}
      </div>

      <div className={styles.chipContainer}>
        {hasChips && (
          <div className={styles.chipWrap}>
            {fields.map((f, i) => (
              <VariableChip
                key={`${f}-${i}`}
                value={f}
                onChange={(v) => onChipChange(i, v)}
                onDelete={() => onChipDelete(i)}
              />
            ))}
            {addingNew && (
              <VariableChip
                value=""
                autoFocus
                onChange={onCommitAdd}
                onDelete={() => setAddingNew(false)}
              />
            )}
          </div>
        )}
        <button className={styles.addBtn} type="button" onClick={() => setAddingNew(true)}>
          <span className="material-symbols-outlined">add_circle</span>
          <span className={styles.addBtnLabel}>Add</span>
        </button>
      </div>

      {generateState === 'idle' && (
        <button className={styles.generateBtn} type="button" onClick={handleGenerate}>
          <img src={AiWandIcon} alt="" className={styles.generateIcon} />
          <span className={styles.generateLabel}>Generate from prompt</span>
        </button>
      )}

      {generateState === 'generating' && (
        <div className={styles.aiBox}>
          <div className={styles.generatingRow}>
            <Spinner />
            <span className={styles.generatingText}>Generating summary</span>
          </div>
        </div>
      )}

      {generateState === 'generated' && (
        <div className={styles.aiBox}>
          <button className={styles.aiCloseBtn} type="button" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
          <ul className={styles.generatedList}>
            {MOCK_GENERATED_FIELDS.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <div className={styles.aiActions}>
            <button className={styles.aiActionBtn} type="button" onClick={handleAcceptGenerated}>
              <span className="material-symbols-outlined">check_circle</span>
              Accept
            </button>
            <div className={styles.aiActionDivider} />
            <button className={styles.aiActionBtn} type="button" onClick={handleRegenerate}>
              <span className="material-symbols-outlined">restart_alt</span>
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
