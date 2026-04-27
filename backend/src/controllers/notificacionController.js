import NotificacionService from '../services/notificacionService.js';

class NotificacionController {
    async obtenerMisNotificaciones(req, res) {
        try {
            const notificaciones = await NotificacionService.obtenerNotificacionesUsuario(req.usuario.id);
            res.json({ success: true, data: notificaciones });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async marcarLeida(req, res) {
        try {
            const { id } = req.params;
            const notificacion = await NotificacionService.marcarComoLeida(id, req.usuario.id);
            res.json({ success: true, data: notificacion });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async marcarTodasLeidas(req, res) {
        try {
            await NotificacionService.marcarTodasComoLeidas(req.usuario.id);
            res.json({ success: true, mensaje: 'Todas las notificaciones marcadas como leídas' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new NotificacionController();
