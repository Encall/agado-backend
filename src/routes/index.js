import { Router } from 'express';
import passport from 'passport';
import db from '../configs/db.js';
import authRouter from './auth.route.js';
import * as schema from '../drizzle/schema';

const router = Router();

router.use('/', authRouter);

router.get(
    '/protected',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ message: 'Protected route' });
    }
);

router.get(
    '/airports',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const airports = await db.select().from(schema.airports);
        res.json(airports);
    }
);

export default indexRouter = router;
