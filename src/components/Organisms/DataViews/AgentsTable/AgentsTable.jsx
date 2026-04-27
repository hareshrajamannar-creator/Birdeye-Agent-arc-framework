import React from 'react';
import PropTypes from 'prop-types';
import TableContainer from '@birdeye/elemental/core/components/TableContainer/index.js';
import Chip from '@birdeye/elemental/core/atoms/Chip/index.js';

const STATUS_COLOR = {
  Running: 'green',
  Paused:  'yellow',
  Draft:   'grey',
};

function StatusCell({ status }) {
  return (
    <Chip
      label={status}
      colorType={STATUS_COLOR[status] || 'grey'}
      size="small"
    />
  );
}

function LocationCell({ count }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 13, color: '#212121' }}>{count}</span>
      <span
        className="material-symbols-outlined"
        style={{
          fontFamily: "'Material Symbols Outlined'",
          fontStyle: 'normal',
          fontSize: 16,
          color: '#555',
          lineHeight: 1,
          fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20",
        }}
      >
        expand_more
      </span>
    </span>
  );
}

const DEFAULT_AGENTS = [
  { id: 1, name: 'Review response agent replying autonomously - North Region', status: 'Running',  reviewsResponded: 102, responseRate: '15%', avgResponseTime: '20m', timeSaved: '4h 20m', locations: 500 },
  { id: 2, name: 'Review response agent replying autonomously - East Region',  status: 'Running',  reviewsResponded: 98,  responseRate: '9%',  avgResponseTime: '5m',  timeSaved: '1h 10m', locations: 250 },
  { id: 3, name: 'Review response agent replying autonomously - South Region', status: 'Paused',   reviewsResponded: 53,  responseRate: '9%',  avgResponseTime: '10m', timeSaved: '45m',    locations: 200 },
  { id: 4, name: 'Review response agent replying autonomously - West Region',  status: 'Draft',    reviewsResponded: 35,  responseRate: '8%',  avgResponseTime: '2m',  timeSaved: '3h 20m', locations: 100 },
];

const COLUMNS = [
  { value: 'name',            tableHead: 'Agent name',            enabled: true, width: 320, enableSorting: true, align: 'left' },
  { value: 'status',          tableHead: 'Status',                enabled: true, width: 110, enableSorting: true, align: 'left' },
  { value: 'reviewsResponded',tableHead: 'Reviews responded',     enabled: true, width: 160, enableSorting: true, align: 'left' },
  { value: 'responseRate',    tableHead: 'Response rate',         enabled: true, width: 130, enableSorting: true, align: 'left' },
  { value: 'avgResponseTime', tableHead: 'Average response time', enabled: true, width: 170, enableSorting: true, align: 'left' },
  { value: 'timeSaved',       tableHead: 'Time saved',            enabled: true, width: 120, enableSorting: true, align: 'left' },
  { value: 'locations',       tableHead: 'Locations',             enabled: true, width: 110, enableSorting: true, align: 'left' },
];

function buildTableData(agents) {
  return {
    type: 'allColumns',
    tableId: 'agents-table',
    tableHead: { columns: COLUMNS },
    tableRow: agents.map(agent => ({
      rowsData: [
        { rowValue: agent.name },
        { rowValue: React.createElement(StatusCell, { status: agent.status }) },
        { rowValue: String(agent.reviewsResponded) },
        { rowValue: agent.responseRate },
        { rowValue: agent.avgResponseTime },
        { rowValue: agent.timeSaved },
        { rowValue: React.createElement(LocationCell, { count: agent.locations }) },
      ],
    })),
  };
}

export default function AgentsTable({ agents = DEFAULT_AGENTS }) {
  const tableData = buildTableData(agents);

  return (
    <div style={{ background: '#fff' }}>
      <TableContainer tableData={tableData} />
    </div>
  );
}

AgentsTable.propTypes = {
  agents: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['Running', 'Paused', 'Draft']),
    reviewsResponded: PropTypes.number,
    responseRate: PropTypes.string,
    avgResponseTime: PropTypes.string,
    timeSaved: PropTypes.string,
    locations: PropTypes.number,
  })),
};
