import AddInputFieldModal from './AddInputFieldModal';

export default {
  title: 'Agent Builder/Organisms/Modals/AddInputFieldModal',
  component: AddInputFieldModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: true },
    },
  },
};

export const Default = {
  args: {
    onClose: () => {},
    onAdd: () => {},
  },
};
