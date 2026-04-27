import React, { useState, useEffect } from 'react';
import KPICards from '../components/Dashboard/KPICards';
import BarrasCategorias from '../components/Dashboard/BarrasCategorias';
import PastelInventario from '../components/Dashboard/PastelInventario';
import TablaBajoStock from '../components/Dashboard/TablaBajoStock';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ToastNotification from '../components/Common/ToastNotification';
import ExportButtons from '../components/Dashboard/ExportButtons';
import { productoAPI, estadisticasAPI, usuariosAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Calendar, 
  User, 
  Tag, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Percent,
  BarChart3,
  Package
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const Dashboard = () => {
  const { isAdmin, isVendedor, user } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
  const [analisis, setAnalisis] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filtros
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    vendedorId: '',
    categoria: ''
  });

  useEffect(() => {
    if (isAdmin || isVendedor) {
      cargarDatosIniciales();
    }
  }, [isAdmin, isVendedor]);

  useEffect(() => {
    if (isAdmin) {
      cargarAnalisis();
    }
  }, [filtros]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const [estRes, userRes, catRes] = await Promise.all([
        productoAPI.obtenerEstadisticas(),
        isAdmin ? usuariosAPI.listar({ rol: 'vendedor' }) : Promise.resolve({ data: { data: [] } }),
        productoAPI.obtenerCategorias()
      ]);
      setEstadisticas(estRes.data.data);
      setVendedores(userRes.data.data);
      setCategorias(catRes.data.data);
      
      if (isAdmin) {
        await cargarAnalisis();
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      setToast({ mensaje: 'Error al cargar datos del panel', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const cargarAnalisis = async () => {
    try {
      const response = await estadisticasAPI.obtenerAnalisisCompleto(filtros);
      setAnalisis(response.data.data);
    } catch (error) {
      console.error('Error al cargar análisis:', error);
    }
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

  if (loading) return <LoadingSpinner mensaje="Cargando panel de control..." />;

  return (
    <div className="pb-12">
      {toast && (
        <ToastNotification
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Panel de <span className="text-primary-600">Control</span>
          </h1>
          <p className="text-slate-500 mt-2">Visión general del estado de tu inventario y análisis de ventas.</p>
        </div>
        <ExportButtons 
          onExportPDF={() => setToast({ mensaje: 'Exportando PDF...', tipo: 'info' })} 
          onExportExcel={() => setToast({ mensaje: 'Función en desarrollo', tipo: 'warning' })} 
        />
      </div>

      {/* Resumen de Inventario (Original) */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6 text-slate-800">
          <Package className="text-primary-600" size={24} />
          <h2 className="text-2xl font-black">Resumen de <span className="text-primary-600">Inventario</span></h2>
        </div>
        
        <div className="mb-8">
          <KPICards kpis={estadisticas?.kpis} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <BarrasCategorias datos={estadisticas?.topCategorias} />
          <PastelInventario datos={estadisticas?.distribucionValor} />
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <TablaBajoStock productos={estadisticas?.productosBajoStock} />
        </div>
      </div>

      {isAdmin && (
        <div className="mb-10 pt-10 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <TrendingUp className="text-primary-600" size={24} />
            <h2 className="text-2xl font-black">Análisis de <span className="text-primary-600">Ventas</span></h2>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <BarChart3 className="text-primary-600" size={24} />
              <h2 className="text-xl font-black">Filtros de Análisis</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vendedor</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select 
                    className="input-field pl-10 py-2 text-sm"
                    value={filtros.vendedorId}
                    onChange={(e) => setFiltros({...filtros, vendedorId: e.target.value})}
                  >
                    <option value="">Todos</option>
                    {vendedores.map(v => (
                      <option key={v.id} value={v.id}>{v.nombre} {v.apellido}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoría</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select 
                    className="input-field pl-10 py-2 text-sm"
                    value={filtros.categoria}
                    onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                  >
                    <option value="">Todas</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Desde</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="date" 
                    className="input-field pl-10 py-2 text-sm"
                    value={filtros.fechaInicio}
                    onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hasta</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="date" 
                    className="input-field pl-10 py-2 text-sm"
                    value={filtros.fechaFin}
                    onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KPIs de Ventas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-4 rounded-2xl text-primary-600">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ventas Diarias</p>
                  <h3 className="text-2xl font-black text-slate-800">${analisis?.promedioVentasDiarias || '0.00'}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
                  <Percent size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tasa Conversión</p>
                  <h3 className="text-2xl font-black text-slate-800">{analisis?.kpis?.tasaConversion || '0'}%</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ticket Promedio</p>
                  <h3 className="text-2xl font-black text-slate-800">${analisis?.kpis?.ticketPromedio || '0.00'}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Gráfico de Tendencias */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-800">Tendencia de <span className="text-primary-600">Ventas</span></h3>
                <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                  <ArrowUpRight size={16} />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analisis?.tendenciaDiaria || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="fecha" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#6366f1" 
                      strokeWidth={4} 
                      dot={{fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#fff'}}
                      activeDot={{r: 6, strokeWidth: 0}}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Producto más vendido */}
            <div className="bg-primary-600 p-8 rounded-[2.5rem] shadow-xl shadow-primary-600/30 text-white flex flex-col">
              <h3 className="text-xl font-black mb-6">Producto <span className="opacity-60">Estrella</span></h3>
              {analisis?.productoMasVendido ? (
                <div className="flex-1 flex flex-col justify-center text-center">
                  <div className="bg-white/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                    <Package size={48} />
                  </div>
                  <h4 className="text-2xl font-black mb-2">{analisis.productoMasVendido.nombre}</h4>
                  <p className="text-primary-100 font-bold mb-8">{analisis.productoMasVendido.sku}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Unidades</p>
                      <p className="text-xl font-black">{analisis.productoMasVendido.unidades}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Ingresos</p>
                      <p className="text-xl font-black">${parseFloat(analisis.productoMasVendido.ingresos).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center opacity-60 font-bold italic">
                  Sin datos suficientes
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Ventas por Categoría */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-8">Ventas por <span className="text-primary-600">Categoría</span></h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analisis?.kpis?.ventasPorCategoria || []}
                      dataKey="total"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {(analisis?.kpis?.ventasPorCategoria || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {(analisis?.kpis?.ventasPorCategoria || []).map((cat, index) => (
                  <div key={cat.categoria} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                    <span className="text-xs font-bold text-slate-600">{cat.categoria}</span>
                    <span className="text-xs text-slate-400 ml-auto">${parseFloat(cat.total).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mejores Márgenes */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-8">Mayor <span className="text-primary-600">Rentabilidad</span></h3>
              <div className="space-y-6">
                {(analisis?.kpis?.productosMayorMargen || []).map((prod, index) => (
                  <div key={prod.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-primary-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800">{prod.nombre}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{prod.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-500">+${parseFloat(prod.margenTotal).toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Margen Total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;