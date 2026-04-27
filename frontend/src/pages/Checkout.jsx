import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { getImageUrl } from '../utils/formatters';
import { 
  CreditCard, 
  Truck, 
  CheckCircle, 
  ChevronLeft, 
  MapPin, 
  Phone, 
  User,
  ShoppingBag
} from 'lucide-react';

const Checkout = () => {
  const { items, totales, vaciarCarrito, cargarCarrito } = useCart();
  const { user: usuario } = useAuth();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [notas, setNotas] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('[DEBUG CHECKOUT] Iniciando confirmación de orden. Items en carrito:', items.length);
    
    if (items.length === 0) {
      alert('El carrito está vacío localmente');
      return;
    }
    
    setProcesando(true);
    try {
      const response = await ordersAPI.crearOrden({
        metodo_pago: metodoPago,
        notas
      });
      
      if (response.data.success) {
        alert('¡Orden creada exitosamente!');
        await vaciarCarrito();
        navigate('/mis-ordenes');
      }
    } catch (error) {
      console.error('Error al crear orden:', error);
      alert(error.response?.data?.error || 'Error al procesar la orden');
    } finally {
      setProcesando(false);
    }
  };

  if (items.length === 0 && !procesando) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Carrito Vacío</h2>
        <p className="text-gray-600 mb-6">No hay productos para continuar con la compra</p>
        <button
          onClick={() => navigate('/productos')}
          className="btn-primary"
        >
          Ver Productos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Checkout */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck size={20} />
                Información de Envío
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    value={usuario?.nombre}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Apellido</label>
                  <input
                    type="text"
                    value={usuario?.apellido}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={usuario?.email}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Método de Pago
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pago"
                    value="tarjeta"
                    checked={metodoPago === 'tarjeta'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Tarjeta de Crédito/Débito</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pago"
                    value="paypal"
                    checked={metodoPago === 'paypal'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>PayPal</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pago"
                    value="transferencia"
                    checked={metodoPago === 'transferencia'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Transferencia Bancaria</span>
                </label>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium mb-1">Notas adicionales</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows="3"
                className="input-field"
                placeholder="Instrucciones de entrega, etc."
              />
            </div>
          </form>
        </div>
        
        {/* Resumen de Orden */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Resumen de Orden</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4 pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center text-sm">
                  <div className="w-12 h-12 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {item.producto?.imagen_url ? (
                      <img 
                        src={getImageUrl(item.producto.imagen_url)} 
                        alt={item.producto.nombre} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300">{item.producto?.sku?.substring(0, 4)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{item.producto?.nombre || 'Producto'}</p>
                    <p className="text-slate-500 text-xs">Cant: {item.cantidad}</p>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${(item.cantidad * item.precio_unitario).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
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
                <span className="text-blue-600">${totales.total.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={procesando}
              className="w-full mt-6 btn-primary flex items-center justify-center gap-2"
            >
              {procesando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Confirmar Orden
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Al confirmar, aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;