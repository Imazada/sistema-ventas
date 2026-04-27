import express from 'express';
import EstadisticaController from '../controllers/estadisticaController.js';
import { autenticar, autorizar } from '../middleware/auth.js';

const router = express.Router();

router.get('/metricas-tiempo-real', autenticar, autorizar(['admin', 'vendedor']), EstadisticaController.obtenerMetricasTiempoReal);
router.get('/estadisticas-descriptivas', autenticar, autorizar(['admin']), EstadisticaController.obtenerEstadisticasDescriptivas);
router.get('/rotacion-inventario', autenticar, autorizar(['admin']), EstadisticaController.obtenerRotacionInventario);
router.get('/analisis-completo', autenticar, autorizar(['admin']), EstadisticaController.obtenerAnalisisCompleto);

export default router;