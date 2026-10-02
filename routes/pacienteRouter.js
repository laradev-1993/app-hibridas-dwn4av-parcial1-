import { Router } from 'express';

import PacienteController from '../controllers/PacienteController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new PacienteController();

 router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getById);

router.post('/', authMiddleware, controller.create);
 router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);

export default router;