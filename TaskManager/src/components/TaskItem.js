import React from 'react';
import { View } from 'react-native';
import { Card, IconButton, Badge, Avatar, Text } from 'react-native-paper';
import styles from '../styles/styles';
import formatDate from '../utils/formatDate';

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
      return 'gray';
    default:
      return 'blue';
  }
};

const badgeColor = (status) => {
  switch (status) {
    case 'Завершена':
      return 'green';
    case 'Отменена':
      return 'gray';
    default:
      return 'blue';
  }
};

const categoryIcon = (category) => {
  switch (category) {
    case 'Работа':
      return 'briefcase';
    case 'Учёба':
      return 'school';
    default:
      return 'account';
  }
};

const TaskItem = ({ task, onPress, onToggle, onLongPress }) => (
  <Card style={styles.item} onPress={onPress} onLongPress={onLongPress} mode="outlined">
    <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar.Icon size={32} icon={categoryIcon(task.category)} style={{ marginRight: 8 }} />
        <View>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.secondary}>{formatDate(task.date)}</Text>
          <Text style={styles.secondary}>{task.category}</Text>
          <Badge style={{ backgroundColor: badgeColor(task.status), alignSelf: 'flex-start', marginTop: 4 }}>
            {task.status}
          </Badge>
        </View>
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
