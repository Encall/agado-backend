const validateBody = (bodySchema) => (req, res, next) => {
    try {
        if (bodySchema) bodySchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).send(err.errors);
    }
};

const validateQuery = (querySchema) => (req, res, next) => {
    try {
        if (querySchema) querySchema.parse(req.query);
        next();
    } catch (err) {
        return res.status(400).send(err.errors);
    }
};

const validateParams = (paramsSchema) => (req, res, next) => {
    try {
        if (paramsSchema) paramsSchema.parse(req.params);
        next();
    } catch (err) {
        return res.status(400).send(err.errors);
    }
};

module.exports = {
    validateBody,
    validateQuery,
    validateParams,
};
