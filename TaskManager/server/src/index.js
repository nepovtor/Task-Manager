const express = require('express');
const cors = require('cors');
const {
  listTasks,
  findTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('./taskStore');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', async (_req, res) => {
  const tasks = await listTasks();
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const task = await findTask(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Задача не найдена' });
  }
  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const { title, description, status, priority, dueDate, subtasks } = req.body ?? {};
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'Название задачи обязательно' });
  }

  const task = await createTask({ title, description, status, priority, dueDate, subtasks });
  res.status(201).json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const { title, description, status, priority, dueDate, subtasks } = req.body ?? {};
  if (title && typeof title !== 'string') {
    return res.status(400).json({ message: 'Название задачи должно быть строкой' });
  }

  const updated = await updateTask(req.params.id, {
    ...(title ? { title: title.trim() } : {}),
    description,
    status,
    priority,
    dueDate,
    subtasks,
  });

  if (!updated) {
    return res.status(404).json({ message: 'Задача не найдена' });
  }

  res.json(updated);
});

app.patch('/tasks/:id/status', async (req, res) => {
  const { status } = req.body ?? {};
  if (!status) {
    return res.status(400).json({ message: 'Новый статус обязателен' });
  }
  const updated = await updateTaskStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ message: 'Задача не найдена' });
  }
  res.json(updated);
});

app.delete('/tasks/:id', async (req, res) => {
  const removed = await deleteTask(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: 'Задача не найдена' });
  }
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Task Manager API запущен на порте ${PORT}`);
});
