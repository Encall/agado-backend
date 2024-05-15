const db = require('../configs/db');

exports.getAllEmployees = async (req, res) => {
    try {
        const query = `
            SELECT 
                employeeID,
                firstName,
                lastName,
                email,
                phoneNumber,
                departmentID,
                position,
                salary,
                startDate,
                endDate,
                permissionLevel
            FROM 
                employee
        `;
        const [employees] = await db.query(query);
        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while getting all employees',
        });
    }
}

exports.getAllEmployeesTask = async (req, res) => {
    try {
        const query = `
            SELECT 
                *
            FROM
                employeeTask
        `;
        const [employees] = await db.query(query);
        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while getting all employees',
        });
    }
}

exports.createEmployee = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, departmentID, position, salary, startDate, endDate, permissionLevel } = req.body;
    try {
        const query = `
            INSERT INTO 
                employee (firstName, lastName, email, phoneNumber, departmentID, position, salary, startDate, endDate, permissionLevel)
            VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(query, [firstName, lastName, email, phoneNumber, departmentID, position, salary, startDate, endDate, permissionLevel]);
        res.status(200).json({
            message: 'Employee created successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while creating employee',
        });
    }
}

exports.createEmployeeTask = async (req, res) => {
    const { employeeID, taskDescription, taskStatus } = req.body;
    try {
        const query = `
            INSERT INTO 
                employeeTask (employeeID, taskID, taskDescription, taskStatus)
            VALUES 
                (?, ?, ?, ?)
        `;
        await db.query(query, [employeeID, taskID, taskDescription, taskStatus]);
        res.status(200).json({
            message: 'Employee task created successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while creating employee task',
        });
    }
}

exports.resignEmployee = async (req, res) => {
    const { employeeID } = req.params;
    try {
        const employeeQuery = `
            UPDATE 
                employee
            SET 
                endDate = NOW()
            WHERE 
                employeeID = ?
        `;
        await db.query(employeeQuery, [employeeID]);

        const taskQuery = `
            UPDATE 
                task
            SET 
                status = 'cancelled',
                description = CONCAT(description, ' - Employee resigned')
            WHERE 
                employeeID = ?
                AND status = 'ongoing'
        `;
        await db.query(taskQuery, [employeeID]);

        res.status(200).json({
            message: 'Employee resigned successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while resigning employee',
        });
    }
}