const schema = require('../drizzle/schema');
const { like, or, eq, inArray } = require('drizzle-orm');
const passport = require('passport');
const db = require('../configs/db');

// GET /profile (get user profile from JWT.user.userid)
exports.getUserProfile = async (req, res) => {
    try {
        const userID = req.user.userid;
        const user = await db
            .select({
                firstName: schema.userAccount.firstName,
                lastName: schema.userAccount.lastName,
                email: schema.userAccount.email,
                phoneNumber: schema.userAccount.phoneNumber,
            })
            .from(schema.userAccount)
            .where(eq(schema.userAccount.userID, userID));
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while getting user profile',
        });
    }
};

// POST /profile/edit
exports.editUserProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            ...invalidFields
        } = req.body;
        const userID = req.user.userid;

        // Check for invalid fields
        if (Object.keys(invalidFields).length > 0) {
            return res.status(400).json({
                message: `Invalid field(s) in request body: ${Object.keys(invalidFields).join(', ')}`,
            });
        }

        let updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (email) updateFields.email = email;
        if (phoneNumber) updateFields.phoneNumber = phoneNumber;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                message: 'No fields to update',
            });
        }

        const user = await db
            .update(schema.userAccount)
            .set(updateFields)
            .where(eq(schema.userAccount.userID, userID));

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while updating user profile',
        });
    }
};
