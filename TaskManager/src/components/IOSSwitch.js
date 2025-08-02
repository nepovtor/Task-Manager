import React from 'react';
import { StyleSheet } from 'react-native';
import Switch from 'react-native-switch';

const IOSSwitch = ({ value, onValueChange, style, ...props }) => (
  <Switch
    value={value}
    onValueChange={onValueChange}
    backgroundActive="#4A90E2"
    backgroundInactive="#B0B0B0"
    circleActiveColor="#ffffff"
    circleInActiveColor="#ffffff"
    renderActiveText={false}
    renderInActiveText={false}
    barHeight={26}
    circleSize={30}
    switchLeftPx={2}
    switchRightPx={2}
    switchWidthMultiplier={2}
    innerCircleStyle={styles.innerCircle}
    style={style}
    {...props}
  />
);

const styles = StyleSheet.create({
  innerCircle: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
  },
});

export default IOSSwitch;
