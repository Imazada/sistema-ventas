import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { Calendar, Package, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MisOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const navigate = useNavigate();

  const estados = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    pagado: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800'
  };

  const cargarOrdenes = async () => {
    setLoading(true);
    try {
      const params = estadoFiltro ? { estado: estadoFiltro } : {};
      const response = await ordersAPI.obtenerOrdenes(params);
      console.log('[DEBUG ORDERS] Respuesta API:', response.data);
      
      // Ajuste para manejar la estructura de datos que devuelve el backend
      if (response.data.success) {
        setOrdenes(response.data.ordenes || []);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      alert('Error al cargar el historial de órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, [estadoFiltro]);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Órdenes</h1>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setEstadoFiltro('')}
            className={`px-4 py-2 rounded-lg transition-colors ${!estadoFiltro ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Todas
          </button>
          {Object.keys(estados).map(estado => (
            <button
              key={estado}
              onClick={() => setEstadoFiltro(estado)}
              className={`px-4 py-2 rounded-lg transition-colors ${estadoFiltro === estado ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Lista de órdenes */}
      {ordenes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay órdenes</h3>
          <p className="text-gray-500 mb-4">Aún no has realizado ninguna compra</p>
          <button
            onClick={() => navigate('/productos')}
            className="btn-primary"
          >
            Comenzar a Comprar
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {ordenes.map((orden) => (
            <div key={orden.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Orden #{orden.numero_orden}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatearFecha(orden.fecha_creacion)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estados[orden.estado]}`}>
                    {orden.estado.toUpperCase()}
                  </span>
                  <p className="text-xl font-bold text-blue-600 mt-2">
                    ${parseFloat(orden.total).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Productos:</h4>
                <div className="space-y-2">
                  {orden.items?.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.producto?.nombre} x {item.cantidad}</span>
                      <span>${parseFloat(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                  {orden.items?.length > 3 && (
                    <p className="text-sm text-gray-500">
                      + {orden.items.length - 3} productos más
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => navigate(`/orden/${orden.id}`)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <Eye size={16} />
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisOrdenes;