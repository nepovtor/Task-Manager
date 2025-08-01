import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getTasks,
  saveTasksList,
} from '../services/storageService';
import { cancelTaskNotification } from '../services/notificationService';

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
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    saveTasksList(newTasks);
  };

  const updateTask = async (task) => {
    const newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(newTasks);
    saveTasksList(newTasks);
  };

  const updateStatus = async (id, status) => {
    const newTasks = tasks.map((t) =>
      t.id === id ? { ...t, status } : t
    );
    setTasks(newTasks);
    saveTasksList(newTasks);
  };

  const deleteTask = async (id) => {
    const deleted = tasks.find((t) => t.id === id);
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasks(newTasks);
    if (deleted?.notificationId) {
      cancelTaskNotification(deleted.notificationId);
    }
    saveTasksList(newTasks);
  };

  const togglePin = async (id) => {
    const newTasks = tasks.map((t) =>
      t.id === id ? { ...t, pinned: !t.pinned } : t
    );
    const updated = newTasks.find((t) => t.id === id);
    setTasks(newTasks);
    saveTasksList(newTasks);
    return updated;
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
