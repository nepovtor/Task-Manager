const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(TASKS_FILE);
  } catch (error) {
    await fs.writeFile(TASKS_FILE, '[]');
  }
}

async function readTasks() {
  await ensureStore();
  const raw = await fs.readFile(TASKS_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Ошибка чтения файла задач, сброс', error);
    await fs.writeFile(TASKS_FILE, '[]');
    return [];
  }
}

async function writeTasks(tasks) {
  await ensureStore();
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function withDefaults(task) {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    title: task.title?.trim() ?? 'Без названия',
    description: task.description ?? '',
    status: task.status ?? 'pending',
    priority: task.priority ?? 'medium',
    dueDate: task.dueDate ?? null,
    subtasks: task.subtasks ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

async function listTasks() {
  return readTasks();
}

async function findTask(id) {
  const tasks = await readTasks();
  return tasks.find((task) => task.id === id) ?? null;
}

async function createTask(task) {
  const tasks = await readTasks();
  const newTask = withDefaults(task);
  tasks.push(newTask);
  await writeTasks(tasks);
  return newTask;
}

async function updateTask(id, updates) {
  const tasks = await readTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;

  const updatedTask = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  tasks[index] = updatedTask;
  await writeTasks(tasks);
  return updatedTask;
}

async function updateTaskStatus(id, status) {
  return updateTask(id, { status });
}

async function deleteTask(id) {
  const tasks = await readTasks();
  const filtered = tasks.filter((task) => task.id !== id);
  if (filtered.length === tasks.length) return false;
  await writeTasks(filtered);
  return true;
}

module.exports = {
  listTasks,
  findTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
