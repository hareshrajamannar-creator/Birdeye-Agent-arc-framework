import React, { useState, useRef } from 'react';
import CommonSideDrawer from '@birdeye/elemental/core/atoms/CommonSideDrawer/index.js';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import {
  PreviewField,
  FieldCard,
  AddFieldPanel,
  emptyField,
} from '../CustomToolBuilder/CustomToolBuilder.jsx';
import styles from './CustomToolViewer.module.css';

export default function CustomToolViewer({ isOpen, tool, onClose, onUpdate }) {
  const [mode, setMode] = useState('view');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFields, setEditFields] = useState([]);
  const [editIconDataUrl, setEditIconDataUrl] = useState(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const iconInputRef = useRef(null);

  const enterEdit = () => {
    setEditName(tool?.name ?? '');
    setEditDescription(tool?.description ?? '');
    setEditFields(tool?.fields ?? []);
    setEditIconDataUrl(tool?.iconDataUrl ?? null);
    setShowAddPanel(false);
    setMode('edit');
  };

  const cancelEdit = () => {
    setShowAddPanel(false);
    setMode('view');
  };

  const handleSave = () => {
    if (!editName.trim()) return;
    onUpdate?.({
      ...tool,
      name: editName.trim(),
      description: editDescription.trim(),
      fields: editFields,
      iconDataUrl: editIconDataUrl,
    });
    setMode('view');
    setShowAddPanel(false);
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setEditIconDataUrl(evt.target.result);
    reader.readAsDataURL(file);
  };

  const handleAddField = (type) => {
    setEditFields((prev) => [...prev, emptyField(type)]);
    setShowAddPanel(false);
  };

  const handleUpdateField = (id, updated) => {
    setEditFields((prev) => prev.map((f) => (f.id === id ? updated : f)));
  };

  const handleDeleteField = (id) => {
    setEditFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setEditFields((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const handleMoveDown = (index) => {
    setEditFields((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  if (!tool) return null;

  return (
    <CommonSideDrawer
      isOpen={isOpen}
      title={tool.name}
      onClose={onClose}
      width="480px"
      shouldScroll={false}
      buttonPosition="right"
    >
      <div className={styles.viewer}>
        {mode === 'view' ? (
          <>
            <div className={styles.topBar}>
              <Button type="link" label="Edit" onClick={enterEdit} />
            </div>

            <div className={styles.viewBody}>
              <div className={styles.infoRow}>
                {tool.iconDataUrl ? (
                  <img src={tool.iconDataUrl} alt={tool.name} className={styles.toolIcon} />
                ) : (
                  <span className={`material-symbols-outlined ${styles.toolIconFallback}`}>build</span>
                )}
                <div className={styles.infoText}>
                  <span className={styles.toolName}>{tool.name}</span>
                  {tool.description && (
                    <span className={styles.toolDesc}>{tool.description}</span>
                  )}
                </div>
              </div>

              {tool.fields?.length > 0 && (
                <div className={styles.fieldsSection}>
                  <span className={styles.fieldsSectionLabel}>Form fields</span>
                  <div className={styles.previewCard}>
                    {tool.fields.map((f) => (
                      <PreviewField key={f.id} field={f} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <Button theme="secondary" label="Close" onClick={onClose} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.editBody}>
              {/* Tool name */}
              <div className={styles.fieldGroup}>
                <span className={styles.label}>Tool name</span>
                <input
                  className={styles.input}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Tool name"
                />
              </div>

              {/* Icon upload */}
              <div className={styles.fieldGroup}>
                <span className={styles.label}>Tool icon</span>
                <span className={styles.sublabel}>Upload SVG or PNG (optional)</span>
                <button
                  className={styles.iconUpload}
                  type="button"
                  onClick={() => iconInputRef.current?.click()}
                >
                  {editIconDataUrl ? (
                    <img src={editIconDataUrl} alt="Tool icon" className={styles.iconPreview} />
                  ) : (
                    <span className={`material-symbols-outlined ${styles.iconUploadSym}`}>upload</span>
                  )}
                </button>
                <input
                  ref={iconInputRef}
                  type="file"
                  accept=".svg,.png"
                  className={styles.iconInput}
                  onChange={handleIconChange}
                />
              </div>

              {/* Description */}
              <div className={styles.fieldGroup}>
                <span className={styles.label}>Description</span>
                <textarea
                  className={styles.textarea}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe what this tool does…"
                />
              </div>

              {/* Fields */}
              <div className={styles.fieldGroup}>
                <div className={styles.fieldsHeader}>
                  <span className={styles.label}>Form fields</span>
                  <span className={styles.fieldsCount}>
                    {editFields.length} field{editFields.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {editFields.length > 0 && (
                  <div className={styles.fieldsList}>
                    {editFields.map((field, i) => (
                      <FieldCard
                        key={field.id}
                        field={field}
                        index={i}
                        total={editFields.length}
                        onChange={(updated) => handleUpdateField(field.id, updated)}
                        onDelete={() => handleDeleteField(field.id)}
                        onMoveUp={() => handleMoveUp(i)}
                        onMoveDown={() => handleMoveDown(i)}
                      />
                    ))}
                  </div>
                )}

                {showAddPanel ? (
                  <AddFieldPanel
                    onAdd={handleAddField}
                    onCancel={() => setShowAddPanel(false)}
                  />
                ) : (
                  <button
                    className={styles.addFieldBtn}
                    type="button"
                    onClick={() => setShowAddPanel(true)}
                  >
                    <span className={`material-symbols-outlined ${styles.addFieldBtnIcon}`}>add_circle</span>
                    Add a field
                  </button>
                )}
              </div>
            </div>

            <div className={styles.footer}>
              <Button theme="secondary" label="Cancel" onClick={cancelEdit} />
              <Button
                theme="primary"
                label="Save"
                disabled={!editName.trim()}
                onClick={handleSave}
              />
            </div>
          </>
        )}
      </div>
    </CommonSideDrawer>
  );
}
