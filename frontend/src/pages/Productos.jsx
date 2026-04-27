import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, Package } from 'lucide-react';
import ProductTable from '../components/ProductTable/ProductTable';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { productoAPI } from '../services/api';
import { getImageUrl } from '../utils/formatters';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ToastNotification from '../components/Common/ToastNotification';

const Productos = () => {
  const { isAdmin, isVendedor, user } = useAuth();
  const { agregarItem } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    console.log('[DEBUG PRODUCTOS] Estado de roles:', { isAdmin, isVendedor, userRole: user?.rol?.nombre || user?.rol });
    if (!isAdmin && !isVendedor) {
      cargarDatos();
    }
  }, [isAdmin, isVendedor]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productoAPI.obtenerTodos(),
        productoAPI.obtenerCategorias()
      ]);
      setProductos(prodRes.data.data);
      setCategorias(catRes.data.data);
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
      setToast({ mensaje: 'Error al cargar los productos', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (producto) => {
    try {
      const result = await agregarItem(producto.id, 1);
      if (result.success) {
        setToast({ mensaje: `${producto.nombre} agregado al carrito`, tipo: 'success' });
      } else {
        setToast({ mensaje: result.error || 'Error al agregar al carrito', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error en handleAddToCart:', error);
      setToast({ mensaje: 'Error al procesar la solicitud', tipo: 'error' });
    }
  };

  const filteredProducts = productos.filter(p => {
    const matchesBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                           p.sku.toLowerCase().includes(busqueda.toLowerCase());
    const matchesCategoria = !categoria || p.categoria === categoria;
    return matchesBusqueda && matchesCategoria;
  });

  if (isAdmin || isVendedor) {
    return (
      <div className="pb-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            {isAdmin ? 'Gestión de' : 'Control de'} <span className="text-primary-600">{isAdmin ? 'Inventario' : 'Stock'}</span>
          </h1>
          <p className="text-slate-500 mt-2">Bienvenido, {user?.nombre}. Administra los productos del sistema.</p>
        </div>
        <ProductTable />
      </div>
    );
  }

  if (loading) return <LoadingSpinner mensaje="Cargando catálogo..." />;

  return (
    <div className="pb-12">
      {toast && (
        <ToastNotification
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Catálogo de <span className="text-primary-600">Productos</span>
        </h1>
        <p className="text-slate-500 mt-2">Bienvenido, {user?.nombre}. Explora nuestra tienda virtual.</p>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-600 font-medium"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-600 font-medium appearance-none"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((producto) => (
          <div 
            key={producto.id} 
            className="group bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-primary-600/10 transition-all duration-500 flex flex-col"
          >
            <div className="aspect-square bg-slate-50 relative overflow-hidden">
              {producto.imagen_url ? (
                <img 
                  src={getImageUrl(producto.imagen_url)} 
                  alt={producto.nombre} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200">
                  <Package size={64} />
                </div>
              )}
              {producto.stock_actual <= 0 && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-black text-sm uppercase tracking-widest">Agotado</span>
                </div>
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                  {producto.categoria}
                </span>
                <span className="text-slate-400 text-xs font-bold">{producto.sku}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                {producto.nombre}
              </h3>
              
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">
                {producto.descripcion}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Precio</span>
                  <span className="text-2xl font-black text-slate-800">${producto.precio_venta}</span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(producto)}
                  disabled={producto.stock_actual <= 0}
                  className={`
                    p-4 rounded-2xl transition-all duration-300
                    ${producto.stock_actual > 0 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:scale-110 active:scale-95' 
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
                  `}
                >
                  <ShoppingCart size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-3xl mb-6">
            <Search className="text-slate-300" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No encontramos productos</h3>
          <p className="text-slate-500">Intenta con otros términos de búsqueda o categoría.</p>
        </div>
      )}
    </div>
  );
};

export default Productos;