import { useState } from 'react';
import SecondaryRailNav from './SecondaryRailNav';

export default {
  title: 'Agent Builder/Molecules/Navigation/SecondaryRailNav',
  component: SecondaryRailNav,
};

export const Default = {
  render: (args) => {
    const [activeItemId, setActiveItemId] = useState('review-generation');
    return (
      <div style={{ height: 600, display: 'flex' }}>
        <SecondaryRailNav {...args} activeItemId={activeItemId} onItemClick={setActiveItemId} />
      </div>
    );
  },
  args: {
    title: 'ReviewsAI',
    ctaLabel: 'Send a review request',
  },
};
