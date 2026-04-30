import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import styles from './TemplateLibrary.module.css';

const DEFAULT_TEMPLATES = [
  { id: '1', title: 'Review response agent replying using templates', description: 'Uses pre-defined templates and responds to reviews automatically.' },
  { id: '2', title: 'Review response agent replying autonomously', description: 'Uses AI to analyze review sentiment, generates and posts unique, context aware replies automatically.' },
  { id: '3', title: 'Review response agent replying after human approval', description: 'Uses AI to analyze review sentiment, generates and sends unique, context-aware replies for a human approval before posting.' },
  { id: '4', title: 'Review response agent suggesting replies in dashboard', description: 'Uses AI to analyze review sentiment, generates and shows unique, context-aware replies in the dashboard for one-click manual posting.' },
];

const emptyDraft = { title: '', description: '' };

function TemplateForm({ initialTemplate = emptyDraft, onCancel, onSave }) {
  const [draft, setDraft] = useState({
    title: initialTemplate.title || '',
    description: initialTemplate.description || '',
  });
  const canSave = draft.title.trim() && draft.description.trim();

  return (
    <div className={styles.form}>
      <FormInput
        name={`templateTitle_${initialTemplate.id || 'new'}`}
        type="text"
        label="Template title"
        placeholder="Enter template title"
        value={draft.title}
        onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
        required
      />
      <TextArea
        name={`templateDescription_${initialTemplate.id || 'new'}`}
        label="Template description"
        placeholder="Describe what this template should create"
        value={draft.description}
        onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
        noFloatingLabel
      />
      <div className={styles.formActions}>
        <Button theme="secondary" label="Cancel" onClick={onCancel} />
        <Button
          theme="primary"
          label="Save"
          disabled={!canSave}
          onClick={() => onSave({
            ...initialTemplate,
            title: draft.title.trim(),
            description: draft.description.trim(),
          })}
        />
      </div>
    </div>
  );
}

function TemplateGridCard({ template, onDelete, onEdit, onSave, onUse, onShare }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className={styles.card}>
        <TemplateForm
          initialTemplate={template}
          onCancel={() => setEditing(false)}
          onSave={(nextTemplate) => {
            onSave?.(nextTemplate);
            setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <p className={`${styles.title} ${styles.clampTitle}`}>{template.title}</p>
        <p className={`${styles.description} ${styles.clampDescription}`}>{template.description}</p>
      </div>
      <div className={styles.cardActions}>
        <Button type="primary" size="small" label="Use agent" onClick={() => onUse?.(template.id)} />
        <button className={styles.editButton} type="button" title="Share template" onClick={() => onShare?.(template)}>
          <span className="material-symbols-outlined">share</span>
        </button>
        <button className={styles.editButton} type="button" title="Edit template" onClick={() => { onEdit?.(template); setEditing(true); }}>
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button className={`${styles.editButton} ${styles.deleteButton}`} type="button" title="Delete template" onClick={() => onDelete?.(template.id)}>
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
}

function AddTemplateCard({ onSave }) {
  const [adding, setAdding] = useState(false);

  if (adding) {
    return (
      <div className={styles.card}>
        <TemplateForm
          onCancel={() => setAdding(false)}
          onSave={(template) => {
            onSave?.(template);
            setAdding(false);
          }}
        />
      </div>
    );
  }

  return (
    <button className={`${styles.card} ${styles.addCard}`} type="button" onClick={() => setAdding(true)}>
      <span className={`material-symbols-outlined ${styles.addIcon}`}>add_circle</span>
      <span className={styles.title}>Add template</span>
    </button>
  );
}

function TemplateListView({ templates, onCreateTemplate, onDeleteTemplate, onSaveTemplate, onUseTemplate, onShareTemplate }) {
  return (
    <div className={styles.list}>
      <div className={styles.listHeader}>
        <div className={styles.listHeaderName}>
          <span>Name</span>
          <span className="material-symbols-outlined">expand_more</span>
        </div>
      </div>

      {templates.map((template) => (
        <div key={template.id} className={styles.row}>
          <div className={styles.rowBody}>
            <span className={styles.rowTitle}>{template.title}</span>
            <span className={styles.rowDescription}>{template.description}</span>
          </div>
          <div className={styles.rowActions}>
            <Button type="primary" size="small" label="Use agent" onClick={() => onUseTemplate?.(template.id)} />
            <button className={styles.editButton} type="button" title="Share template" onClick={() => onShareTemplate?.(template)}>
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className={styles.editButton} type="button" title="Edit template" onClick={() => onSaveTemplate?.({ ...template, editRequested: true })}>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className={`${styles.editButton} ${styles.deleteButton}`} type="button" title="Delete template" onClick={() => onDeleteTemplate?.(template.id)}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      ))}

      <div className={styles.row}>
        <TemplateForm onCancel={() => {}} onSave={onCreateTemplate} />
      </div>
    </div>
  );
}

export default function TemplateLibrary({
  templates = DEFAULT_TEMPLATES,
  variant = 'grid',
  initialCount = 3,
  onCreateTemplate,
  onDeleteTemplate,
  onSaveTemplate,
  onUseTemplate,
  onShareTemplate,
  onSeeMore,
}) {
  const [listEditTemplate, setListEditTemplate] = useState(null);
  const visible = variant === 'see-more' ? templates.slice(0, initialCount) : templates;
  const hasMore = variant === 'see-more' && templates.length > initialCount;

  if (variant === 'list') {
    if (listEditTemplate) {
      return (
        <div className={styles.card}>
          <TemplateForm
            initialTemplate={listEditTemplate}
            onCancel={() => setListEditTemplate(null)}
            onSave={(template) => {
              onSaveTemplate?.(template);
              setListEditTemplate(null);
            }}
          />
        </div>
      );
    }

    return (
      <TemplateListView
        templates={templates}
        onCreateTemplate={onCreateTemplate}
        onDeleteTemplate={onDeleteTemplate}
        onSaveTemplate={setListEditTemplate}
        onUseTemplate={onUseTemplate}
        onShareTemplate={onShareTemplate}
      />
    );
  }

  return (
    <div className={styles.library}>
      <div className={styles.grid}>
        {visible.map((template) => (
          <TemplateGridCard
            key={template.id}
            template={template}
            onDelete={onDeleteTemplate}
            onSave={onSaveTemplate}
            onUse={onUseTemplate}
            onShare={onShareTemplate}
          />
        ))}
        {variant !== 'see-more' && <AddTemplateCard onSave={onCreateTemplate} />}
      </div>

      {hasMore && (
        <button className={styles.seeMore} type="button" onClick={() => onSeeMore?.()}>
          See more
        </button>
      )}
    </div>
  );
}

TemplateForm.propTypes = {
  initialTemplate: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

TemplateGridCard.propTypes = {
  template: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  onUse: PropTypes.func,
};

AddTemplateCard.propTypes = {
  onSave: PropTypes.func,
};

TemplateListView.propTypes = {
  templates: PropTypes.array,
  onCreateTemplate: PropTypes.func,
  onDeleteTemplate: PropTypes.func,
  onSaveTemplate: PropTypes.func,
  onUseTemplate: PropTypes.func,
};

TemplateLibrary.propTypes = {
  templates: PropTypes.array,
  variant: PropTypes.string,
  initialCount: PropTypes.number,
  onCreateTemplate: PropTypes.func,
  onDeleteTemplate: PropTypes.func,
  onSaveTemplate: PropTypes.func,
  onUseTemplate: PropTypes.func,
  onSeeMore: PropTypes.func,
};
