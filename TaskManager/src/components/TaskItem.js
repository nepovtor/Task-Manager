import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import styles from '../styles/styles';

// navigation should be handled by the parent component. This component accepts
// an onPress callback so that it can be reused in different contexts.
const statusIcon = (status) => {
  switch (status) {
    case 'Завершена':
      return 'check-circle-outline';
    case 'Отменена':
      return 'close-circle-outline';
    default:
      return 'progress-clock';
  }
};

const TaskItem = ({ task, onPress, onToggle }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View>
      <Text style={styles.title}>{task.title}</Text>
      <Text>{task.date}</Text>
      <Text>{task.category}</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <IconButton icon={statusIcon(task.status)} size={24} />
      <IconButton icon="autorenew" onPress={onToggle} size={24} />
    </View>
  </TouchableOpacity>
);

export default TaskItem;
