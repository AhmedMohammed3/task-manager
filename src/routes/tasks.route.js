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

/**
 * @swagger
 * /tasks/get/all/:
 *   get:
 *     description: Retrieves all tasks associated with the authenticated user.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched tasks successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Fetched tasks successfully
 *               tasks:
 *                 - id: 1
 *                   title: "Task 1"
 *                   description: "Task 1"
 *                   dueDate: "1-1-1970"
 *                 - id: 2
 *                   title: "Task 2"
 *                   description: "Task 2"
 *                   dueDate: "1-1-1970"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized - Missing token
 *               success: false
 *       404:
 *         description: Not found resources
 *         content:
 *           application/json:
 *             example:
 *               message: No Tasks for user :userId
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               success: false
 */
router.get('/get/all/', authMiddleware.validateToken, (req, res, next) => taskController.getAllTasksForUser(req, res, next));
/**
 * @swagger
 * /tasks/get/{taskId}:
 *   get:
 *     description: Retrieves a specific task by ID for the authenticated user.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         description: The ID of the task to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched task successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Fetched task successfully
 *               task:
 *                 id: 1
 *                 title: "Task 1"
 *                 description: "Task 1"
 *                 dueDate: "1/1/1970"
 *       400:
 *         description: User Input Error
 *         content:
 *           application/json:
 *             example:
 *               message: Task ID is required (must be a number)
 *               success: false
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized - Missing token
 *               success: false
 *       404:
 *         description: Not found resources
 *         content:
 *           application/json:
 *             example:
 *               message: Task not found
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               success: false
 */
router.get('/get/:taskId', authMiddleware.validateToken, (req, res, next) => taskController.getTask(req, res, next));
/**
 * @swagger
 * /tasks/add:
 *   post:
 *     description: Creates a new task for the authenticated user.
 *     tags:
 *       - Tasks
 *     parameters: 
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: title
 *         description: task title
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: description
 *         description: task description
 *         required: false
 *         schema:
 *           type: string
 *       - in: body
 *         name: dueDate
 *         description: task due date
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Created task successfully
 *               task:
 *                 id: 1
 *                 title: "New Task"
 *                 description: "Task description"
 *                 dueDate: "1-1-1970"
 *       400:
 *         description: User Input Error
 *         content:
 *           application/json:
 *             example:
 *               message: Task title is required
 *               success: false
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized - Missing token
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               success: false
 */
router.post('/add', authMiddleware.validateToken, (req, res, next) => taskController.createTask(req, res, next));
/**
 * @swagger
 * /tasks/edit/{taskId}:
 *   put:
 *     description: Edits a specific task by ID for the authenticated user.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         description: The ID of the task to edit
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: title
 *         description: task title
 *         schema:
 *           type: string
 *       - in: body
 *         name: description
 *         description: task description
 *         schema:
 *           type: string
 *       - in: body
 *         name: dueDate
 *         description: task due date
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Updated task successfully
 *               task:
 *                 taskId: "1"
 *                 title: "Updated Task"
 *                 description: "Updated task description"
 *                 dueDate: "1-1-1970"
 *       400:
 *         description: User Input Error
 *         content:
 *           application/json:
 *             example:
 *               message: Task ID is required (must be a number)
 *               success: false
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized - Missing token
 *               success: false
 *       404:
 *         description: Not found resources
 *         content:
 *           application/json:
 *             example:
 *               message: Task not found
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               success: false
 */
router.put('/edit/:taskId', authMiddleware.validateToken, (req, res, next) => taskController.editTask(req, res, next));
/**
 * @swagger
 * /tasks/markdone/{taskId}:
 *   patch:
 *     description: mark a specific task by ID as done for the authenticated user.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         description: The ID of the task to edit
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Marked task :taskId as completed
 *               task:
 *                 taskId: "1"
 *                 title: "Updated Task"
 *                 description: "Updated task description"
 *                 dueDate: "1-1-1970"
 *       400:
 *         description: User Input Error
 *         content:
 *           application/json:
 *             example:
 *               message: Task ID is required (must be a number)
 *               success: false
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized - Missing token
 *               success: false
 *       404:
 *         description: Not found resources
 *         content:
 *           application/json:
 *             example:
 *               message: Task not found
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               success: false
 */
router.patch('/markdone/:taskId', authMiddleware.validateToken, (req, res, next) => taskController.markTaskAsCompleted(req, res, next));
/**
 * @swagger
 * /tasks/delete/{taskId}:
 *   delete:
 *     description: delete a specific task by ID for the authenticated user.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         description: The ID of the task to delete
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Task deleted successfully
 *       400:
 *         description: User Input Error
 *         content:
 *           application/json:
 *             example:
 *               message: Task ID is required (must be a number)
 *               success: false
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized - Missing token
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               success: false
 */
router.delete('/delete/:taskId', authMiddleware.validateToken, (req, res, next) => taskController.deleteTask(req, res, next));

module.exports = router;