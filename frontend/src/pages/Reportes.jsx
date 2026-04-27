import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, Filter } from 'lucide-react';
import { productoAPI } from '../services/api';
import reporteService from '../services/reporteService';

const Reportes = () => {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await productoAPI.obtenerTodos();
      setProductos(response.data.data);
      const cats = [...new Set(response.data.data.map(p => p.categoria))];
      setCategorias(cats);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar los productos');
    }
  };

  const generarReporteOperacional = async () => {
    setLoading(true);
    try {
      let productosFiltrados = productos;
      if (categoriaSeleccionada !== 'Todas') {
        productosFiltrados = productos.filter(p => p.categoria === categoriaSeleccionada);
      }

      reporteService.generarReporteOperacional(productosFiltrados, categoriaSeleccionada);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const generarReporteGestion = async () => {
    setLoading(true);
    try {
      const statsResponse = await productoAPI.obtenerEstadisticas();
      const estadisticas = statsResponse.data.data;
      
      reporteService.generarReporteGestion(
        estadisticas.kpis,
        estadisticas.topCategorias,
        estadisticas.productosBajoStock
      );
    } catch (error) {
      console.error('Error al generar reporte de gestión:', error);
      alert('Error al generar el reporte de gestión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Generación de Reportes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-blue-600" size={28} />
            <h2 className="text-xl font-semibold">Reporte Operacional</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Genera un listado detallado del inventario actual en formato PDF.
            Incluye SKU, nombre, stock actual y valor total.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Filtrar por categoría</label>
            <div className="flex gap-2">
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="input-field flex-1"
              >
                <option value="Todas">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={generarReporteOperacional}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <FileText size={18} />
                Generar PDF
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-600" size={28} />
            <h2 className="text-xl font-semibold">Reporte de Gestión</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Reporte estratégico para toma de decisiones. Incluye KPIs,
            análisis de categorías y productos con bajo stock.
          </p>
          
          <button
            onClick={generarReporteGestion}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <TrendingUp size={18} />
            Generar Reporte de Gestión
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Generando reporte...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;