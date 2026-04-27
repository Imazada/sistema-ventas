import { Producto } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import NotificacionService from './notificacionService.js';

class ProductoService {
    async obtenerTodos(filtros = {}) {
        const where = { activo: true };
        
        if (filtros.busqueda) {
            where[Op.or] = [
                { nombre: { [Op.iLike]: `%${filtros.busqueda}%` } },
                { sku: { [Op.iLike]: `%${filtros.busqueda}%` } },
                { categoria: { [Op.iLike]: `%${filtros.busqueda}%` } }
            ];
        }
        
        if (filtros.categoria) {
            where.categoria = filtros.categoria;
        }
        
        const productos = await Producto.findAll({
            where,
            order: [['fecha_creacion', 'DESC']]
        });
        
        return productos;
    }
    
    async obtenerPorId(id) {
        const producto = await Producto.findByPk(id);
        if (!producto || !producto.activo) {
            throw new Error('Producto no encontrado');
        }
        return producto;
    }
    
    async crear(datos) {
        const existe = await Producto.findOne({ where: { sku: datos.sku } });
        if (existe) {
            throw new Error('Ya existe un producto con este SKU');
        }
        
        const producto = await Producto.create(datos);
        return producto;
    }
    
    async actualizar(id, datos) {
        const producto = await this.obtenerPorId(id);
        
        if (datos.sku && datos.sku !== producto.sku) {
            const existe = await Producto.findOne({ 
                where: { 
                    sku: datos.sku,
                    activo: true,
                    id: { [Op.ne]: id }
                } 
            });
            if (existe) {
                throw new Error('Ya existe un producto con este SKU');
            }
        }
        
        const precioCompra = datos.precio_compra || producto.precio_compra;
        const precioVenta = datos.precio_venta || producto.precio_venta;
        
        if (parseFloat(precioVenta) <= parseFloat(precioCompra)) {
            throw new Error('El precio de venta debe ser mayor que el precio de compra');
        }
        
        await producto.update(datos);

        // Verificar stock para notificaciones
        if (producto.stock_actual <= producto.stock_minimo) {
            await NotificacionService.notificarStockBajo(producto);
        }

        return producto;
    }
    
    async eliminar(id) {
        const producto = await this.obtenerPorId(id);
        await producto.update({ activo: false });
        return true;
    }
    
    async obtenerEstadisticas() {
        const productos = await Producto.findAll({ where: { activo: true } });
        
        const totalProductos = productos.length;
        const valorInventario = productos.reduce((sum, p) => 
            sum + (p.stock_actual * parseFloat(p.precio_compra || 0)), 0);
        const bajoStock = productos.filter(p => p.stock_actual < p.stock_minimo).length;
        
        let productoMasValioso = null;
        let maxValor = 0;
        productos.forEach(p => {
            const valor = p.stock_actual * parseFloat(p.precio_compra || 0);
            if (valor > maxValor) {
                maxValor = valor;
                productoMasValioso = p;
            }
        });
        
        const categoriasCount = {};
        const valorPorCategoria = {};
        productos.forEach(p => {
            if (p.categoria) {
                categoriasCount[p.categoria] = (categoriasCount[p.categoria] || 0) + 1;
                const valor = p.stock_actual * parseFloat(p.precio_compra || 0);
                valorPorCategoria[p.categoria] = (valorPorCategoria[p.categoria] || 0) + valor;
            }
        });

        const topCategorias = Object.entries(categoriasCount)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);

        const distribucionValor = Object.entries(valorPorCategoria)
            .map(([nombre, valor]) => ({ nombre, valor }))
            .sort((a, b) => b.valor - a.valor);

        // Enriquecer topCategorias con el valor para el reporte de gestión
        const topCategoriasEnriquecidas = topCategorias.map(cat => ({
            ...cat,
            valor: valorPorCategoria[cat.nombre] || 0
        }));

        const productosBajoStock = productos
            .filter(p => p.stock_actual < p.stock_minimo)
            .map(p => ({
                id: p.id,
                sku: p.sku,
                nombre: p.nombre,
                stock_actual: p.stock_actual,
                stock_minimo: p.stock_minimo
            }))
            .slice(0, 10);
        
        return {
            kpis: {
                totalProductos,
                valorInventario: parseFloat(valorInventario.toFixed(2)),
                bajoStock,
                productoMasValioso: productoMasValioso ? {
                    nombre: productoMasValioso.nombre,
                    valor: parseFloat(maxValor.toFixed(2))
                } : null
            },
            topCategorias: topCategoriasEnriquecidas,
            distribucionValor,
            productosBajoStock
        };
    }

    async obtenerCategorias() {
        const productos = await Producto.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('categoria')), 'categoria']],
            where: { activo: true }
        });
        return productos.map(p => p.categoria).filter(c => c !== null);
    }
}

export default new ProductoService();