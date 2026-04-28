import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import CustomToolBuilder from '../../Drawers/CustomToolBuilder/CustomToolBuilder.jsx';
import CustomToolViewer from '../../Drawers/CustomToolViewer/CustomToolViewer.jsx';
import styles from './EntityTaskBody.module.css';

export default function EntityTaskBody({ initialValues = {}, onFieldChange }) {
  const [taskName, setTaskName] = useState(initialValues.taskName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [isCustomToolBuilderOpen, setIsCustomToolBuilderOpen] = useState(false);
  const [customTools, setCustomTools] = useState([]);
  const [viewerTool, setViewerTool] = useState(null);

  const handleTaskName = (e) => {
    const val = e.target.value;
    setTaskName(val);
    onFieldChange?.('taskName', val);
  };

  const handleDescription = (e) => {
    const val = e.target.value;
    setDescription(val);
    onFieldChange?.('description', val);
  };

  const handleDeleteTool = (id) => {
    setCustomTools((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTool = (updated) => {
    setCustomTools((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setViewerTool(null);
  };

  return (
    <>
      <div className={styles.formContainer}>
        <FormInput
          name="taskName"
          type="text"
          label="Task name"
          placeholder="Enter name"
          value={taskName}
          onChange={handleTaskName}
          required
        />
        <TextArea
          name="description"
          label="Description"
          placeholder="Enter description"
          value={description}
          onChange={handleDescription}
          noFloatingLabel
        />

        <div className={styles.toolsSection}>
          {/* Section label */}
          <div className={styles.sectionLabelWrapper}>
            <span className={styles.sectionLabelText}>Tools</span>
            <span className={`material-symbols-outlined ${styles.sectionLabelIcon}`}>info</span>
          </div>

          {/* Add box */}
          <div className={styles.addBox}>
            <button className={styles.addBtn} onClick={() => setIsCustomToolBuilderOpen(true)}>
              <span className={`material-symbols-outlined ${styles.addBtnIcon}`}>add_circle</span>
              <span className={styles.addBtnLabel}>Add</span>
            </button>

            {/* Saved tool rows */}
            {customTools.map((tool) => (
              <div key={tool.id} className={styles.toolRow}>
                <div className={styles.toolIconWrap}>
                  {tool.iconDataUrl ? (
                    <img src={tool.iconDataUrl} alt={tool.name} className={styles.toolIconImg} />
                  ) : (
                    <span className={`material-symbols-outlined ${styles.toolIconFallback}`}>build</span>
                  )}
                </div>
                <span className={styles.toolName}>{tool.name}</span>
                <div className={styles.toolActions}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => setViewerTool(tool)}
                    title="Edit tool"
                  >
                    <span className={`material-symbols-outlined ${styles.iconBtnIcon}`}>edit</span>
                  </button>
                  <button
                    className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                    onClick={() => handleDeleteTool(tool.id)}
                    title="Delete tool"
                  >
                    <span className={`material-symbols-outlined ${styles.iconBtnIcon}`}>delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CustomToolBuilder
        isOpen={isCustomToolBuilderOpen}
        onClose={() => setIsCustomToolBuilderOpen(false)}
        onSave={(tool) => {
          setCustomTools((prev) => [...prev, tool]);
          setIsCustomToolBuilderOpen(false);
        }}
      />

      {viewerTool && (
        <CustomToolViewer
          isOpen
          tool={viewerTool}
          onClose={() => setViewerTool(null)}
          onUpdate={handleUpdateTool}
        />
      )}
    </>
  );
}
