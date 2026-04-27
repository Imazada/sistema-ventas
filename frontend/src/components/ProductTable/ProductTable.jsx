import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { productoAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../utils/formatters';
import ProductForm from './ProductForm';
import DeleteConfirm from './DeleteConfirm';
import ToastNotification from '../Common/ToastNotification';
import LoadingSpinner from '../Common/LoadingSpinner';

const ProductTable = () => {
  const { isAdmin, isVendedor } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(10);
  
  // Mostrar/ocultar filtros
  const [showFilters, setShowFilters] = useState(false);

  const cargarCategorias = async () => {
    try {
      const response = await productoAPI.obtenerCategorias();
      setCategorias(response.data.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const params = { busqueda };
      if (categoriaFiltro) params.categoria = categoriaFiltro;
      
      const response = await productoAPI.obtenerTodos(params);
      setProductos(response.data.data);
      setPaginaActual(1);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      mostrarToast('Error al cargar los productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cargarProductos();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [busqueda, categoriaFiltro]);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });
  };

  const handleEliminar = async () => {
    try {
      await productoAPI.eliminar(deletingProduct.id);
      await cargarProductos();
      setDeletingProduct(null);
      mostrarToast('Producto eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error al eliminar:', error);
      mostrarToast(error.response?.data?.error || 'Error al eliminar el producto', 'error');
    }
  };

  const handleGuardar = async (datos) => {
    try {
      if (editingProduct) {
        await productoAPI.actualizar(editingProduct.id, datos);
        mostrarToast('Producto actualizado exitosamente', 'success');
      } else {
        await productoAPI.crear(datos);
        mostrarToast('Producto creado exitosamente', 'success');
      }
      await cargarProductos();
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarToast(error.response?.data?.error || 'Error al guardar el producto', 'error');
    }
  };

  // Lógica de paginación
  const indexOfLastItem = paginaActual * itemsPorPagina;
  const indexOfFirstItem = indexOfLastItem - itemsPorPagina;
  const currentItems = productos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productos.length / itemsPorPagina);

  const paginate = (pageNumber) => setPaginaActual(pageNumber);

  if (loading) return <LoadingSpinner mensaje="Cargando productos..." />;

  return (
    <div>
      {toast && (
        <ToastNotification
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por SKU, nombre o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-gray-300 text-gray-600'} hover:bg-gray-50`}
          >
            <Filter size={20} />
          </button>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Producto
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-semibold mb-3">Filtros avanzados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="input-field"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCategoriaFiltro('');
                  setBusqueda('');
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Venta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Actual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Mínimo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              currentItems.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                      {producto.imagen_url ? (
                        <img 
                          src={getImageUrl(producto.imagen_url)} 
                          alt={producto.nombre} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{producto.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.categoria}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${parseFloat(producto.precio_venta).toFixed(2)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${producto.stock_actual < producto.stock_minimo ? 'text-red-600' : 'text-gray-900'}`}>
                    {producto.stock_actual}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.stock_minimo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setEditingProduct(producto);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(producto)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, productos.length)} de {productos.length} productos
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="px-3 py-1 rounded border bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-3 py-1">
                Página {paginaActual} de {totalPages}
              </span>
              <button
                onClick={() => paginate(paginaActual + 1)}
                disabled={paginaActual === totalPages}
                className="px-3 py-1 rounded border bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm
          producto={editingProduct}
          onSave={handleGuardar}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {deletingProduct && (
        <DeleteConfirm
          producto={deletingProduct}
          onConfirm={handleEliminar}
          onCancel={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductTable;