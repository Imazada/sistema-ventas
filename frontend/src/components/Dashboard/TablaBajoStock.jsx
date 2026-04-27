import React from 'react';
import { AlertCircle } from 'lucide-react';

const TablaBajoStock = ({ productos }) => {
  if (!productos || productos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Productos que Necesitan Reordenar</h3>
        <div className="flex items-center justify-center py-8 text-green-600">
          <AlertCircle size={24} className="mr-2" />
          <p>¡Excelente! Todos los productos tienen stock suficiente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Productos que Necesitan Reordenar</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Mínimo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{producto.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{producto.stock_actual}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{producto.stock_minimo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{producto.categoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaBajoStock;