import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';

const TaskItem = ({ task, onToggle }) => {
  return (
    <View style={styles.container}>
      <Checkbox
        status={task.completed ? 'checked' : 'unchecked'}
        onPress={() => onToggle(task.id)}
      />
      <Text style={styles.text}>{task.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    fontSize: 16,
  },
});

export default TaskItem;
