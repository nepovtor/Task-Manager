import React from 'react';
import { Card, Text } from 'react-native-paper';

const TaskWidget = ({ tasks }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter((t) => t.date.startsWith(today));

  return (
    <Card mode="outlined" style={{ margin: 8 }}>
      <Card.Title title="Задачи на сегодня" />
      <Card.Content>
        {todaysTasks.length === 0 && <Text>Нет задач</Text>}
        {todaysTasks.map((t) => (
          <Text key={t.id}>{t.title}</Text>
        ))}
      </Card.Content>
    </Card>
  );
};

export default TaskWidget;
