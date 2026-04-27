import { Producto } from '../models/index.js';

class CategoriaController {
    async obtenerCategorias(req, res) {
        try {
            const categorias = await Producto.findAll({
                attributes: [[Producto.sequelize.fn('DISTINCT', Producto.sequelize.col('categoria')), 'categoria']],
                where: { activo: true },
                raw: true
            });
            
            const listaCategorias = categorias.map(c => c.categoria).filter(c => c);
            res.json({ success: true, data: listaCategorias });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new CategoriaController();