import React from 'react';

const font = '"Roboto", sans-serif';

export default function MetricCard({
  value,
  title,
  showTrend = false,
  trend = '',
  trendPositive = true,
  showConfig = false,
  onConfig,
  dollarValue,
}) {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      padding: 16,
      border: '1px solid #eaeaea',
      borderRadius: 4,
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: font,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingRight: showConfig ? 44 : 0 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
          <span style={{
            minWidth: 0,
            fontSize: 24,
            fontWeight: 400,
            lineHeight: '36px',
            letterSpacing: '-0.48px',
            color: '#212121',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {value}
          </span>
          {showTrend && trend && (
            <span style={{
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 400,
              lineHeight: '18px',
              color: trendPositive ? '#4eac5d' : '#e53935',
            }}>
              {trend}
            </span>
          )}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, maxWidth: '100%', minWidth: 0 }}>
          <span style={{
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.32px',
            color: '#212121',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 16, color: '#757575', lineHeight: 1, flexShrink: 0 }}
          >
            info
          </span>
          {dollarValue && (
            <span style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 8px',
              background: '#f1faf0',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 400,
              lineHeight: '18px',
              color: '#377e2c',
              whiteSpace: 'nowrap',
            }}>
              {dollarValue}
            </span>
          )}
        </div>
      </div>

      {showConfig && (
        <button
          onClick={onConfig}
          style={{
            position: 'absolute',
            top: 11,
            right: 16,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #eaeaea',
            borderRadius: 4,
            background: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#555', lineHeight: 1 }}>
            tune
          </span>
        </button>
      )}
    </div>
  );
}
