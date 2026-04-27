import React, { useState } from 'react';
import ContextFieldModal from './ContextFieldModal';

export default {
  title: 'Agent Builder/Organisms/Modals/ContextFieldModal',
  component: ContextFieldModal,
  parameters: { layout: 'fullscreen' },
};

function Wrapper({ defaultTab, ...props }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ height: '100vh', background: '#f4f6f7' }}>
      <button onClick={() => setOpen(true)} style={{ margin: 24, padding: '8px 16px', cursor: 'pointer' }}>
        Open modal
      </button>
      <ContextFieldModal
        isOpen={open}
        defaultTab={defaultTab}
        onClose={() => setOpen(false)}
        onSave={(data) => { console.log('Saved:', data); setOpen(false); }}
        {...props}
      />
    </div>
  );
}

export const FieldsTab = { render: () => <Wrapper defaultTab="Fields" /> };

export const KnowledgeTab = {
  render: () => (
    <Wrapper
      defaultTab="Knowledge"
      initialKnowledge={{
        files: [{ id: 1, name: 'Product list.PDF' }],
        links: [{ id: 1, url: 'https://www.aspendental.com/productsandservices' }],
      }}
    />
  ),
};

export const KnowledgeTabMultipleItems = {
  render: () => (
    <Wrapper
      defaultTab="Knowledge"
      initialKnowledge={{
        files: [
          { id: 1, name: 'Product list.PDF' },
          { id: 2, name: 'Brand_junction.xls' },
        ],
        links: [
          { id: 1, url: 'https://www.aspendental.com/productsandservices' },
          { id: 2, url: 'https://www.birdeye.com' },
        ],
      }}
    />
  ),
};

export const BrandTab = {
  render: () => <Wrapper defaultTab="Brand" />,
};

export const IndustryTabEnabled = {
  render: () => <Wrapper defaultTab="Industry" initialIndustryEnabled={true} />,
};

export const IndustryTabDisabled = {
  render: () => <Wrapper defaultTab="Industry" initialIndustryEnabled={false} />,
};
