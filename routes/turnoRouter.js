import {Router} from 'express';

import TurnoController from '../controllers/TurnoController.js';


const router = Router();
const controller = new TurnoController();



router.get('/', controller.getAll);

router.get('/:id', controller.getById);
router.post('/', controller.create);

router.put('/:id', controller.update);
router.delete('/:id', controller.delete);



export default router;