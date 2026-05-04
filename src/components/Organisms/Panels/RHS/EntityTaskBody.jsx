import React, { useState, useEffect } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import ToolLibraryDrawer from '../../Drawers/ToolLibraryDrawer/ToolLibraryDrawer.jsx';
import CustomToolViewer from '../../Drawers/CustomToolViewer/CustomToolViewer.jsx';
import CustomToolBuilder from '../../Drawers/CustomToolBuilder/CustomToolBuilder.jsx';
import { subscribeToCustomTools } from '../../../../services/agentService';
import styles from './EntityTaskBody.module.css';

export default function EntityTaskBody({ initialValues = {}, onFieldChange }) {
  const [taskName, setTaskName] = useState(initialValues.taskName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [selectedTools, setSelectedTools] = useState(initialValues.selectedTools ?? []);
  const [allTools, setAllTools] = useState([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewingTool, setViewingTool] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);

  useEffect(() => {
    const unsub = subscribeToCustomTools((tools) => setAllTools(tools));
    return unsub;
  }, []);

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

  const handleToggleTool = (toolId) => {
    setSelectedTools((prev) => {
      const next = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];
      onFieldChange?.('selectedTools', next);
      return next;
    });
  };

  const handleRemoveTool = (toolId) => {
    setSelectedTools((prev) => {
      const next = prev.filter((id) => id !== toolId);
      onFieldChange?.('selectedTools', next);
      return next;
    });
  };

  const openViewer = (tool) => {
    setViewingTool(tool);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setViewingTool(null);
  };

  const openEditFromViewer = (tool) => {
    setIsViewerOpen(false);
    setViewingTool(null);
    setEditingTool(tool);
    setIsBuilderOpen(true);
  };

  const displayedTools = allTools.filter((t) => selectedTools.includes(t.id));

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
          <div className={styles.sectionLabelWrapper}>
            <span className={styles.sectionLabelText}>Tools</span>
            <span className={`material-symbols-outlined ${styles.sectionLabelIcon}`}>info</span>
          </div>

          <div className={styles.addBox}>
            {selectedTools.length === 0 && (
              <button className={styles.addBtn} onClick={() => setIsLibraryOpen(true)}>
                <span className={`material-symbols-outlined ${styles.addBtnIcon}`}>add_circle</span>
                <span className={styles.addBtnLabel}>Add</span>
              </button>
            )}

            {displayedTools.map((tool) => (
              <div key={tool.id} className={styles.toolRow}>
                <button
                  className={styles.toolRowMain}
                  type="button"
                  onClick={() => openViewer(tool)}
                >
                  <div className={styles.toolIconWrap}>
                    {tool.iconDataUrl ? (
                      <img src={tool.iconDataUrl} alt={tool.name} className={styles.toolIconImg} />
                    ) : (
                      <span className={`material-symbols-outlined ${styles.toolIconFallback}`}>build</span>
                    )}
                  </div>
                  <span className={styles.toolName}>{tool.name}</span>
                </button>
                <div className={styles.toolActions}>
                  <button
                    className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                    onClick={() => handleRemoveTool(tool.id)}
                    title="Remove tool"
                  >
                    <span className={`material-symbols-outlined ${styles.iconBtnIcon}`}>close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToolLibraryDrawer
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        selectedToolIds={selectedTools}
        onToggleTool={handleToggleTool}
      />

      <CustomToolViewer
        isOpen={isViewerOpen}
        tool={viewingTool}
        onClose={closeViewer}
        onEditTool={openEditFromViewer}
      />

      <CustomToolBuilder
        isOpen={isBuilderOpen}
        initialTool={editingTool}
        onClose={() => { setIsBuilderOpen(false); setEditingTool(null); }}
        onSave={() => { setIsBuilderOpen(false); setEditingTool(null); }}
      />
    </>
  );
}
