import React from 'react';
import { TouchableOpacity, View, Text, Button } from 'react-native';
import styles from '../styles/styles';

// navigation should be handled by the parent component. This component accepts
// an onPress callback so that it can be reused in different contexts.
const TaskItem = ({ task, onPress, onToggle }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View>
      <Text style={styles.title}>{task.title}</Text>
      <Text>{task.date}</Text>
      <Text>{task.category}</Text>
      <Text>{task.status}</Text>
    </View>
    <Button title="Сменить статус" onPress={onToggle} />
  </TouchableOpacity>
);

export default TaskItem;
