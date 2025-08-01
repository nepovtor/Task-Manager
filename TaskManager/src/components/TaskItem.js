import React from 'react';
import { TouchableOpacity, View, Text, Button } from 'react-native';
import styles from '../styles/styles';

const TaskItem = ({ task, navigation, onToggle }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={() => navigation.navigate('TaskDetail', { task })}
  >
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
