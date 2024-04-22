const cookieConfig = {
    options: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
};

module.exports = cookieConfig;