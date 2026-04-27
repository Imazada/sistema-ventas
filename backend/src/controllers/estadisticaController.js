import EstadisticaService from '../services/estadisticaService.js';

class EstadisticaController {
    async obtenerMetricasTiempoReal(req, res) {
        try {
            const metricas = await EstadisticaService.obtenerMetricasTiempoReal();
            res.json({ success: true, data: metricas });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async obtenerEstadisticasDescriptivas(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            const estadisticas = await EstadisticaService.calcularEstadisticasVentas(fechaInicio, fechaFin);
            res.json({ success: true, data: estadisticas });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async obtenerRotacionInventario(req, res) {
        try {
            const rotacion = await EstadisticaService.calcularRotacionInventario();
            res.json({ success: true, data: rotacion });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async obtenerAnalisisCompleto(req, res) {
        try {
            const { fechaInicio, fechaFin, vendedorId, categoria } = req.query;
            const analisis = await EstadisticaService.obtenerAnalisisVentas({
                fechaInicio,
                fechaFin,
                vendedorId,
                categoria
            });
            res.json({ success: true, data: analisis });
        } catch (error) {
            console.error('Error en obtenerAnalisisCompleto:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default new EstadisticaController();