const Task = require('../models/Task');

class TaskService {
    /**
     * 
     * @param {Task} taskModel 
     */
    constructor(taskModel) {
        this.taskModel = taskModel;
    }

    async getTaskById(taskId) {
        const task = await this.taskModel.findByPk(taskId);
        return task && !task.deleted ? task : null;
    }

    async getTask(where) {
        where = {
            deleted: false,
            ...where
        };
        return await this.taskModel.findOne(where);
    }

    async getAllTasks(where) {
        where = {
            deleted: false,
            ...where
        };
        return await this.taskModel.findAll(where);
    }

    async createTask(taskData) {
        return await this.taskModel.create(taskData);
    }

    async updateTasks(where, taskData) {
        where = {
            deleted: false,
            ...where
        };
        return await this.taskModel.update(taskData, {
            where
        });
    }

    async updateTaskById(taskId, taskData) {
        const [updatedColumnsCount, updatedTasks] = await this.updateTasks({
            id: taskId
        }, taskData);
        return {
            updatedColumnsCount,
            updatedTask: updatedTasks && updatedTasks.length > 0 ? updatedTasks[0] : undefined
        };
    }

    async deleteTask(taskId) {
        const {
            updatedColumnsCount
        } = await this.updateTaskById(taskId, {
            deleted: true
        });
        return updatedColumnsCount > 0;
    }
}

module.exports = TaskService;