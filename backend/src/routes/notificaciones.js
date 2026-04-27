import express from 'express';
import NotificacionController from '../controllers/notificacionController.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();

router.use(autenticar);

router.get('/', NotificacionController.obtenerMisNotificaciones);
router.put('/:id/leida', NotificacionController.marcarLeida);
router.put('/marcar-todas-leidas', NotificacionController.marcarTodasLeidas);

export default router;
