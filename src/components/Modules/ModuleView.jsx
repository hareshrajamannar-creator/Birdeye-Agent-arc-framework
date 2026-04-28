import React from 'react';
import PropTypes from 'prop-types';
import AgentsDashboardTemplate from '../Templates/AgentsDashboardTemplate/AgentsDashboardTemplate';
import { getModuleTemplates } from './agentFrameworkData';
import { getModuleNav } from './moduleNavigation';

export default function ModuleView({
  moduleId,
  agents = [],
  onCreateAgent,
}) {
  const moduleNav = getModuleNav(moduleId);
  const templates = getModuleTemplates(moduleId);

  return (
    <AgentsDashboardTemplate
      navTitle={moduleNav.title}
      ctaLabel={moduleNav.ctaLabel}
      menuItems={moduleNav.menuItems}
      pageTitle={moduleNav.menuItems[1]?.children?.[0]?.label || 'View all agents'}
      activeNavId={moduleId}
      activeMenuItemId={moduleNav.defaultItemId}
      agents={agents}
      templates={templates}
      onCreateAgent={onCreateAgent}
      onUseTemplate={onCreateAgent}
    />
  );
}

ModuleView.propTypes = {
  moduleId: PropTypes.string.isRequired,
  agents: PropTypes.array,
  onCreateAgent: PropTypes.func,
};
