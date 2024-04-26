import express from 'express';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post(
    '/refresh',
    authController.jwtRefreshTokenValidate,
    authController.refresh
);

export default authRouter = router;