import { getImageUrl } from '../../utils/formatters';

const OrderDetail = ({ order }) => {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
                <h3 className="text-lg leading-6 font-medium text-slate-900">
                    Detalle del Pedido #{order.id}
                </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
                <div className="flow-root">
                    <ul className="-my-6 divide-y divide-slate-200">
                        {order.items.map((item) => (
                            <li key={item.id} className="py-6 flex">
                                <div className="flex-shrink-0 w-16 h-16 border border-slate-200 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                                    {item.producto.imagen_url ? (
                                        <img 
                                            src={getImageUrl(item.producto.imagen_url)} 
                                            alt={item.producto.nombre} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs font-bold text-slate-400">{item.producto.sku}</span>
                                    )}
                                </div>
                                <div className="ml-4 flex-1 flex flex-col">
                                    <div className="flex justify-between text-base font-medium text-slate-900">
                                        <h4>{item.producto.nombre}</h4>
                                        <p className="ml-4">${item.subtotal}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {item.cantidad} x ${item.precio_unitario}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="px-4 py-4 sm:px-6 bg-slate-50 border-t border-slate-200 text-right">
                <p className="text-sm text-slate-500">Total pagado</p>
                <p className="text-2xl font-bold text-slate-900">${order.total}</p>
            </div>
        </div>
    );
};

export default OrderDetail;
