import React, { useState, useRef, useEffect } from 'react';
import Modal from '@birdeye/elemental/core/atoms/Modal/index.js';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import Toggle from '@birdeye/elemental/core/atoms/Toggle/index.js';
import SearchFilter from '@birdeye/elemental/core/atoms/SearchFilter/index.js';
import './ContextFieldModal.css';

const TABS = ['Fields', 'Knowledge', 'Brand', 'Industry'];

const DEFAULT_FIELDS = [
  { id: 1,  name: 'Business name',      description: 'Name of the business location',          entity: 'Listings',  sampleData: 'Aspen Dental',          anonymize: false, showInOutput: true,  enabled: true },
  { id: 2,  name: 'Business category',  description: 'Primary business category',              entity: 'Listings',  sampleData: 'Dental Clinic',         anonymize: false, showInOutput: true,  enabled: true },
  { id: 3,  name: 'Business hours',     description: 'Operating hours of the location',        entity: 'Listings',  sampleData: '10:00 AM – 04:00 PM',   anonymize: false, showInOutput: true,  enabled: true },
  { id: 4,  name: 'Location address',   description: 'Street address of the location',         entity: 'Listings',  sampleData: '720 Castro St',         anonymize: false, showInOutput: true,  enabled: false },
  { id: 5,  name: 'Location phone',     description: 'Primary phone number of the location',   entity: 'Listings',  sampleData: '+1 415-000-0000',       anonymize: true,  showInOutput: true,  enabled: true },
  { id: 6,  name: 'Location email',     description: 'Primary email of the location',          entity: 'Listings',  sampleData: 'xyz@business.com',      anonymize: true,  showInOutput: false, enabled: true },
  { id: 7,  name: 'Review rating',      description: 'Star rating given by the reviewer',      entity: 'Reviews',   sampleData: '4',                     anonymize: false, showInOutput: true,  enabled: true },
  { id: 8,  name: 'Review text',        description: 'Body of the review left by the customer',entity: 'Reviews',   sampleData: 'Great service!',        anonymize: false, showInOutput: true,  enabled: true },
  { id: 9,  name: 'Reviewer name',      description: 'Name of the customer who left the review',entity: 'Reviews',  sampleData: 'Jane D.',               anonymize: true,  showInOutput: false, enabled: true },
  { id: 10, name: 'Review source',      description: 'Platform where the review was posted',   entity: 'Reviews',   sampleData: 'Google',                anonymize: false, showInOutput: true,  enabled: false },
  { id: 11, name: 'Contact first name', description: 'First name of the contact',              entity: 'Contacts',  sampleData: 'Raynil',                anonymize: true,  showInOutput: false, enabled: true },
  { id: 12, name: 'Contact last name',  description: 'Last name of the contact',               entity: 'Contacts',  sampleData: 'Kumar',                 anonymize: true,  showInOutput: false, enabled: true },
  { id: 13, name: 'Contact email',      description: 'Email address of the contact',           entity: 'Contacts',  sampleData: 'raynil@example.com',    anonymize: true,  showInOutput: false, enabled: true },
  { id: 14, name: 'Contact phone',      description: 'Phone number of the contact',            entity: 'Contacts',  sampleData: '+91 98291 99109',       anonymize: true,  showInOutput: false, enabled: false },
  { id: 15, name: 'Service offered',    description: 'Service the customer received',          entity: 'Contacts',  sampleData: 'Consultation',          anonymize: false, showInOutput: true,  enabled: true },
];

const DEFAULT_KNOWLEDGE = {
  files: [{ id: 1, name: 'Product list.PDF' }],
  links: [{ id: 1, url: 'https://www.aspendental.com/productsandservices' }],
};

