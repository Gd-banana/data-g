const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Progress = require('../models/Progress');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未授权' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: '无效的token' });
  }
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.userId });
    
    if (!progress) {
      progress = new Progress({ userId: req.userId });
      await progress.save();
    }
    
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: '服务器错误', error: err.message });
  }
});

router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { projectId, completed, score } = req.body;
    
    let progress = await Progress.findOne({ userId: req.userId });
    
    if (!progress) {
      progress = new Progress({ userId: req.userId });
    }
    
    const projectIndex = progress.projectProgress.findIndex(p => p.projectId === projectId);
    
    if (projectIndex !== -1) {
      progress.projectProgress[projectIndex] = {
        projectId,
        completed,
        score,
        completedAt: completed ? Date.now() : undefined
      };
    } else {
      progress.projectProgress.push({
        projectId,
        completed,
        score,
        completedAt: completed ? Date.now() : undefined
      });
    }
    
    progress.totalScore = progress.projectProgress.reduce((sum, p) => sum + p.score, 0);
    progress.lastUpdated = Date.now();
    
    await progress.save();
    
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: '服务器错误', error: err.message });
  }
});

module.exports = router;