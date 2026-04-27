import { body, param, query, validationResult } from 'express-validator';

export const validarProducto = [
    body('sku')
        .notEmpty().withMessage('SKU es requerido')
        .isString().withMessage('SKU debe ser texto')
        .isLength({ max: 50 }).withMessage('SKU máximo 50 caracteres'),
    body('nombre')
        .notEmpty().withMessage('Nombre es requerido')
        .isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener entre 2 y 100 caracteres'),
    body('categoria')
        .notEmpty().withMessage('Categoría es requerida'),
    body('precio_compra')
        .isFloat({ min: 0 }).withMessage('Precio de compra debe ser mayor o igual a 0'),
    body('precio_venta')
        .isFloat({ min: 0.01 }).withMessage('Precio de venta debe ser mayor a 0'),
    body('stock_actual')
        .isInt({ min: 0 }).withMessage('Stock actual debe ser mayor o igual a 0'),
    body('stock_minimo')
        .isInt({ min: 0 }).withMessage('Stock mínimo debe ser mayor o igual a 0'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }
        next();
    }
];

export const validarId = [
    param('id').isInt().withMessage('ID debe ser un número entero'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }
        next();
    }
];