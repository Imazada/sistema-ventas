import express from 'express';
import AuthController from '../controllers/authController.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();

router.post('/registrar', AuthController.registrar);
router.post('/login', AuthController.login);
router.get('/perfil', autenticar, AuthController.perfil);

export default router;