const OrderStatusBadge = ({ status }) => {
    const styles = {
        pendiente: 'bg-yellow-100 text-yellow-800',
        pagado: 'bg-green-100 text-green-800',
        enviado: 'bg-blue-100 text-blue-800',
        entregado: 'bg-purple-100 text-purple-800',
        cancelado: 'bg-red-100 text-red-800'
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || styles.pendiente}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default OrderStatusBadge;
