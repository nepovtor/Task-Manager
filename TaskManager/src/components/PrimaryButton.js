import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const PrimaryButton = ({ style, contentStyle, labelStyle, ...props }) => (
  <Button
    mode="contained"
    style={[styles.button, style]}
    contentStyle={[styles.content, contentStyle]}
    labelStyle={[styles.label, labelStyle]}
    {...props}
  />
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    backgroundColor: '#4A90E2',
  },
  content: {
    height: 48,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default PrimaryButton;
