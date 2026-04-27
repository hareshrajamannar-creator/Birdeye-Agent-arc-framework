import React, { useState } from 'react';
import AppShell from '../../AppShell/AppShell';
import LHSDrawer from '../../LHSDrawer/LHSDrawer';
import EmptyWorkspace from '../../Modules/FlowCanvas/WorkspaceEmptyState/WorkspaceEmptyState';

export default function EmptyWorkspaceTemplate({
  appTitle = 'Reviews AI',
  pageTitle = 'Review response agent  1',
  activeNavId = 'reviews',
  onCreateFromScratch,
  onUseTemplate,
  onSeeMore,
}) {
  const [activeNav, setActiveNav] = useState(activeNavId);

  return (
    <AppShell
      appTitle={appTitle}
      pageTitle={pageTitle}
      activeNavId={activeNav}
      onNavChange={setActiveNav}
      publishDisabled
    >
      <div style={{ display: 'flex', height: '100%', padding: '8px 0 8px 8px' }}>
        <LHSDrawer />
        <EmptyWorkspace
          onCreateFromScratch={onCreateFromScratch}
          onUseTemplate={onUseTemplate}
          onSeeMore={onSeeMore}
        />
      </div>
    </AppShell>
  );
}
