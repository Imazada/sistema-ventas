import { Sequelize } from 'sequelize';
import { Orden, OrdenItem, Usuario, Producto } from '../models/index.js';
import CarritoService from './carritoService.js';
import NotificacionService from './notificacionService.js';

class OrdenService {
    async crearOrden(usuarioId) {
        // Asegurarnos de obtener el carrito con los items incluidos
        const carrito = await CarritoService.obtenerCarrito(usuarioId);
        
        // Obtener los items reales y los totales
        const { items, subtotal, impuesto, total } = await CarritoService.calcularTotales(carrito.id);
        
        console.log(`[DEBUG ORDER] Intentando crear orden para usuario ${usuarioId}. Items encontrados: ${items ? items.length : 0}`);

        if (!items || items.length === 0) {
            throw new Error('El carrito está vacío');
        }
        
        // Verificar stock
        for (const item of items) {
            const producto = await Producto.findByPk(item.producto_id);
            if (producto.stock_actual < item.cantidad) {
                throw new Error(`Stock insuficiente para ${producto.nombre}`);
            }
        }
        
        // Generar número de orden
        const numero_orden = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Crear orden
        const orden = await Orden.create({
            numero_orden,
            usuario_id: usuarioId,
            estado: 'pendiente',
            subtotal,
            impuesto,
            total
        });
        
        // Crear items de orden
        for (const item of items) {
            await OrdenItem.create({
                orden_id: orden.id,
                producto_id: item.producto_id,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario,
                subtotal: item.cantidad * item.precio_unitario
            });

            // Actualizar stock del producto
            const producto = await Producto.findByPk(item.producto_id);
            await producto.update({
                stock_actual: producto.stock_actual - item.cantidad
            });
        }
        
        // Vaciar carrito
        await CarritoService.vaciarCarrito(carrito.id);
        
        // Notificaciones de nueva venta
        await NotificacionService.notificarNuevaVenta(orden);
        
        return orden;
    }
    
    async obtenerTodas(filtros = {}, page = 1, limit = 10) {
        const { Op } = Sequelize;
        const where = {};
        const conditions = [];
        
        if (filtros.estado) {
            conditions.push({ estado: filtros.estado });
        }
        
        // Filtro por fecha
        if (filtros.fechaInicio) {
            const start = new Date(filtros.fechaInicio);
            start.setUTCHours(0, 0, 0, 0);
            conditions.push({ fecha_creacion: { [Op.gte]: start } });
        }
        
        if (filtros.fechaFin) {
            const end = new Date(filtros.fechaFin);
            end.setUTCHours(23, 59, 59, 999);
            conditions.push({ fecha_creacion: { [Op.lte]: end } });
        }

        // Filtro por búsqueda (Cliente o Número de Orden)
        if (filtros.busqueda) {
            const searchPattern = `%${filtros.busqueda}%`;
            conditions.push({
                [Op.or]: [
                    { numero_orden: { [Op.iLike]: searchPattern } },
                    { '$usuario.nombre$': { [Op.iLike]: searchPattern } },
                    { '$usuario.apellido$': { [Op.iLike]: searchPattern } },
                    { '$usuario.email$': { [Op.iLike]: searchPattern } }
                ]
            });
        }

        if (conditions.length > 0) {
            where[Op.and] = conditions;
        }
        
        const include = [
            { 
                model: OrdenItem, 
                as: 'items',
                include: [{ model: Producto, as: 'producto' }] 
            },
            { 
                model: Usuario, 
                as: 'usuario',
                attributes: ['nombre', 'apellido', 'email'] 
            }
        ];
        
        const offset = (page - 1) * limit;
        
        const { count, rows } = await Orden.findAndCountAll({
            where,
            include,
            order: [['fecha_creacion', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            subQuery: false
        });
        
        return {
            ordenes: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        };
    }

    async obtenerPorUsuario(usuarioId, filtros = {}, page = 1, limit = 10) {
        const { Op } = Sequelize;
        const where = { usuario_id: usuarioId };
        const conditions = [];
        
        if (filtros.estado) {
            conditions.push({ estado: filtros.estado });
        }

        if (filtros.fechaInicio) {
            const start = new Date(filtros.fechaInicio);
            start.setUTCHours(0, 0, 0, 0);
            conditions.push({ fecha_creacion: { [Op.gte]: start } });
        }
        
        if (filtros.fechaFin) {
            const end = new Date(filtros.fechaFin);
            end.setUTCHours(23, 59, 59, 999);
            conditions.push({ fecha_creacion: { [Op.lte]: end } });
        }

        if (filtros.busqueda) {
            const searchPattern = `%${filtros.busqueda}%`;
            conditions.push({
                numero_orden: { [Op.iLike]: searchPattern }
            });
        }

        if (conditions.length > 0) {
            where[Op.and] = conditions;
        }
        
        const offset = (page - 1) * limit;
        
        const { count, rows } = await Orden.findAndCountAll({
            where,
            include: [{ 
                model: OrdenItem, 
                as: 'items',
                include: [{ model: Producto, as: 'producto' }] 
            }],
            order: [['fecha_creacion', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        
        return {
            ordenes: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        };
    }
    
    async obtenerPorId(id) {
        const orden = await Orden.findByPk(id, {
            include: [
                { 
                    model: OrdenItem, 
                    as: 'items',
                    include: [{ model: Producto, as: 'producto' }] 
                },
                { 
                    model: Usuario, 
                    as: 'usuario',
                    attributes: ['nombre', 'apellido', 'email'] 
                }
            ]
        });
        
        if (!orden) {
            throw new Error('Orden no encontrada');
        }
        
        return orden;
    }
    
    async actualizarEstado(id, estado) {
        const orden = await this.obtenerPorId(id);
        
        const estadosValidos = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            throw new Error('Estado inválido');
        }
        
        await orden.update({ 
            estado,
            fecha_completada: estado === 'entregado' ? new Date() : null
        });
        
        // Notificar al cliente sobre el cambio de estado
        await NotificacionService.notificarCambioEstadoOrden(orden);
        
        return orden;
    }
    
    async cancelarOrden(id) {
        const orden = await this.obtenerPorId(id);
        
        if (orden.estado !== 'pendiente') {
            throw new Error('Solo se pueden cancelar órdenes pendientes');
        }
        
        await orden.update({ estado: 'cancelado' });
        
        return orden;
    }
}

export default new OrdenService();