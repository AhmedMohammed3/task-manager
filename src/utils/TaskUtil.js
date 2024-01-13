const TaskService = require("../services/Task.service");

class TaskUtil {
    /**
     * @param {Integer} taskId 
     * @param {Object} taskData 
     * @param {TaskService} taskService
     */

    static async editTask(taskId, taskData, taskService, userId) {
        taskId = Number(taskId);
        const task = await taskService.getTaskById(taskId);
        if (!task) {
            throw new NotFoundError('Task not found');
        }

        if (task.ownerId != userId) {
            throw new UnauthorizedError('User does not own that task');
        }

        const updateRslt = await taskService.updateTaskById(taskId, taskData);
        const {
            updatedColumnsNo,
            updatedTask
        } = updateRslt;
        if (!updatedColumnsNo || updatedColumnsNo < 1) {
            throw new Error("Could not update task");
        }
        return updatedTask;
    }
}

module.exports = TaskUtil;