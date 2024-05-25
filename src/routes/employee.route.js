const router = require('express').Router();
const employeeController = require('../controllers/employee.controller');

router.get('/', employeeController.getAllEmployees);
router.get('/tasks', employeeController.getAllEmployeesTask);
router.post('/create', employeeController.createEmployee);
router.post('/create/task', employeeController.createEmployeeTask);
router.post('/resign/', employeeController.resignEmployee);

module.exports = router;
