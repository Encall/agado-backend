const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../configs/db');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
};

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: (req) => req.cookies.token,
                secretOrKey: opts.secretOrKey,
            },
            (jwtPayload, done) => {
                console.log(jwtPayload);
                if (Date.now() > jwtPayload.expires) {
                    return done('jwt expired');
                }

                return done(null, jwtPayload);
            }
        )
    );
};
