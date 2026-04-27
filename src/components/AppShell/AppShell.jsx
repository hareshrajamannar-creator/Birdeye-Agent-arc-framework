import React from 'react';
import PropTypes from 'prop-types';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import Avatar from '@birdeye/elemental/core/atoms/Avatar/index.js';
import Tooltip from '@birdeye/elemental/core/atoms/Tooltip/index.js';
import './AppShell.css';

const DEFAULT_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'inbox', label: 'Inbox', icon: 'sms' },
  { id: 'listings', label: 'Listings', icon: 'location_on' },
  { id: 'reviews', label: 'Reviews', icon: 'grade' },
  { id: 'referrals', label: 'Referrals', icon: 'featured_seasonal_and_gifts' },
  { id: 'payments', label: 'Payments', icon: 'monetization_on' },
  { id: 'appointments', label: 'Appointments', icon: 'calendar_month' },
  { id: 'social', label: 'Social', icon: 'workspaces' },
  { id: 'surveys', label: 'Surveys', icon: 'assignment_turned_in' },
  { id: 'ticketing', label: 'Ticketing', icon: 'shapes' },
  { id: 'contacts', label: 'Contacts', icon: 'group' },
  { id: 'campaigns', label: 'Campaigns', icon: 'campaign' },
  { id: 'reports', label: 'Reports', icon: 'pie_chart' },
  { id: 'insights', label: 'Insights', icon: 'lightbulb' },
  { id: 'competitors', label: 'Competitors', icon: 'leaderboard' },
];

function AppShell({
  appTitle = 'Listings AI',
  pageTitle = 'Listings scan agent  1',
  navItems = DEFAULT_NAV_ITEMS,
  activeNavId = 'listings',
  onNavChange,
  onBack,
  onPublish,
  publishDisabled = true,
  showBack = true,
  pageActions,
  avatarSrc,
  children,
}) {
  return (
    <div className="app-shell">
      {/* Primary Rail Nav */}
      <aside className="app-shell__rail">
        <div className="app-shell__rail-logo">
          <svg className="app-shell__rail-logo-img" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M13.3917 11.1779L13.3917 11.1777L13.3884 11.1764C13.3427 11.1566 13.2963 11.1382 13.2492 11.1213L8.4815 9.2361L8.4811 9.23678C8.35058 9.17904 8.20644 9.14634 8.05442 9.14634C7.47307 9.14634 7.00177 9.61526 7.00177 10.1937C7.00177 10.4328 7.08322 10.6524 7.21878 10.8287L7.21815 10.8294L7.22638 10.8388C7.25047 10.8694 7.27589 10.899 7.30322 10.9267L10.7214 14.834L10.7215 14.8339C11.1477 15.3122 11.7696 15.6141 12.4625 15.6141C13.7472 15.6141 14.7887 14.5779 14.7887 13.2997C14.7887 12.3502 14.2138 11.5348 13.3917 11.1779ZM11.8213 3.30004C12.9023 2.96157 14.0671 3.52057 14.423 4.54845C14.7789 5.57628 14.1911 6.68381 13.11 7.02232C12.0291 7.36065 10.8642 6.80165 10.5083 5.77387C10.1525 4.74594 10.7403 3.63836 11.8213 3.30004ZM19.3037 4.55494C19.1465 4.33349 18.918 4.19165 18.6698 4.12919L18.6696 4.12553L17.7376 3.88127C17.7241 3.83762 17.7153 3.79342 17.7006 3.74981C16.7328 0.88883 13.5653 -0.666909 10.6255 0.274993C9.10257 0.762827 7.94445 1.82742 7.31168 3.13598L5.62757 5.8118L1.63029 4.23472L1.62765 4.23765C1.37588 4.13542 1.08869 4.11296 0.809326 4.20242C0.191925 4.40034 -0.143909 5.04775 0.0593137 5.64877C0.0891145 5.73657 0.131345 5.81658 0.179153 5.89181L0.172205 5.8998L4.34266 11.42C4.34643 11.425 4.34829 11.4305 4.35205 11.4353C4.35577 11.4405 4.36067 11.4445 4.36463 11.4496L7.34833 15.6315C8.65209 17.9597 11.4727 19.3609 14.1956 18.4885C17.1352 17.5468 18.734 14.464 17.7661 11.603C17.4648 10.7126 16.9502 9.94884 16.2958 9.34724C17.1208 8.5594 17.6806 7.54286 17.8898 6.43972L18.7912 6.17934L18.7906 6.16949C18.8705 6.13933 18.9487 6.10284 19.0223 6.05338C19.5251 5.71523 19.6512 5.04444 19.3037 4.55494Z" fill="#1976D2"/>
          </svg>
        </div>

        <nav className="app-shell__rail-nav">
          {navItems.map((item) => (
            <Tooltip key={item.id} text={item.label} position="right" mouseOver hideOnScroll>
              <button
                className={`app-shell__rail-btn ${activeNavId === item.id ? 'app-shell__rail-btn--active' : ''}`}
                onClick={() => onNavChange?.(item.id)}
              >
                <span className="material-symbols-outlined app-shell__rail-icon">
                  {item.icon}
                </span>
              </button>
            </Tooltip>
          ))}

          <div className="app-shell__rail-divider" />

          <Tooltip text="Settings" position="right" mouseOver hideOnScroll>
            <button
              className="app-shell__rail-btn"
              onClick={() => onNavChange?.('settings')}
            >
              <span className="material-symbols-outlined app-shell__rail-icon">settings</span>
            </button>
          </Tooltip>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="app-shell__main">
        {/* Top Nav */}
        <div className="app-shell__topnav">
          <span className="app-shell__topnav-title">{appTitle}</span>
          <div className="app-shell__topnav-actions">
            <button className="app-shell__icon-btn">
              <span className="material-symbols-outlined app-shell__icon--filled-blue">add_circle</span>
            </button>
            <button className="app-shell__icon-btn">
              <span className="material-symbols-outlined app-shell__icon--outlined-dark">help</span>
            </button>
            <button className="app-shell__icon-btn app-shell__icon-btn--avatar">
              <Avatar
                alt="User"
                src={avatarSrc}
                size="extra-small"
                variant="circular"
              />
            </button>
            <button className="app-shell__icon-btn">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="app-shell__header">
          <div className="app-shell__header-left">
            {showBack && (
              <button className="app-shell__icon-btn" onClick={onBack}>
                <span className="material-symbols-outlined">arrow_left_alt</span>
              </button>
            )}
            <span className="app-shell__header-title">{pageTitle}</span>
          </div>
          <div className="app-shell__header-right">
            {pageActions != null ? pageActions : (
              <>
                <button className="app-shell__icon-btn">
                  <span className="material-symbols-outlined">backup</span>
                </button>
                <Button
                  theme="primary"
                  label="Publish"
                  disabled={publishDisabled}
                  onClick={onPublish}
                />
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}

AppShell.propTypes = {
  appTitle: PropTypes.string,
  pageTitle: PropTypes.string,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ),
  activeNavId: PropTypes.string,
  onNavChange: PropTypes.func,
  onBack: PropTypes.func,
  onPublish: PropTypes.func,
  publishDisabled: PropTypes.bool,
  showBack: PropTypes.bool,
  pageActions: PropTypes.node,
  avatarSrc: PropTypes.string,
  children: PropTypes.node,
};

export default AppShell;
