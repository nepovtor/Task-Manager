import React from 'react';
import { Switch } from 'react-native';

const IOSSwitch = ({ value, onValueChange, ...props }) => (
  <Switch
    value={value}
    onValueChange={onValueChange}
    trackColor={{ false: '#767577', true: '#4A90E2' }}
    thumbColor={value ? '#ffffff' : '#f4f3f4'}
    ios_backgroundColor="#3e3e3e"
    {...props}
  />
);

export default IOSSwitch;
