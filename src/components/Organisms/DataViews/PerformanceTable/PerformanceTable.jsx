import React from 'react';
import PropTypes from 'prop-types';
import TableContainer from '@birdeye/elemental/core/components/TableContainer/index.js';

const COLUMNS = [
  { value: 'location',        tableHead: 'Location',              enabled: true, width: 350, enableSorting: true, align: 'left' },
  { value: 'reviewsResponded',tableHead: 'Reviews responded',     enabled: true, width: 230, enableSorting: true, align: 'left' },
  { value: 'responseRate',    tableHead: 'Response rate',         enabled: true, width: 230, enableSorting: true, align: 'left' },
  { value: 'avgResponseTime', tableHead: 'Average response time', enabled: true, width: 230, enableSorting: true, align: 'left' },
  { value: 'timeSaved',       tableHead: 'Time saved',            enabled: true, width: 230, enableSorting: true, align: 'left' },
];

const DEFAULT_ROWS = [
  { location: 'Atlanta, GA',       reviewsResponded: 19, responseRate: '90%', avgResponseTime: '1h 48m', timeSaved: '4h 20m' },
  { location: 'Stamford, CT',      reviewsResponded: 9,  responseRate: '92%', avgResponseTime: '2h 05m', timeSaved: '2h 10m' },
  { location: 'Los Angeles, CA',   reviewsResponded: 22, responseRate: '90%', avgResponseTime: '2h 22m', timeSaved: '2h 05m' },
  { location: 'New York City, NY', reviewsResponded: 18, responseRate: '90%', avgResponseTime: '2h 10m', timeSaved: '2h 40m' },
  { location: 'San Diego, CA',     reviewsResponded: 7,  responseRate: '95%', avgResponseTime: '2h 40m', timeSaved: '3h 05m' },
  { location: 'Las Vegas, NV',     reviewsResponded: 3,  responseRate: '94%', avgResponseTime: '3h 05m', timeSaved: '2h 10m' },
  { location: 'Chicago, IL',       reviewsResponded: 10, responseRate: '92%', avgResponseTime: '3h 05m', timeSaved: '3h 05m' },
];

function buildTableData(rows) {
  return {
    type: 'allColumns',
    tableId: 'performance-table',
    tableHead: { columns: COLUMNS },
    tableRow: rows.map(row => ({
      rowsData: [
        { rowValue: row.location },
        { rowValue: String(row.reviewsResponded) },
        { rowValue: row.responseRate },
        { rowValue: row.avgResponseTime },
        { rowValue: row.timeSaved },
      ],
    })),
  };
}

export default function PerformanceTable({ rows = DEFAULT_ROWS }) {
  return (
    <div style={{ background: '#fff' }}>
      <TableContainer tableData={buildTableData(rows)} />
    </div>
  );
}

PerformanceTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    location:        PropTypes.string.isRequired,
    reviewsResponded:PropTypes.number,
    responseRate:    PropTypes.string,
    avgResponseTime: PropTypes.string,
    timeSaved:       PropTypes.string,
  })),
};
