import React from 'react';
import { View } from 'react-native';
import { Card, IconButton, Avatar, Text, Badge } from 'react-native-paper';
import styles from '../styles/styles';
import formatDate from '../utils/formatDate';

// navigation should be handled by the parent component. This component accepts
// an onPress callback so that it can be reused in different contexts.
const statusColor = (status) => {
  switch (status) {
    case 'Завершена':
      return '#81C784';
    case 'Отменена':
      return '#BDBDBD';
    default:
      return '#64B5F6';
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

const TaskItem = ({ task, onPress, onToggle, onLongPress }) => {
  const overdue = new Date(task.date) < new Date() && task.status === 'В процессе';
  return (
    <Card style={styles.item} onPress={onPress} onLongPress={onLongPress} mode="elevated">
      <Card.Content
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 0 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Avatar.Icon size={24} icon={categoryIcon(task.category)} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
              <Text style={styles.title}>{task.title}</Text>
              <Badge
                style={{
                  backgroundColor: statusColor(task.status),
                  color: '#FFFFFF',
                  marginLeft: 4,
                }}
              >
                {task.status}
              </Badge>
              {overdue && (
                <Badge
                  style={{
                    backgroundColor: '#E57373',
                    color: '#FFFFFF',
                    marginLeft: 4,
                  }}
                >
                  Просрочено
                </Badge>
              )}
            </View>
            <Text style={styles.secondary}>{formatDate(task.date)}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {task.notificationId && <IconButton icon="bell" size={18} />}
          <IconButton icon={task.pinned ? 'pin' : 'pin-outline'} onPress={onToggle} size={18} />
        </View>
      </Card.Content>
    </Card>
  );
};

export default TaskItem;
