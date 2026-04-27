import React, { useState } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, totales, loading, actualizarCantidad, eliminarItem, vaciarCarrito } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      onClose();
      return;
    }
    
    setProcesando(true);
    try {
      navigate('/checkout');
      onClose();
    } finally {
      setProcesando(false);
    }
  };

  const handleActualizarCantidad = async (itemId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      await eliminarItem(itemId);
    } else {
      await actualizarCantidad(itemId, nuevaCantidad);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-primary-50 p-2.5 rounded-xl">
                <ShoppingCart size={22} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Mi Carrito</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{items.length} productos seleccionados</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.producto.nombre}</h3>
                      <p className="text-sm text-gray-600">
                        ${parseFloat(item.precio_unitario).toFixed(2)} c/u
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleActualizarCantidad(item.id, item.cantidad - 1)}
                          className="p-1 bg-white rounded border hover:bg-gray-100"
                          disabled={loading}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <button
                          onClick={() => handleActualizarCantidad(item.id, item.cantidad + 1)}
                          className="p-1 bg-white rounded border hover:bg-gray-100"
                          disabled={loading}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.cantidad * item.precio_unitario).toFixed(2)}
                      </p>
                      <button
                        onClick={() => eliminarItem(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${totales.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (21%):</span>
                  <span>${totales.impuesto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary-600">${totales.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => vaciarCarrito()}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm"
                  disabled={loading}
                >
                  Vaciar
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={procesando || loading}
                  className="flex-[2] px-4 py-3 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all text-sm disabled:opacity-50"
                >
                  {procesando ? 'Procesando...' : 'Finalizar Compra'}
                </button>
              </div>
              
              {!isAuthenticated && (
                <p className="text-xs text-center text-gray-500">
                  Inicia sesión para guardar tu carrito y ver tu historial de compras
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;