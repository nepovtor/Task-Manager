import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/styles';

const TaskDetailScreen = ({ route }) => {
  const { task } = route.params || {};
  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Задача не найдена.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text>Дата: {task.date}</Text>
      <Text>Статус: {task.status}</Text>
    </View>
  );
};

export default TaskDetailScreen;