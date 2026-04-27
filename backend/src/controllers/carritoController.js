import CarritoService from '../services/carritoService.js';

class CarritoController {
    async obtenerCarrito(req, res) {
        try {
            const { usuarioId, sessionId } = req.query;
            const carrito = await CarritoService.obtenerCarrito(usuarioId || req.usuario?.id, sessionId);
            res.json({ success: true, data: carrito });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async agregarItem(req, res) {
        try {
            const { carritoId } = req.params;
            const { productoId, cantidad } = req.body;
            const item = await CarritoService.agregarItem(parseInt(carritoId), productoId, cantidad);
            res.json({ success: true, data: item });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    async actualizarCantidad(req, res) {
        try {
            const { carritoId, itemId } = req.params;
            const { cantidad } = req.body;
            await CarritoService.actualizarCantidad(parseInt(carritoId), parseInt(itemId), cantidad);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    async eliminarItem(req, res) {
        try {
            const { carritoId, itemId } = req.params;
            await CarritoService.eliminarItem(parseInt(carritoId), parseInt(itemId));
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    async vaciarCarrito(req, res) {
        try {
            const { carritoId } = req.params;
            await CarritoService.vaciarCarrito(parseInt(carritoId));
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    async calcularTotales(req, res) {
        try {
            const { carritoId } = req.params;
            const totales = await CarritoService.calcularTotales(parseInt(carritoId));
            res.json({ success: true, data: totales });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new CarritoController();