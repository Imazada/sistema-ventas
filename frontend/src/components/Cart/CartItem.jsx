import { Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { getImageUrl } from '../../utils/formatters';

const CartItem = ({ item }) => {
    const { removeFromCart } = useCart();

    return (
        <li className="py-6 flex">
            <div className="flex-shrink-0 w-24 h-24 border border-slate-200 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                {item.producto.imagen_url ? (
                    <img 
                        src={getImageUrl(item.producto.imagen_url)} 
                        alt={item.producto.nombre} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-slate-400 text-xs font-bold">{item.producto.sku}</span>
                )}
            </div>

            <div className="ml-4 flex-1 flex flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-slate-900">
                        <h3>{item.producto.nombre}</h3>
                        <p className="ml-4">${(item.cantidad * item.producto.precio_venta).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.producto.categoria}</p>
                </div>
                <div className="flex-1 flex items-end justify-between text-sm">
                    <p className="text-slate-500">Cant: {item.cantidad}</p>
                    <div className="flex">
                        <button
                            onClick={() => removeFromCart(item.producto_id)}
                            className="font-medium text-red-600 hover:text-red-500 flex items-center"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CartItem;
