const GeneralUserError = require("../errors/GeneralUserError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const TaskService = require("../services/Task.service");
const TaskStatus = require("../enums/task-statuses");
const TaskUtil = require("../utils/TaskUtil");

class TaskController {
    /**
     * 
     * @param {TaskService} taskService 
     */
    constructor(taskService) {
        this.taskService = taskService;
    }

    async getAllTasksForUser(req, res, next) {
        try {
            const {
                userId
            } = req.user;

            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 2;

            const {
                count,
                tasks
            } = await this.taskService.getAllTasksPaginated({
                ownerId: userId
            }, (page - 1) * perPage, perPage);
            if (!count || !tasks || tasks.length < 0 || count < 1) {
                throw new NotFoundError("No Tasks for user");
            }
            const notCompletedTasks = tasks.filter(task=> task.status == TaskStatus.IN_PROGRESS);
            const completedTasks = tasks.filter(task=> task.status == TaskStatus.COMPLETED);

            const pageCount = Math.ceil(count / perPage);

            return res.status(200).json({
                success: true,
                message: 'Fetched tasks successfully',
                notCompletedTasks,
                completedTasks,
                pagination: {
                    page,
                    itemsPerPage: perPage,
                    pageCount,
                    totalItemsCount: count,
                },
            });
        } catch (err) {
            next(err);
        }
    }

    async getTask(req, res, next) {
        try {
            let {
                taskId
            } = req.params;
            if (!taskId || isNaN(taskId)) {
                throw new GeneralUserError("Task ID is required (must be a number)");
            }
            taskId = Number(taskId);
            const task = await this.taskService.getTaskById(taskId);
            if (!task) {
                throw new NotFoundError('Task not found');
            }
            const {
                userId
            } = req.user;
            if (task.ownerId != userId) {
                throw new UnauthorizedError('User does not own that task');
            }
            return res.status(200).json({
                success: true,
                message: `Fetched task ${taskId} successfully`,
                task
            });
        } catch (err) {
            next(err);
        }
    }

    async createTask(req, res, next) {
        try {
            const {
                title,
                description,
                dueDate
            } = req.body;
            if (!title) {
                throw new GeneralUserError("Task title is required");
            }
            const {
                userId
            } = req.user;
            const taskData = {
                title,
                ownerId: userId
            }
            if (description) {
                taskData.description = description;
            }
            if (dueDate) {
                taskData.dueDate = dueDate;
            }
            const task = await this.taskService.createTask(taskData);
            if (!task) {
                throw new Error("Cannot create task");
            }
            return res.status(201).json({
                success: true,
                message: `Created task ${task.id} successfully`,
                task
            });

        } catch (err) {
            next(err);
        }
    }

    async editTask(req, res, next) {
        try {
            let {
                taskId
            } = req.params;

            const {
                title,
                description,
                dueDate
            } = req.body;

            if ((!taskId || isNaN(taskId)) || (!title && !description && !dueDate)) {
                throw new GeneralUserError("taskId (must be a number) AND (title, description OR dueDate) are required!");
            }

            const {
                userId
            } = req.user;

            const taskData = {};
            if (title) {
                taskData.title = title;
            }
            if (description) {
                taskData.description = description;
            }
            if (dueDate) {
                taskData.dueDate = dueDate;
            }

            const task = await TaskUtil.editTask(taskId, taskData, this.taskService, userId);

            return res.status(200).json({
                success: true,
                message: `Updated task ${taskId} successfully`,
                task
            });
        } catch (err) {
            next(err);
        }
    }

    async markTaskAsCompleted(req, res, next) {
        try {
            let {
                taskId
            } = req.params;
            if (!taskId || isNaN(taskId)) {
                throw new GeneralUserError("Task ID is required (must be a number)");
            }

            const taskData = {
                status: TaskStatus.COMPLETED
            };

            const {
                userId
            } = req.user;

            const task = await TaskUtil.editTask(taskId, taskData, this.taskService, userId);

            return res.status(200).json({
                success: true,
                message: `Marked task ${taskId} as completed`,
                task
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteTask(req, res, next) {
        try {
            let {
                taskId
            } = req.params;
            if (!taskId || isNaN(taskId)) {
                throw new GeneralUserError("Task ID is required (must be a number)");
            }

            const task = await this.taskService.getTaskById(taskId);
            if (!task) {
                throw new NotFoundError('Task not found');
            }

            const {
                userId
            } = req.user;

            if (task.ownerId != userId) {
                throw new UnauthorizedError('User does not own that task');
            }
            taskId = Number(taskId);
            const deleted = await this.taskService.deleteTask(taskId);
            if (!deleted) {
                throw new Error(`Error deleting task ${taskId}`);
            }
            res.status(200).json({
                success: true,
                message: "Task deleted successfully"
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = TaskController;