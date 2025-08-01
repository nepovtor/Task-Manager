import React from 'react';
import { View, Text } from 'react-native';
import { Card, IconButton, Badge } from 'react-native-paper';
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

const statusColor = (status) => {
  switch (status) {
    case 'Завершена':
      return 'green';
    case 'Отменена':
      return 'red';
    default:
      return 'orange';
  }
};

const badgeColor = (status) => {
  switch (status) {
    case 'Завершена':
      return 'green';
    case 'Отменена':
      return 'red';
    default:
      return 'blue';
  }
};

const TaskItem = ({ task, onPress, onToggle }) => (
  <Card style={styles.item} onPress={onPress}>
    <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View>
        <Text style={styles.title}>{task.title}</Text>
        <Text>{task.date}</Text>
        <Text>{task.category}</Text>
        <Badge style={{ backgroundColor: badgeColor(task.status), alignSelf: 'flex-start', marginTop: 4 }}>
          {task.status}
        </Badge>
      </View>
      <View style={{ alignItems: 'center' }}>
        {task.notificationId && <IconButton icon="bell" size={20} />}
        <IconButton icon={statusIcon(task.status)} iconColor={statusColor(task.status)} size={20} />
        <IconButton icon={task.pinned ? 'pin' : 'pin-outline'} onPress={onToggle} size={20} />
      </View>
    </Card.Content>
  </Card>
);

export default TaskItem;
