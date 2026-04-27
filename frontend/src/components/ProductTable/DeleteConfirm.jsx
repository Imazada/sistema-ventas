import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirm = ({ producto, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex items-center gap-3 mb-4 text-red-600">
          <AlertTriangle size={32} />
          <h2 className="text-xl font-bold">Confirmar Eliminación</h2>
        </div>
        
        <p className="mb-6">
          ¿Estás seguro de que deseas eliminar el producto "{producto.nombre}" (SKU: {producto.sku})?
          <br />
          <span className="text-sm text-gray-500">Esta acción no se puede deshacer.</span>
        </p>
        
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-danger">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;