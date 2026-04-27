import OrdenService from '../services/ordenService.js';

class OrdenController {
    async crearOrden(req, res) {
        try {
            const orden = await OrdenService.crearOrden(req.usuario.id);
            res.status(201).json({ success: true, data: orden });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
    
    async obtenerOrdenes(req, res) {
        try {
            const { estado, page = 1, limit = 10, busqueda, fechaInicio, fechaFin } = req.query;
            const filtros = { estado, busqueda, fechaInicio, fechaFin };
            
            let ordenes;
            const rol = req.usuario.rol?.nombre?.toLowerCase();
            if (rol === 'admin' || rol === 'vendedor') {
                ordenes = await OrdenService.obtenerTodas(filtros, page, limit);
            } else {
                ordenes = await OrdenService.obtenerPorUsuario(req.usuario.id, filtros, page, limit);
            }
            
            res.json({ success: true, ...ordenes });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener órdenes' });
        }
    }
    
    async obtenerOrdenPorId(req, res) {
        try {
            const orden = await OrdenService.obtenerPorId(req.params.id);
            
            // Verificar permisos
            const rol = req.usuario.rol?.nombre?.toLowerCase();
            if (rol !== 'admin' && rol !== 'vendedor' && orden.usuario_id !== req.usuario.id) {
                return res.status(403).json({ error: 'No autorizado' });
            }
            
            res.json({ success: true, data: orden });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    
    async actualizarEstado(req, res) {
        try {
            const { estado } = req.body;
            const orden = await OrdenService.actualizarEstado(req.params.id, estado);
            res.json({ success: true, data: orden });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    async cancelarOrden(req, res) {
        try {
            const orden = await OrdenService.cancelarOrden(req.params.id);
            res.json({ success: true, data: orden });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new OrdenController();