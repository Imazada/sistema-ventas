import express from 'express';
import CarritoController from '../controllers/carritoController.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();

router.get('/', CarritoController.obtenerCarrito);
router.post('/:carritoId/items', autenticar, CarritoController.agregarItem);
router.put('/:carritoId/items/:itemId', autenticar, CarritoController.actualizarCantidad);
router.delete('/:carritoId/items/:itemId', autenticar, CarritoController.eliminarItem);
router.delete('/:carritoId/vaciar', autenticar, CarritoController.vaciarCarrito);
router.get('/:carritoId/totales', CarritoController.calcularTotales);

export default router;