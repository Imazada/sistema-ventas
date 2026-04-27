import { Notificacion, Usuario, Rol } from '../models/index.js';
import { Op } from 'sequelize';

class NotificacionService {
    async crearNotificacion(datos) {
        try {
            return await Notificacion.create(datos);
        } catch (error) {
            console.error('Error al crear notificación:', error);
        }
    }

    async notificarARol(rolNombre, datos) {
        try {
            const rol = await Rol.findOne({ where: { nombre: rolNombre } });
            if (!rol) return;

            const usuarios = await Usuario.findAll({ where: { rol_id: rol.id, activo: true } });
            
            const promesas = usuarios.map(u => this.crearNotificacion({
                ...datos,
                usuario_id: u.id,
                rol_destino: rolNombre
            }));

            await Promise.all(promesas);
        } catch (error) {
            console.error(`Error al notificar al rol ${rolNombre}:`, error);
        }
    }

    async obtenerNotificacionesUsuario(usuarioId, limit = 20) {
        return await Notificacion.findAll({
            where: { usuario_id: usuarioId },
            order: [['fecha_creacion', 'DESC']],
            limit
        });
    }

    async marcarComoLeida(id, usuarioId) {
        const notificacion = await Notificacion.findOne({
            where: { id, usuario_id: usuarioId }
        });
        if (notificacion) {
            await notificacion.update({ leida: true });
        }
        return notificacion;
    }

    async marcarTodasComoLeidas(usuarioId) {
        return await Notificacion.update(
            { leida: true },
            { where: { usuario_id: usuarioId, leida: false } }
        );
    }

    // Métodos específicos para los triggers de negocio
    async notificarCambioEstadoOrden(orden) {
        await this.crearNotificacion({
            usuario_id: orden.usuario_id,
            titulo: 'Actualización de Pedido',
            mensaje: `Tu pedido #${orden.numero_orden} ha cambiado a estado: ${orden.estado}`,
            tipo: 'info',
            link: `/mis-ordenes`,
            data_extra: { orden_id: orden.id, estado: orden.estado }
        });
    }

    async notificarStockBajo(producto) {
        const titulo = producto.stock_actual === 0 ? '¡URGENCIA: Stock Agotado!' : 'Alerta: Stock Bajo';
        const mensaje = producto.stock_actual === 0 
            ? `El producto ${producto.nombre} (SKU: ${producto.sku}) se ha agotado.`
            : `El producto ${producto.nombre} (SKU: ${producto.sku}) tiene stock bajo (${producto.stock_actual} unidades).`;
        
        await this.notificarARol('admin', {
            titulo,
            mensaje,
            tipo: producto.stock_actual === 0 ? 'error' : 'warning',
            link: `/productos`,
            data_extra: { producto_id: producto.id, sku: producto.sku }
        });
    }

    async notificarNuevaVenta(orden) {
        // Notificar a admin
        await this.notificarARol('admin', {
            titulo: 'Nueva Venta Realizada',
            mensaje: `Se ha generado una nueva venta #${orden.numero_orden} por un total de $${orden.total}`,
            tipo: 'success',
            link: `/gestion-ordenes`,
            data_extra: { orden_id: orden.id }
        });

        // Notificar a vendedor (órdenes pendientes)
        await this.notificarARol('vendedor', {
            titulo: 'Nueva Orden Pendiente',
            mensaje: `Hay una nueva orden #${orden.numero_orden} pendiente de procesar.`,
            tipo: 'info',
            link: `/gestion-ordenes`,
            data_extra: { orden_id: orden.id }
        });
    }
}

export default new NotificacionService();
