import { Strategy as JwtStrategy } from 'passport-jwt';
import dotenv from 'dotenv';

dotenv.config();

export default (passport) => {
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: (req) => req.cookies.accessToken,
                secretOrKey: process.env.JWT_ACCESS_SECRET_KEY,
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
