import ProductoService from '../services/productoService.js';
import { Auditoria } from '../models/index.js';

class ProductoController {
    async obtenerTodos(req, res) {
        try {
            const { busqueda, categoria } = req.query;
            const productos = await ProductoService.obtenerTodos({ busqueda, categoria });
            res.json({ success: true, data: productos });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    
    async obtenerPorId(req, res) {
        try {
            const producto = await ProductoService.obtenerPorId(req.params.id);
            res.json({ success: true, data: producto });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    
    async crear(req, res) {
        try {
            const datos = { ...req.body };
            if (req.file) {
                datos.imagen_url = `/uploads/productos/${req.file.filename}`;
            }

            const producto = await ProductoService.crear(datos);
            
            // Auditoría
            await Auditoria.create({
                usuario_id: req.usuario.id,
                accion: 'CREAR_PRODUCTO',
                tabla: 'productos',
                registro_id: producto.id.toString(),
                detalles: datos,
                ip_address: req.ip
            });

            res.status(201).json({ success: true, data: producto, mensaje: 'Producto creado exitosamente' });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    
    async actualizar(req, res) {
        try {
            const datos = { ...req.body };
            if (req.file) {
                datos.imagen_url = `/uploads/productos/${req.file.filename}`;
            }

            const producto = await ProductoService.actualizar(req.params.id, datos);
            
            // Auditoría
            await Auditoria.create({
                usuario_id: req.usuario.id,
                accion: 'ACTUALIZAR_PRODUCTO',
                tabla: 'productos',
                registro_id: req.params.id,
                detalles: datos,
                ip_address: req.ip
            });

            res.json({ success: true, data: producto, mensaje: 'Producto actualizado exitosamente' });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    
    async eliminar(req, res) {
        try {
            await ProductoService.eliminar(req.params.id);
            
            // Auditoría
            await Auditoria.create({
                usuario_id: req.usuario.id,
                accion: 'ELIMINAR_PRODUCTO',
                tabla: 'productos',
                registro_id: req.params.id,
                detalles: { activo: false },
                ip_address: req.ip
            });

            res.json({ success: true, mensaje: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    
    async obtenerEstadisticas(req, res) {
        try {
            const estadisticas = await ProductoService.obtenerEstadisticas();
            res.json({ success: true, data: estadisticas });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new ProductoController();