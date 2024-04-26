const cookieConfig = {
    options: {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000, // 1 hour
        Credentials: true,
    },
    refreshOptions:{
        httpOnly: false,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, // 24 hour
        Credentials: true,
    }
};

export default cookieConfig;