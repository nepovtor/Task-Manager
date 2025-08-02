import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const OutlineButton = ({ style, contentStyle, labelStyle, ...props }) => (
  <Button
    mode="outlined"
    style={[styles.button, style]}
    contentStyle={[styles.content, contentStyle]}
    labelStyle={[styles.label, labelStyle]}
    textColor="#4A90E2"
    {...props}
  />
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    borderColor: '#4A90E2',
  },
  content: {
    height: 48,
  },
  label: {
    fontWeight: '600',
  },
});

export default OutlineButton;
