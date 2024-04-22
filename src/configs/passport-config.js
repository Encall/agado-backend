const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../configs/db');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
};

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            db.query(
                'SELECT * FROM userAccount WHERE email = ?',
                [jwt_payload.email],
                function (error, results, fields) {
                    if (error) throw error;

                    if (results.length > 0) {
                        return done(null, results[0]);
                    } else {
                        return done(null, false);
                    }
                }
            );
        })
    );
};
