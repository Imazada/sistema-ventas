import OrderStatusBadge from './OrderStatusBadge';

const OrderList = ({ orders }) => {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-slate-200">
                {orders.map((order) => (
                    <li key={order.id}>
                        <div className="px-4 py-4 sm:px-6 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-blue-600 truncate">
                                    Pedido #{order.id.toString().padStart(5, '0')}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <OrderStatusBadge status={order.estado} />
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-slate-500">
                                        Total: <span className="ml-1 font-bold text-slate-900">${order.total}</span>
                                    </p>
                                    <p className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0 sm:ml-6">
                                        {order.items.length} productos
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                                    <p>
                                        Fecha: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
