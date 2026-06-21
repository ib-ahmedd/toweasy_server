import { Router } from 'express';
import { getDrivers, updateDriverStatus, getLoggedInDriver } from '../controllers/driver.controller.js';

const router = Router();

router.get('/', getDrivers);
router.get('/me', getLoggedInDriver);
router.patch('/:id/status', updateDriverStatus);

export default router;
