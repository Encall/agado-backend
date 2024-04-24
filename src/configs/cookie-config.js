const cookieConfig = {
    options: {
        httpOnly: true,
        secure: false,
        maxAge: 2 * 60 * 60 * 1000,
        Credentials: true,
    },
};

module.exports = cookieConfig;