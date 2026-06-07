const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB连接成功'))
  .catch(err => console.error('MongoDB连接失败:', err));

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
  res.json({ message: '数据分析学习网站后端服务' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});