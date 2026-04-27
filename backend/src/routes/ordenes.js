import express from 'express';
import OrdenController from '../controllers/ordenController.js';
import { autenticar, autorizar } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas de órdenes requieren autenticación
router.use(autenticar);

// Rutas para Clientes y Admin
router.post('/', OrdenController.crearOrden);
router.get('/historial', OrdenController.obtenerOrdenes); // Cambiado de /mis-ordenes a /historial para evitar conflictos
router.get('/:id', OrdenController.obtenerOrdenPorId);

// Rutas para Admin y Vendedor (Gestión)
router.get('/', autorizar(['admin', 'vendedor']), OrdenController.obtenerOrdenes);
router.put('/:id/estado', autorizar(['admin', 'vendedor']), OrdenController.actualizarEstado);

export default router;