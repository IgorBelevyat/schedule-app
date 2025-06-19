const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// 📌 Отримати всі класи
app.get('/api/classes', async (req, res) => {
  const classes = await prisma.schoolClass.findMany();
  res.json(classes);
});

// 📌 Отримати розклад для класу на тиждень
app.get('/api/schedule', async (req, res) => {
  const { classId, week } = req.query;
  const schedule = await prisma.schedule.findMany({
    where: {
      classId: parseInt(classId),
      week: parseInt(week),
    },
  });
  res.json(schedule);
});

// 📌 Авторизація
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (admin && admin.password === password) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false });
});

// 📌 Додати клас
app.post('/api/admin/class', async (req, res) => {
  const { grade, name } = req.body;
  const created = await prisma.schoolClass.create({ data: { grade, name } });
  res.json(created);
});

// 📌 Додати урок
app.post('/api/admin/schedule', async (req, res) => {
  const { week, day, lessonNum, subject, room, groupCount, groups, classId } = req.body;
  const created = await prisma.schedule.create({
    data: {
      week,
      day,
      lessonNum,
      subject,
      room,
      groupCount,
      groups,
      classId,
    },
  });
  res.json(created);
});

// ✅ Старт сервера
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
