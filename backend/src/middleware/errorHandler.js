export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Errores de Sequelize
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            success: false,
            error: 'Ya existe un registro con ese SKU'
        });
    }
    
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            error: err.errors.map(e => e.message).join(', ')
        });
    }
    
    // Error genérico
    res.status(500).json({
        success: false,
        error: err.message || 'Error interno del servidor'
    });
};