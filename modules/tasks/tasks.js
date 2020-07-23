const express = require('express');
const router = express.Router();

const tasksController = require('../../controllers/tasks/tasks');

/* Middleware to validate the token and access */
const authCheck = require('../../middleware/authCheck');

/* API to fetch all the tasks
* return count, state and list of respective tasks
*/
router.get('/', authCheck, tasksController.TASKS_GET_ALL);

/* API to create/add new tasks*/
router.post('/', authCheck, tasksController.TASKS_CREATE);

/* API to get specific task*/
router.get('/:taskId', authCheck, tasksController.TASKS_GET_ONE);

/* API to delete task*/
router.delete("/:taskId", authCheck, tasksController.TASKS_DELETE);

/* API to update task*/
router.patch("/:taskId", authCheck, tasksController.TASKS_UPDATE)

module.exports = router
