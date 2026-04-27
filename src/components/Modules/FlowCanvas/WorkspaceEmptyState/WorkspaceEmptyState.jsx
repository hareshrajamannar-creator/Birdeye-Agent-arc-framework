import React, { useState } from 'react';
import TemplateLibrary from '../../../Organisms/TemplateLibrary/TemplateLibrary';

const font = '"Roboto", sans-serif';

function WorkspaceIllustration() {
  return (
    <div style={{
      width: 168,
      background: '#fff',
      borderRadius: 6,
      padding: '20px 10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 2px 12px rgba(33,33,33,0.08)',
    }}>
      <div style={{ background: '#ebeff6', borderRadius: 4, height: 23, width: 76, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
        <div style={{ background: '#afbcdf', height: 4, borderRadius: 100, width: 51 }} />
      </div>

      <div style={{ display: 'flex', gap: 4, marginTop: 1 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ width: 36, height: 31, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width="36" height="31" viewBox="0 0 36 31" fill="none" style={{ position: 'absolute' }}>
              <path d="M18 0 L18 12 M18 12 L6 24 M18 12 L30 24" stroke="#afbcdf" strokeWidth="1" fill="none"/>
            </svg>
            <div style={{ background: '#f4f6f7', borderRadius: 40, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#555', lineHeight: 1 }}>add</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginTop: 1, width: '100%' }}>
        <div style={{ background: '#ebeff6', border: '1px dashed #2b3650', borderRadius: 4, height: 23, width: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#555', lineHeight: 1 }}>add</span>
        </div>
        <div style={{ background: '#ebeff6', borderRadius: 4, height: 23, flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
          <div style={{ background: '#afbcdf', height: 4, borderRadius: 100, width: '80%' }} />
        </div>
      </div>
    </div>
  );
}

function AiCardOverlay() {
  return (
    <div style={{
      position: 'absolute',
      top: -23,
      right: -62,
      background: '#ecf5fd',
      border: '1px solid #6834b7',
      borderRadius: 4,
      padding: '11px 7px',
      display: 'flex',
      alignItems: 'flex-end',
      gap: 5,
      width: 116,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#6834b7', lineHeight: 1 }}>auto_awesome</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ background: '#3790e7', height: 4, borderRadius: 100, width: '100%' }} />
        <div style={{ background: '#9aceff', height: 4, borderRadius: 100, width: '60%' }} />
      </div>
    </div>
  );
}

export default function WorkspaceEmptyState({ onCreateFromScratch, onUseTemplate, onSeeMore }) {
  const [libraryOpen, setLibraryOpen] = useState(false);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      fontFamily: font,
      gap: 24,
      overflowY: 'auto',
    }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <WorkspaceIllustration />
        <AiCardOverlay />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', flexShrink: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 400, lineHeight: '20px', color: '#212121', margin: 0, letterSpacing: '-0.28px' }}>
          Build your agent.{' '}
          <button
            onClick={onCreateFromScratch}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#1976d2', fontSize: 14, fontFamily: 'inherit', letterSpacing: '-0.28px', lineHeight: '20px' }}
          >
            Create from scratch
          </button>
        </p>

        <p style={{ fontSize: 14, color: '#212121', margin: 0, letterSpacing: '-0.28px', lineHeight: '20px' }}>or</p>

        <button
          onClick={() => setLibraryOpen((v) => !v)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#212121', fontSize: 14, fontFamily: 'inherit', letterSpacing: '-0.28px', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: 2 }}
        >
          Select from <span style={{ color: '#1976d2', marginLeft: 4 }}>library</span>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1976d2', lineHeight: 1, transition: 'transform 0.2s', transform: libraryOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
        </button>
      </div>

      {libraryOpen && (
        <div style={{ flexShrink: 0, width: '100%', maxWidth: 980 }}>
          <TemplateLibrary variant="see-more" onUseTemplate={onUseTemplate} onSeeMore={onSeeMore} />
        </div>
      )}
    </div>
  );
}
