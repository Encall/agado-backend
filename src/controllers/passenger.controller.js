const db = require('../configs/db');

exports.getAllPassengers = async (req, res) => {
    try {
        const query = `
            SELECT * FROM passenger`;
        const [passengers] = await db.query(query);
        res.status(200).json(passengers);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while getting all passengers',
        });
    }
};
