import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from '../screens/TaskListScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import i18n from '../i18n';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TaskList">
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: i18n.t('taskList') }} />
        <Stack.Screen
          name="TaskForm"
          component={TaskFormScreen}
          options={({ route }) => ({
            title: route.params?.task ? i18n.t('edit') : i18n.t('newTask'),
          })}
        />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: i18n.t('taskDetails') }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
