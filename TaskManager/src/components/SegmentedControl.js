import React from 'react';
import { SegmentedButtons } from 'react-native-paper';

const ACCENT = '#4A90E2';

const SegmentedControl = ({ value, onValueChange, buttons, style }) => {
  const mapped = buttons.map((b) => ({
    ...b,
    style: [
      { flex: 1, borderRadius: 0 },
      b.style,
      value === b.value
        ? { backgroundColor: ACCENT }
        : { backgroundColor: '#3a3a3a' },
    ],
    labelStyle: [
      value === b.value ? { color: '#fff' } : { color: '#888' },
      b.labelStyle,
    ],
  }));
  return (
    <SegmentedButtons
      value={value}
      onValueChange={onValueChange}
      buttons={mapped}
      style={[{ borderRadius: 8, overflow: 'hidden' }, style]}
    />
  );
};

export default SegmentedControl;
