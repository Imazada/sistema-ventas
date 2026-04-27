import express from 'express';
import ProductoController from '../controllers/productoController.js';
import { validarProducto, validarId } from '../middleware/validaciones.js';
import { autenticar, autorizar } from '../middleware/auth.js';
import { uploadProductoImagen } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Rutas para Gestión de Inventario (Solo Admin puede crear, editar y eliminar)
router.get('/estadisticas', autenticar, autorizar(['admin', 'vendedor']), ProductoController.obtenerEstadisticas);
router.post('/', autenticar, autorizar(['admin']), uploadProductoImagen.single('imagen'), validarProducto, ProductoController.crear);
router.put('/:id', autenticar, autorizar(['admin']), uploadProductoImagen.single('imagen'), validarId, validarProducto, ProductoController.actualizar);
router.delete('/:id', autenticar, autorizar(['admin']), validarId, ProductoController.eliminar);


// Rutas públicas/compartidas (Requieren autenticación)
router.get('/', autenticar, ProductoController.obtenerTodos);
router.get('/:id', autenticar, validarId, ProductoController.obtenerPorId);

export default router;