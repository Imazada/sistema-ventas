import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    registrar: (data) => api.post('/auth/registrar', data),
    login: (data) => api.post('/auth/login', data),
    perfil: () => api.get('/auth/perfil')
};

export const productoAPI = {
    obtenerTodos: (params) => api.get('/productos', { params }),
    obtenerPorId: (id) => api.get(`/productos/${id}`),
    crear: (data) => {
        if (data instanceof FormData) {
            return api.post('/productos', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return api.post('/productos', data);
    },
    actualizar: (id, data) => {
        if (data instanceof FormData) {
            return api.put(`/productos/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return api.put(`/productos/${id}`, data);
    },
    eliminar: (id) => api.delete(`/productos/${id}`),
    obtenerEstadisticas: () => api.get('/productos/estadisticas'),
    obtenerCategorias: () => api.get('/categorias')
};

export const cartAPI = {
    obtenerCarrito: (usuarioId = null, sessionId = null) => {
        const params = {};
        if (usuarioId) params.usuarioId = usuarioId;
        if (sessionId) params.sessionId = sessionId;
        return api.get('/carrito', { params });
    },
    agregarItem: (carritoId, productoId, cantidad) => 
        api.post(`/carrito/${carritoId}/items`, { productoId, cantidad }),
    actualizarCantidad: (carritoId, itemId, cantidad) => 
        api.put(`/carrito/${carritoId}/items/${itemId}`, { cantidad }),
    eliminarItem: (carritoId, itemId) => 
        api.delete(`/carrito/${carritoId}/items/${itemId}`),
    vaciarCarrito: (carritoId) => 
        api.delete(`/carrito/${carritoId}/vaciar`),
    calcularTotales: (carritoId) => 
        api.get(`/carrito/${carritoId}/totales`)
};

export const ordersAPI = {
    crearOrden: (data) => api.post('/ordenes', data),
    obtenerOrdenes: (params) => api.get('/ordenes/historial', { params }),
    obtenerTodas: (params) => api.get('/ordenes', { params }), // Nueva ruta para gestión
    obtenerOrdenPorId: (id) => api.get(`/ordenes/${id}`),
    actualizarEstado: (id, estado) => api.put(`/ordenes/${id}/estado`, { estado }),
    cancelarOrden: (id) => api.put(`/ordenes/${id}/cancelar`)
};

export const reportsAPI = {
    generarReporteVentas: (params) => api.get('/reportes/ventas', { params, responseType: 'blob' }),
    generarReporteInventario: () => api.get('/reportes/inventario', { responseType: 'blob' })
};

export const estadisticasAPI = {
    obtenerMetricasTiempoReal: () => api.get('/estadisticas/metricas-tiempo-real'),
    obtenerEstadisticasDescriptivas: (params) => api.get('/estadisticas/estadisticas-descriptivas', { params }),
    obtenerRotacionInventario: () => api.get('/estadisticas/rotacion-inventario'),
    obtenerAnalisisCompleto: (params) => api.get('/estadisticas/analisis-completo', { params })
};

export const usuariosAPI = {
    listar: (params) => api.get('/usuarios', { params }),
    crear: (data) => api.post('/usuarios', data),
    actualizar: (id, data) => api.put(`/usuarios/${id}`, data),
    obtenerRoles: () => api.get('/usuarios/roles')
};

export const notificationsAPI = {
    obtenerMisNotificaciones: () => api.get('/notificaciones'),
    marcarLeida: (id) => api.put(`/notificaciones/${id}/leida`),
    marcarTodasLeidas: () => api.put('/notificaciones/marcar-todas-leidas')
};

export default api;