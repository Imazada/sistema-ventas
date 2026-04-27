import React from 'react';
import { Calendar, Filter, Download } from 'lucide-react';

const ReportFilters = ({ 
  categoria, 
  setCategoria, 
  fechaInicio, 
  setFechaInicio, 
  fechaFin, 
  setFechaFin,
  categorias,
  onGenerar 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Filter size={18} />
        Filtros del Reporte
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="input-field"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="input-field"
          />
        </div>
        
        <div className="flex items-end">
          <button
            onClick={onGenerar}
            className="btn-primary flex items-center gap-2 w-full"
          >
            <Download size={18} />
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;