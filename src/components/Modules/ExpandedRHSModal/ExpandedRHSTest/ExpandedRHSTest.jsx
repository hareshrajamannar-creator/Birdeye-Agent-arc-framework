import React, { useState } from 'react';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import ExpandedRHSTestInput from '../../../Molecules/ExpandedRHS/ExpandedRHSTestInput/ExpandedRHSTestInput';
import ExpandedRHSTestOutput from '../../../Molecules/ExpandedRHS/ExpandedRHSTestOutput/ExpandedRHSTestOutput';
import ExpandedRHSTestFeedback from '../../../Molecules/ExpandedRHS/ExpandedRHSTestFeedback/ExpandedRHSTestFeedback';

const font = '"Roboto", arial, sans-serif';

function Illustration() {
  return (
    <div style={{ position: 'relative', width: 238, height: 253, flexShrink: 0 }}>
      {/* Background blob */}
      <div style={{
        position: 'absolute',
        left: 10.5,
        top: -50,
        width: 218,
        height: 183,
        background: '#ebeff6',
        borderRadius: '24px 4px 24px 4px',
        overflow: 'hidden',
      }}>
        {/* White card */}
        <div style={{
          position: 'absolute',
          left: 25,
          top: 29,
          width: 168,
          background: '#ffffff',
          borderRadius: 6,
          padding: '20px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          {/* Top bar */}
          <div style={{ height: 4, width: 37, background: '#ecf5fd', borderRadius: 100 }} />
          {/* Row 1 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3.2,
            background: '#ecf5fd', borderRadius: 3.3, padding: 6.5,
          }}>
            <div style={{ width: 13.2, height: 13.2, background: '#d1e5f9', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4.3 }}>
              <div style={{ height: 4.3, background: '#d1e5f9', borderRadius: 5.7 }} />
              <div style={{ height: 4.3, width: 37.8, background: '#d1e5f9', borderRadius: 5.7 }} />
            </div>
          </div>
          {/* Row 2 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3.2,
            background: '#ecf5fd', borderRadius: 3.3, padding: 6.5,
          }}>
            <div style={{ width: 13.2, height: 13.2, background: '#d1e5f9', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4.3 }}>
              <div style={{ height: 4.3, background: '#d1e5f9', borderRadius: 5.7 }} />
              <div style={{ height: 4.3, width: 37.8, background: '#d1e5f9', borderRadius: 5.7 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Text + button */}
      <div style={{
        position: 'absolute',
        top: 149,
        left: 8,
        width: 223,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 400, lineHeight: '20px', letterSpacing: '-0.28px', color: '#212121', fontFamily: font }}>
          Your preview will appear here
        </p>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: '#555555', fontFamily: font }}>
          Run task to generate preview
        </p>
      </div>
    </div>
  );
}

export default function ExpandedRHSTest({
  inputFields = [],
  outputFields = [],
  onRun,
  onMenuOpen,
  defaultRun = false,
}) {
  const [hasRun, setHasRun] = useState(defaultRun);
  const [feedback, setFeedback] = useState('');

  const handleRun = () => {
    setHasRun(true);
    onRun?.();
  };

  if (!hasRun) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: '#fafafa',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}>
        <Illustration />
        <Button type="secondary" label="Run task" icon="play_arrow" iconPosition="left" onClick={handleRun} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      {inputFields.length > 0 && (
        <ExpandedRHSTestInput
          fields={inputFields}
          onMenuOpen={onMenuOpen}
        />
      )}
      {outputFields.length > 0 && (
        <ExpandedRHSTestOutput
          rows={outputFields}
          onMenuOpen={onMenuOpen}
        />
      )}
      <ExpandedRHSTestFeedback
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        onSubmit={() => onRun?.()}
      />
    </div>
  );
}
