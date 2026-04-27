import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ToastNotification from '../components/Common/ToastNotification';
import { 
  ShoppingBag, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GestionOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cargarOrdenes();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filtroEstado, busqueda, fechaInicio, fechaFin, paginaActual]);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const params = {
        page: paginaActual,
        limit: 10
      };
      if (filtroEstado) params.estado = filtroEstado;
      if (busqueda) params.busqueda = busqueda;
      if (fechaInicio) params.fechaInicio = fechaInicio;
      if (fechaFin) params.fechaFin = fechaFin;
      
      const response = await ordersAPI.obtenerTodas(params);
      setOrdenes(response.data.ordenes || response.data.data || []);
      setTotalPaginas(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      setToast({ mensaje: 'Error al cargar las órdenes', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (ordenId, nuevoEstado) => {
    try {
      await ordersAPI.actualizarEstado(ordenId, nuevoEstado);
      setToast({ mensaje: `Orden #${ordenId} actualizada a ${nuevoEstado}`, tipo: 'success' });
      cargarOrdenes();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setToast({ mensaje: 'Error al actualizar el estado de la orden', tipo: 'error' });
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return <Clock className="text-amber-500" size={18} />;
      case 'pagado': return <CheckCircle className="text-blue-500" size={18} />;
      case 'enviado': return <Truck className="text-indigo-500" size={18} />;
      case 'entregado': return <CheckCircle className="text-green-500" size={18} />;
      case 'cancelado': return <XCircle className="text-red-500" size={18} />;
      default: return null;
    }
  };

  const getStatusBadgeClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'pagado': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'enviado': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'entregado': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelado': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading && ordenes.length === 0) return <LoadingSpinner mensaje="Cargando órdenes..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (
        <ToastNotification
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <ShoppingBag className="text-primary-600" size={32} />
              Gestión de Órdenes
            </h1>
            <p className="text-slate-500 mt-1">Administra y procesa los pedidos de los clientes</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Búsqueda</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="N° Orden, cliente, email..."
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full transition-all text-sm"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Estado</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all w-full text-sm"
                value={filtroEstado}
                onChange={(e) => {
                  setFiltroEstado(e.target.value);
                  setPaginaActual(1);
                }}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Desde</label>
            <input
              type="date"
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full transition-all text-sm"
              value={fechaInicio}
              onChange={(e) => {
                setFechaInicio(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Hasta</label>
            <input
              type="date"
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full transition-all text-sm"
              value={fechaFin}
              onChange={(e) => {
                setFechaFin(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Orden</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ordenes.length > 0 ? (
                ordenes.map((orden) => (
                  <tr key={orden.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-700">#{orden.numero_orden}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{orden.usuario?.nombre} {orden.usuario?.apellido}</span>
                        <span className="text-xs text-slate-500">{orden.usuario?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(orden.fecha_creacion).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">${parseFloat(orden.total).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(orden.estado)}`}>
                        {getStatusIcon(orden.estado)}
                        {orden.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/orden/${orden.id}`}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Ver detalle"
                        >
                          <Eye size={20} />
                        </Link>
                        
                        <div className="relative group/actions">
                          <select
                            className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg border-none focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer appearance-none pr-8"
                            value={orden.estado}
                            onChange={(e) => handleCambiarEstado(orden.id, e.target.value)}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="pagado">Pagado</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ArrowRight size={14} className="rotate-90" />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                    {loading ? 'Cargando...' : 'No se encontraron órdenes con los filtros seleccionados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">
              Página {paginaActual} de {totalPaginas}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionOrdenes;