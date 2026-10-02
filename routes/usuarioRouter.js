import { Router } from 'express';

import UsuarioController from '../controllers/UsuarioController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = Router();
const controller = new UsuarioController();

router.get('/', authMiddleware, roleMiddleware, controller.getAll);
router.get('/:id', authMiddleware, roleMiddleware, controller.getById);

router.post('/', authMiddleware, roleMiddleware, controller.create);



router.put('/:id', authMiddleware, roleMiddleware, controller.update);
router.delete('/:id', authMiddleware, roleMiddleware, controller.delete);

export default router;