const express = require('express');
const TasksController = require('../controllers/tasks.controller');
const TaskService = require('../services/Task.service');
const AuthMiddleware = require('../middlewares/auth.middleware');
const Task = require('../models/Task');

const env = process.env.NODE_ENV || "development";
const config = require('../../config/config')[env];

const router = express.Router();

const authMiddleware = new AuthMiddleware(config.JWT_KEY)
const taskService = new TaskService(Task);
const taskController = new TasksController(taskService);


router.get('/get/all/', authMiddleware.validateToken, (req, res, next) => taskController.getAllTasksForUser(req, res, next));

router.get('/get/:taskId', authMiddleware.validateToken, (req, res, next) => taskController.getTask(req, res, next));

router.post('/add', authMiddleware.validateToken, (req, res, next) => taskController.createTask(req, res, next));

router.put('/edit/:taskId', authMiddleware.validateToken, (req, res, next) => taskController.editTask(req, res, next));

router.patch('/markdone/:taskId', authMiddleware.validateToken, (req, res, next) => taskController.markTaskAsCompleted(req, res, next));

router.delete('/delete/:taskId', authMiddleware.validateToken, (req, res, next) => taskController.deleteTask(req, res, next));

module.exports = router;