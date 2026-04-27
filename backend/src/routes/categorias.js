import express from 'express';
import CategoriaController from '../controllers/categoriaController.js';

const router = express.Router();

router.get('/', CategoriaController.obtenerCategorias);

export default router;