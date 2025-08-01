import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getTasks,
  saveTask as saveTaskService,
  updateTask as updateTaskService,
  updateTaskStatus as updateTaskStatusService,
  deleteTask as deleteTaskService,
  toggleTaskPinned as toggleTaskPinnedService,
} from '../services/storageService';

const TaskContext = createContext({
  tasks: [],
  loadTasks: () => {},
  addTask: () => {},
  updateTask: () => {},
  updateStatus: () => {},
  deleteTask: () => {},
  togglePin: () => {},
});

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (task) => {
    await saveTaskService(task);
    await loadTasks();
  };

  const updateTask = async (task) => {
    await updateTaskService(task);
    await loadTasks();
  };

  const updateStatus = async (id, status) => {
    await updateTaskStatusService(id, status);
    await loadTasks();
  };

  const deleteTask = async (id) => {
    await deleteTaskService(id);
    await loadTasks();
  };

  const togglePin = async (id) => {
    const res = await toggleTaskPinnedService(id);
    await loadTasks();
    return res;
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loadTasks, addTask, updateTask, updateStatus, deleteTask, togglePin }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