const DEFAULT_BRAND_ITEMS = [
  { id: 1, name: 'Brand Profile', description: 'Everything about your business including description, mission statement, slogans, market positioning, products & services, competitors, and marketing goals', enabled: true },
  { id: 2, name: 'Target Customers', description: 'Information about your customers including audience overview, buying triggers, value propositions, and key segments', enabled: false },
  { id: 3, name: 'Style and Voice', description: 'Visual and writing style of your business including colors, fonts, imagery style, brand personality, tone of writing, and voice guidelines for emails, social posts, blogs, and reviews', enabled: true },
  { id: 4, name: 'Media', description: 'Media assets including logos, favicons, social images, and other key graphics pulled from the website', enabled: false },
  { id: 5, name: 'Guardrails', description: "Boundaries for AI including what it should and shouldn't say, topics to avoid, preferred phrases, and any other do's and don'ts to keep content on-brand", enabled: false },
];

// ── Custom underline tabs ─────────────────────────────────────────────────────
// TabsToggle from elemental renders as pill/toggle buttons — doesn't match Figma's
// underline-style tabs, so we build this custom.

function TabBar({ tabs, activeTab, onTabSelect }) {
  return (
    <div className="context-field-modal__tabs">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`context-field-modal__tab${activeTab === tab ? ' context-field-modal__tab--active' : ''}`}
          onClick={() => onTabSelect(tab)}
        >
          <span className="context-field-modal__tab-label">{tab}</span>
          <span className="context-field-modal__tab-underline" />
        </button>
      ))}
    </div>
  );
}

// ── Fields tab: accordion group ───────────────────────────────────────────────

