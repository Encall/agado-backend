require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db');
const schema = require('../drizzle/schema');
const opts = require('../configs/cookie-config');
const { eq } = require('drizzle-orm');
const jwtsecretkey = process.env.JWT_ACCESS_SECRET_KEY;
const jwtexpiration = process.env.JWT_ACCESS_EXPIRATION;

exports.login = async (req, res) => {
    try {
        const [employee] = await db
            .select()
            .from(schema.employee)
            .where(eq(schema.employee.email, req.body.email));
        if (!employee || employee.length === 0) {
            return res
                .status(401)
                .json({ error: 'Incorrect email or password.' });
        }
        const isMatch = await new Promise((resolve, reject) => {
            bcrypt.compare(
                req.body.password,
                employee.password,
                function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });

        if (!isMatch) {
            return res.status(401).json({
                error: 'Incorrect email or password.',
            });
        }

        const accessToken = jwt.sign(
            { id: employee.userID, role: employee.permissionLevel },
            jwtsecretkey,
            {
                expiresIn: jwtexpiration,
            }
        );
        const refreshToken = jwt.sign(
            { id: employee.userID, role: employee.permissionLevel },
            process.env.JWT_REFRESH_SECRET_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION,
            }
        );

        res.cookie('accessToken', accessToken, opts.options);
        res.cookie('refreshToken', refreshToken, opts.refreshOptions);
        console.log('Employee: %s logged in successfully.', employee.email);
        return res
            .status(200)
            .json({
                userid: employee.userID,
                email: employee.email,
                firstName: employee.firstName,
                role: employee.permissionLevel,
            })
            .send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.signup = async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        departmentID,
        position,
        salary,
        startDate,
        permissionLevel,
    } = req.body;
    // Check if all fields are provided
    if (
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        !phoneNumber ||
        !position ||
        !salary ||
        !startDate ||
        !permissionLevel
    ) {
        return res.status(400).json({
            message: 'All fields are required.',
        });
    }

    try {
        // Check if employee already exists
        var [employee] = await db
            .select()
            .from(schema.employee)
            .where(eq(schema.employee.email, req.body.email));
        if (employee) {
            console.log('Email already exists');
            return res.status(409).json({ message: 'Email already exists.' });
        }

        // Hash the password
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });

        await db.insert(schema.employee).values({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            departmentID: departmentID || null,
            position: position,
            salary: salary,
            startDate: startDate,
            permissionLevel: permissionLevel,
        });

        // Get the employee's ID from DB
        [employee] = await db
            .select()
            .from(schema.employee)
            .where(eq(schema.employee.email, req.body.email));

        console.log(
            'Employee: %s Email: %s created successfully.',
            employee.employeeID,
            employee.email
        );

        // Create a JWT
        const accessToken = jwt.sign(
            { id: employee.employeeID, role: employee.permissionLevel },
            jwtsecretkey,
            {
                expiresIn: jwtexpiration,
            }
        );
        const refreshToken = jwt.sign(
            { id: employee.employeeID, role: employee.permissionLevel },
            process.env.JWT_REFRESH_SECRET_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION,
            }
        );

        console.log('Employee: %s signed up successfully.', email);
        res.cookie('accessToken', accessToken, opts.options);
        res.cookie('refreshToken', refreshToken, opts.refreshOptions);
        res.status(200)
            .json({
                employeeID: employee.employeeID,
                email: employee.email,
                firstName: employee.firstName,
                role: employee.permissionLevel,
            })
            .send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error occurred during signup.',
        });
    }
};
