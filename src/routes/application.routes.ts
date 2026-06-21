import { Router } from 'express';
import { createApplication, getApplications, getApplicationByTrackingId, updateApplicationStatus } from '../controllers/application.controller.js';

const router = Router();

router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:trackingId', getApplicationByTrackingId);
router.patch('/:id', updateApplicationStatus);

export default router;
