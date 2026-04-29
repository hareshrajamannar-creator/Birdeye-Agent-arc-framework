import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import SingleSelect from '@birdeye/elemental/core/atoms/SingleSelect/index.js';
import RHSPanelHeader from '../../RHSHeader/RHSHeader';
import RHSPanelFooter from '../../RHSFooter/RHSFooter';

const font = '"Roboto", arial, sans-serif';

export function ScheduleBasedBody({
  triggerName = 'Run on schedule',
  description = 'Triggers the agent to generate posts based on your selected schedule',
  frequencyOptions = [],
  dayOptions = [],
  timeOptions = [],
  defaultFrequency,
  defaultDay,
  defaultTime,
  onFieldChange,
}) {
  const [localTriggerName, setLocalTriggerName] = useState(triggerName);
  const [localDescription, setLocalDescription] = useState(description);
  const [frequency, setFrequency] = useState(defaultFrequency ?? null);
  const [day, setDay] = useState(defaultDay ?? null);
  const [time, setTime] = useState(defaultTime ?? null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormInput
        name="triggerName"
        type="text"
        label="Trigger name"
        value={localTriggerName}
        onChange={(event) => {
          const value = event.target.value;
          setLocalTriggerName(value);
          onFieldChange?.('triggerName', value);
        }}
        required
      />
      <TextArea
        name="description"
        label="Description"
        value={localDescription}
        onChange={(event) => {
          const value = event.target.value;
          setLocalDescription(value);
          onFieldChange?.('description', value);
        }}
        required
        noFloatingLabel
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18 }}>
          <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', color: '#212121', fontFamily: font }}>Frequency</span>
          <span style={{ fontSize: 12, lineHeight: '18px', color: '#de1b0c', fontFamily: font }}>*</span>
        </div>
        <SingleSelect
          name="frequency"
          selected={frequency}
          options={frequencyOptions.map((opt) => ({ value: opt, label: opt }))}
          onChange={(opt) => {
            setFrequency(opt.value);
            onFieldChange?.('frequency', opt.value);
          }}
          placeholder="Select"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18 }}>
          <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', color: '#212121', fontFamily: font }}>Day</span>
          <span style={{ fontSize: 12, lineHeight: '18px', color: '#de1b0c', fontFamily: font }}>*</span>
        </div>
        <SingleSelect
          name="day"
          selected={day}
          options={dayOptions.map((opt) => ({ value: opt, label: opt }))}
          onChange={(opt) => {
            setDay(opt.value);
            onFieldChange?.('day', opt.value);
          }}
          placeholder="Select"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18 }}>
          <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', color: '#212121', fontFamily: font }}>Time</span>
          <span style={{ fontSize: 12, lineHeight: '18px', color: '#de1b0c', fontFamily: font }}>*</span>
        </div>
        <SingleSelect
          name="time"
          selected={time}
          options={timeOptions.map((opt) => ({ value: opt, label: opt }))}
          onChange={(opt) => {
            setTime(opt.value);
            onFieldChange?.('time', opt.value);
          }}
          placeholder="Select"
        />
      </div>
    </div>
  );
}

export default function ScheduleBased({
  onClose,
  onExpand,
  onPreview,
  onSave,
  frequencyOptions = [],
  dayOptions = [],
  timeOptions = [],
  triggerName = 'Run on schedule',
  description = 'Triggers the agent to generate posts based on your selected schedule',
  defaultFrequency,
  defaultDay,
  defaultTime,
  onFieldChange,
}) {
  const [localTriggerName, setLocalTriggerName] = useState(triggerName);
  const [localDescription, setLocalDescription] = useState(description);
  const [frequency, setFrequency] = useState(defaultFrequency ?? null);
  const [day, setDay] = useState(defaultDay ?? null);
  const [time, setTime] = useState(defaultTime ?? null);

  const handleFieldChange = (field, value) => {
    if (field === 'triggerName') setLocalTriggerName(value);
    if (field === 'description') setLocalDescription(value);
    if (field === 'frequency') setFrequency(value);
    if (field === 'day') setDay(value);
    if (field === 'time') setTime(value);
    onFieldChange?.(field, value);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', width: 390,
      height: '100%', background: '#ffffff', borderLeft: '1px solid #e5e9f0',
      fontFamily: font,
    }}>
      <RHSPanelHeader
        title="Schedule-based trigger"
        showActions
        onPreview={onPreview}
        onExpand={onExpand}
        onClose={onClose}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 15px', boxSizing: 'border-box' }}>
        <ScheduleBasedBody
          triggerName={localTriggerName}
          description={localDescription}
          frequencyOptions={frequencyOptions}
          dayOptions={dayOptions}
          timeOptions={timeOptions}
          defaultFrequency={frequency}
          defaultDay={day}
          defaultTime={time}
          onFieldChange={handleFieldChange}
        />
      </div>

      <RHSPanelFooter onSave={() => onSave?.({
        triggerName: localTriggerName,
        description: localDescription,
        frequency,
        day,
        time,
      })} />
    </div>
  );
}
