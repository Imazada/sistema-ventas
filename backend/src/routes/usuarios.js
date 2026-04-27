import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import { autenticar, autorizar } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas de usuarios son solo para administradores
router.use(autenticar, autorizar(['admin']));

router.get('/', UsuarioController.listarUsuarios);
router.post('/', UsuarioController.crearUsuario);
router.put('/:id', UsuarioController.actualizarUsuario);
router.get('/roles', UsuarioController.obtenerRoles);

export default router;
