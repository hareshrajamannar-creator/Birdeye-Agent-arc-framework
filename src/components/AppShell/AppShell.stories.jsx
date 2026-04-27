import React, { useState } from 'react';
import AppShell from './AppShell';

export default {
  title: 'Agent Builder/Modules/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = () => {
  const [activeNav, setActiveNav] = useState('listings');
  return (
    <AppShell
      appTitle="Listings AI"
      pageTitle="Listings scan agent  1"
      activeNavId={activeNav}
      onNavChange={setActiveNav}
      onBack={() => alert('Back clicked')}
      publishDisabled
    />
  );
};
