import { Router } from 'express';

import { authController, userController } from '../controllers';
import protectedRoute from '../middleware/protectedRoute';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/token', authController.refreshToken);

router.get('/:username', protectedRoute, userController.getUser);

export default router;