function FieldAccordionGroup({ groupName, groupFields, onToggleEnabled, onToggleField, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const enabledCount = groupFields.filter(f => f.enabled).length;

  return (
    <div className="context-field-modal__accordion">
      <button className="context-field-modal__accordion-header" onClick={() => setIsOpen(o => !o)}>
        <span className={`material-symbols-outlined context-field-modal__accordion-chevron${isOpen ? ' context-field-modal__accordion-chevron--open' : ''}`}>
          chevron_right
        </span>
        <span className="context-field-modal__accordion-title">{groupName}</span>
        <span className="context-field-modal__accordion-badge">{enabledCount}/{groupFields.length}</span>
      </button>
      {isOpen && (
        <div className="context-field-modal__accordion-body">
          {groupFields.map(field => (
            <div
              key={field.id}
              className={`context-field-modal__accordion-row${!field.enabled ? ' context-field-modal__accordion-row--disabled' : ''}`}
            >
              <div className="context-field-modal__accordion-cell context-field-modal__accordion-cell--check">
                <FormInput
                  type="checkbox"
                  name={`enabled-${field.id}`}
                  checked={field.enabled}
                  onChange={() => onToggleEnabled(field.id)}
                />
              </div>
              <div className="context-field-modal__accordion-cell context-field-modal__accordion-cell--name">
                <p className="context-field-modal__field-name">{field.name}</p>
                <p className="context-field-modal__field-desc">{field.description}</p>
              </div>
              <div className="context-field-modal__accordion-cell context-field-modal__accordion-cell--sample">
                {field.sampleData}
              </div>
              <div className="context-field-modal__accordion-cell context-field-modal__accordion-cell--toggle">
                <FormInput
                  type="checkbox"
                  name={`anonymize-${field.id}`}
                  checked={field.anonymize}
                  onChange={() => onToggleField(field.id, 'anonymize')}
                />
              </div>
              <div className="context-field-modal__accordion-cell context-field-modal__accordion-cell--toggle">
                <FormInput
                  type="checkbox"
                  name={`show-${field.id}`}
                  checked={field.showInOutput}
                  onChange={() => onToggleField(field.id, 'showInOutput')}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Fields tab ────────────────────────────────────────────────────────────────

function FieldsTab({ fields, setFields }) {
  const [search, setSearch] = useState('');

  const toggleEnabled = (id) => setFields(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  const toggleField = (id, key) => setFields(prev => prev.map(f => f.id === id ? { ...f, [key]: !f[key] } : f));

  const filtered = fields.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.entity.toLowerCase().includes(search.toLowerCase())
  );

  const groups = filtered.reduce((acc, f) => {
    if (!acc[f.entity]) acc[f.entity] = [];
    acc[f.entity].push(f);
    return acc;
  }, {});

  const groupEntries = Object.entries(groups);

  return (
    <>
      <div className="context-field-modal__search-row">
        <SearchFilter
          searchStr={search}
          onInputValueChange={val => setSearch(val)}
          onCrossClickAction={() => setSearch('')}
          placeholder="Search"
        />
      </div>
      <div className="context-field-modal__fields-scroll">
        <div className="context-field-modal__col-header">
          <div className="context-field-modal__col-header-cell context-field-modal__col-header-cell--check" />
          <div className="context-field-modal__col-header-cell context-field-modal__col-header-cell--name">Name</div>
          <div className="context-field-modal__col-header-cell context-field-modal__col-header-cell--sample">Sample data</div>
          <div className="context-field-modal__col-header-cell context-field-modal__col-header-cell--toggle">
            Anonymize
            <span className="material-symbols-outlined context-field-modal__info-icon" title="Whether to anonymize this field">info</span>
          </div>
          <div className="context-field-modal__col-header-cell context-field-modal__col-header-cell--toggle">
            Show in output
            <span className="material-symbols-outlined context-field-modal__info-icon" title="Whether to show in output">info</span>
          </div>
        </div>
        {groupEntries.map(([source, groupFields], idx) => (
          <FieldAccordionGroup
            key={source}
            groupName={source}
            groupFields={groupFields}
            onToggleEnabled={toggleEnabled}
            onToggleField={toggleField}
            defaultOpen={idx === 0}
          />
        ))}
        {groupEntries.length === 0 && (
          <div className="context-field-modal__empty">No fields match your search.</div>
        )}
      </div>
    </>
  );
}

// ── Knowledge base file list (sample files for sub-panel) ────────────────────

const KB_FILES = [
  { id: 'kb1', name: 'Algorithm.pdf' },
  { id: 'kb2', name: 'Brand_junction.xls' },
  { id: 'kb3', name: 'Caretaker.png' },
  { id: 'kb4', name: 'Development.pdf' },
  { id: 'kb5', name: 'Food.jpeg' },
  { id: 'kb6', name: 'Information.pdf' },
];

const VISIBLE_LIMIT = 7;

// ── Knowledge tab ─────────────────────────────────────────────────────────────

function KnowledgeTab({ data, setData }) {
  const [addingLink, setAddingLink] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [filesExpanded, setFilesExpanded] = useState(false);
  const [linksExpanded, setLinksExpanded] = useState(false);
  const [showAddFileMenu, setShowAddFileMenu] = useState(false);
  const [showKbPanel, setShowKbPanel] = useState(false);
  const [kbSearch, setKbSearch] = useState('');
  const [kbSelected, setKbSelected] = useState([]);
  const fileInputRef = useRef(null);
  const nextId = useRef(100);
  const addFileRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showAddFileMenu && !showKbPanel) return;
    const onClickOutside = (e) => {
      if (addFileRef.current && !addFileRef.current.contains(e.target)) {
        setShowAddFileMenu(false);
        setShowKbPanel(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showAddFileMenu, showKbPanel]);

  const removeFile = (id) => setData(prev => ({ ...prev, files: prev.files.filter(f => f.id !== id) }));
  const removeLink = (id) => setData(prev => ({ ...prev, links: prev.links.filter(l => l.id !== id) }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setData(prev => ({ ...prev, files: [...prev.files, { id: nextId.current++, name: file.name }] }));
    e.target.value = '';
  };

  const confirmLink = () => {
    const url = linkInput.trim();
    if (url) setData(prev => ({ ...prev, links: [...prev.links, { id: nextId.current++, url }] }));
    setLinkInput('');
    setAddingLink(false);
  };

  const handleKbDone = () => {
    const toAdd = KB_FILES
      .filter(f => kbSelected.includes(f.id))
      .filter(f => !data.files.some(existing => existing.name === f.name))
      .map(f => ({ id: nextId.current++, name: f.name }));
    if (toAdd.length) setData(prev => ({ ...prev, files: [...prev.files, ...toAdd] }));
    setKbSelected([]);
    setShowKbPanel(false);
    setShowAddFileMenu(false);
  };

  const toggleKbItem = (id) =>
    setKbSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filteredKbFiles = KB_FILES.filter(f =>
    f.name.toLowerCase().includes(kbSearch.toLowerCase())
  );

  const visibleFiles = filesExpanded ? data.files : data.files.slice(0, VISIBLE_LIMIT);
  const hiddenFilesCount = data.files.length - VISIBLE_LIMIT;
  const visibleLinks = linksExpanded ? data.links : data.links.slice(0, VISIBLE_LIMIT);
  const hiddenLinksCount = data.links.length - VISIBLE_LIMIT;

  return (
    <div className="context-field-modal__tab-content">
      <div className="context-field-modal__section">
        <div className="context-field-modal__section-header">
          <p className="context-field-modal__section-title">Files</p>
          <span className="material-symbols-outlined context-field-modal__section-info" title="Upload files to provide context">info</span>
        </div>
        <div className="context-field-modal__items">
          {visibleFiles.map(file => (
            <div key={file.id} className="context-field-modal__item">
              <div className="context-field-modal__item-icon context-field-modal__item-icon--file">
                <span className="material-symbols-outlined">draft</span>
              </div>
              <span className="context-field-modal__item-label">{file.name}</span>
              <button className="context-field-modal__item-remove" onClick={() => removeFile(file.id)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ))}
          {!filesExpanded && hiddenFilesCount > 0 && (
            <button className="context-field-modal__show-more" onClick={() => setFilesExpanded(true)}>
              +{hiddenFilesCount} more
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
        <div ref={addFileRef} className="context-field-modal__add-file-wrapper">
          <button
            className="context-field-modal__add-btn"
            onClick={() => { setShowAddFileMenu(v => !v); setShowKbPanel(false); }}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add
          </button>
          {showAddFileMenu && !showKbPanel && (
            <div className="context-field-modal__add-file-dropdown">
              <button
                className="context-field-modal__dropdown-option"
                onClick={() => { fileInputRef.current?.click(); setShowAddFileMenu(false); }}
              >
                Upload
              </button>
              <button
                className="context-field-modal__dropdown-option"
                onClick={() => setShowKbPanel(true)}
              >
                Select from Knowledge base
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
          {showKbPanel && (
            <div className="context-field-modal__kb-panel">
              <div className="context-field-modal__kb-search">
                <SearchFilter
                  searchStr={kbSearch}
                  onInputValueChange={val => setKbSearch(val)}
                  onCrossClickAction={() => setKbSearch('')}
                  placeholder="Search"
                />
              </div>
              <div className="context-field-modal__kb-list">
                {filteredKbFiles.map(f => (
                  <div key={f.id} className="context-field-modal__kb-item" onClick={() => toggleKbItem(f.id)}>
                    <FormInput
                      type="checkbox"
                      name={`kb-${f.id}`}
                      checked={kbSelected.includes(f.id)}
                      onChange={() => toggleKbItem(f.id)}
                    />
                    <div className="context-field-modal__kb-item-icon">
                      <span className="material-symbols-outlined">draft</span>
                    </div>
                    <span className="context-field-modal__kb-item-name">{f.name}</span>
                  </div>
                ))}
              </div>
              <div className="context-field-modal__kb-footer">
                <Button type="primary" label="Done" onClick={handleKbDone} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="context-field-modal__section">
        <p className="context-field-modal__section-title">Links</p>
        <div className="context-field-modal__items">
          {visibleLinks.map(link => (
            <div key={link.id} className="context-field-modal__item">
              <div className="context-field-modal__item-icon context-field-modal__item-icon--link">
                <span className="material-symbols-outlined">link</span>
              </div>
              <span className="context-field-modal__item-label">{link.url}</span>
              <button className="context-field-modal__item-remove" onClick={() => removeLink(link.id)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ))}
          {!linksExpanded && hiddenLinksCount > 0 && (
            <button className="context-field-modal__show-more" onClick={() => setLinksExpanded(true)}>
              +{hiddenLinksCount} more
            </button>
          )}
          {addingLink && (
            <div className="context-field-modal__item">
              <div className="context-field-modal__item-icon context-field-modal__item-icon--link">
                <span className="material-symbols-outlined">link</span>
              </div>
              <input
                className="context-field-modal__link-input"
                type="text"
                placeholder="Enter URL"
                value={linkInput}
                autoFocus
                onChange={e => setLinkInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') confirmLink(); if (e.key === 'Escape') { setAddingLink(false); setLinkInput(''); } }}
                onBlur={confirmLink}
              />
            </div>
          )}
        </div>
        <button className="context-field-modal__add-btn" onClick={() => setAddingLink(true)}>
          <span className="material-symbols-outlined">add_circle</span>
          Add
        </button>
      </div>
    </div>
  );
}

// ── Brand tab ─────────────────────────────────────────────────────────────────

function BrandTab({ items, setItems }) {
  const toggleItem = (id) => setItems(prev => prev.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));

  return (
    <div className="context-field-modal__table-wrapper">
      <table className="context-field-modal__table">
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="context-field-modal__row">
              <td className="context-field-modal__td context-field-modal__td--check context-field-modal__td--brand-check">
                <FormInput type="checkbox" name={`brand-${item.id}`} checked={item.enabled} onChange={() => toggleItem(item.id)} />
              </td>
              <td className="context-field-modal__td context-field-modal__td--brand-content">
                <p className="context-field-modal__field-name">{item.name}</p>
                <p className="context-field-modal__brand-desc">{item.description}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Industry tab ──────────────────────────────────────────────────────────────

function IndustryTab({ enabled, setEnabled }) {
  return (
    <div className="context-field-modal__tab-content">
      <div className="context-field-modal__industry-row">
        <div className="context-field-modal__industry-text">
          <p className="context-field-modal__industry-title">Industry context</p>
          <p className="context-field-modal__industry-desc">
            Built-in industry expertise and compliance guidelines created by Birdeye. Enable this to send industry context along with your prompts
          </p>
        </div>
        <Toggle
          name="industry-context-toggle"
          checked={enabled}
          onChange={(_, e) => setEnabled(e.target.checked)}
        />
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function ContextFieldModal({
  isOpen,
  onClose,
  onSave,
  initialFields = DEFAULT_FIELDS,
  initialKnowledge = DEFAULT_KNOWLEDGE,
  initialBrandItems = DEFAULT_BRAND_ITEMS,
  initialIndustryEnabled = true,
  defaultTab = 'Fields',
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [fields, setFields] = useState(initialFields);
  const [knowledge, setKnowledge] = useState(initialKnowledge);
  const [brandItems, setBrandItems] = useState(initialBrandItems);
  const [industryEnabled, setIndustryEnabled] = useState(initialIndustryEnabled);

  const handleSave = () => {
    onSave?.({ fields, knowledge, brandItems, industryEnabled });
    onClose();
  };

  return (
    <Modal
      dialogOptions={{
        isOpen,
        onCloseModal: onClose,
        showCloseIcon: false,
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEsc: true,
        dialogStyles: {
          content: {
            padding: 0,
            maxWidth: 1200,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 130px)',
          },
        },
      }}
    >
      <div className="context-field-modal">
        <div className="context-field-modal__header">
          <div className="context-field-modal__titles">
            <p className="context-field-modal__title">Context</p>
            <p className="context-field-modal__subtitle">
              This is sent to the LLM to improve the accuracy and quality of responses.
            </p>
          </div>
          <div className="context-field-modal__header-actions">
            <Button type="primary" label="Save" onClick={handleSave} />
            <button className="context-field-modal__close" onClick={onClose}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <TabBar tabs={TABS} activeTab={activeTab} onTabSelect={setActiveTab} />

        {activeTab === 'Fields' && <FieldsTab fields={fields} setFields={setFields} />}
        {activeTab === 'Knowledge' && <KnowledgeTab data={knowledge} setData={setKnowledge} />}
        {activeTab === 'Brand' && <BrandTab items={brandItems} setItems={setBrandItems} />}
        {activeTab === 'Industry' && <IndustryTab enabled={industryEnabled} setEnabled={setIndustryEnabled} />}
      </div>
    </Modal>
  );
}
