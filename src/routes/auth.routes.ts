import { Router } from 'express';
import { loginDriver } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginDriver);

export default router;
