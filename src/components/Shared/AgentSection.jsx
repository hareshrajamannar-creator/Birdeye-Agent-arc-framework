import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import TableContainer from '@birdeye/elemental/core/components/TableContainer/index.js';
import Chip from '@birdeye/elemental/core/atoms/Chip/index.js';
import EmptyWorkspace from '../Organisms/EmptyWorkspace/EmptyWorkspace';

const font = '"Roboto", sans-serif';

const STATUS_COLOR = {
  Running: 'green',
  Paused:  'yellow',
  Draft:   'grey',
};

const DEFAULT_AGENTS = [
  { id: 1, name: 'Review response agent - North Region', status: 'Running', lastRun: '2 hours ago'  },
  { id: 2, name: 'Review response agent - East Region',  status: 'Running', lastRun: '5 hours ago'  },
  { id: 3, name: 'Review response agent - South Region', status: 'Paused',  lastRun: '1 day ago'    },
  { id: 4, name: 'Review response agent - West Region',  status: 'Draft',   lastRun: 'Never'        },
];

const COLUMNS = [
  { value: 'name',    tableHead: 'Agent name', enabled: true, enableSorting: true,  align: 'left'             },
  { value: 'status',  tableHead: 'Status',     enabled: true, enableSorting: true,  align: 'left', width: 120 },
  { value: 'lastRun', tableHead: 'Last run',   enabled: true, enableSorting: true,  align: 'left', width: 160 },
  { value: 'open',    tableHead: '',           enabled: true, enableSorting: false, align: 'left', width: 80  },
  { value: 'export',  tableHead: '',           enabled: true, enableSorting: false, align: 'left', width: 100 },
];

function buildTableData(agents, onOpenAgent, onExportAgent) {
  return {
    type: 'allColumns',
    tableId: 'agent-section-table',
    tableHead: { columns: COLUMNS },
    tableRow: agents.map(agent => ({
      rowsData: [
        { rowValue: agent.name },
        {
          rowValue: React.createElement(Chip, {
            label: agent.status,
            colorType: STATUS_COLOR[agent.status] || 'grey',
            size: 'small',
          }),
        },
        { rowValue: agent.lastRun || '—' },
        {
          rowValue: React.createElement(Button, {
            theme: 'secondary',
            label: 'Open',
            size: 'small',
            onClick: () => onOpenAgent?.(agent.id),
          }),
        },
        {
          rowValue: React.createElement(Button, {
            theme: 'noBorder',
            label: 'Export',
            size: 'small',
            customIcon: React.createElement(
              'span',
              { className: 'material-symbols-outlined', style: { fontSize: 16 } },
              'download'
            ),
            onClick: () => onExportAgent?.(agent),
          }),
        },
      ],
    })),
  };
}

// ─── AgentSection ─────────────────────────────────────────────────────────────

export default function AgentSection({
  moduleName = 'Module',
  agents = DEFAULT_AGENTS,
  onCreateAgent,
  onOpenAgent,
  onExportAgent,
  onImportAgent,
}) {
  const importInputRef = useRef(null);

  function handleImportClick() {
    importInputRef.current?.click();
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        onImportAgent?.(data);
      } catch {
        // invalid JSON — silently ignore
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be re-imported later
    e.target.value = '';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font }}>

      {/* Header row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 64,
        flexShrink: 0,
        borderBottom: '1px solid #e9e9eb',
      }}>
        <span style={{
          fontSize: 18,
          fontWeight: 400,
          lineHeight: '26px',
          letterSpacing: '-0.36px',
          color: '#212121',
        }}>
          {moduleName} Agents
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Hidden file input for import */}
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
          <Button
            theme="secondary"
            label="Import"
            customIcon={
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span>
            }
            onClick={handleImportClick}
          />
          <Button theme="primary" label="Create agent" onClick={onCreateAgent} />
        </div>
      </div>

      {/* Content — empty state or table */}
      <div style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
        {agents.length === 0
          ? (
            <EmptyWorkspace onCreateFromScratch={onCreateAgent} />
          )
          : (
            <div style={{ padding: '20px 24px 24px' }}>
              <TableContainer
                tableData={buildTableData(agents, onOpenAgent, onExportAgent)}
              />
            </div>
          )
        }
      </div>

    </div>
  );
}

AgentSection.propTypes = {
  moduleName:    PropTypes.string,
  agents:        PropTypes.arrayOf(PropTypes.shape({
    id:      PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name:    PropTypes.string.isRequired,
    status:  PropTypes.oneOf(['Running', 'Paused', 'Draft']),
    lastRun: PropTypes.string,
  })),
  onCreateAgent: PropTypes.func,
  onOpenAgent:   PropTypes.func,
  onExportAgent: PropTypes.func,
  onImportAgent: PropTypes.func,
};
