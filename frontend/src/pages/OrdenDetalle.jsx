import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import OrderDetailComponent from '../components/Orders/OrderDetail';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ToastNotification from '../components/Common/ToastNotification';
import { ArrowLeft } from 'lucide-react';

const OrdenDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orden, setOrden] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        cargarOrden();
    }, [id]);

    const cargarOrden = async () => {
        try {
            setLoading(true);
            const response = await ordersAPI.obtenerOrdenPorId(id);
            setOrden(response.data.data);
        } catch (error) {
            console.error('Error al cargar la orden:', error);
            setToast({ mensaje: 'Error al cargar los detalles de la orden', tipo: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner mensaje="Cargando detalles de la orden..." />;

    if (!orden) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500 mb-4">No se encontró la orden solicitada.</p>
                <button 
                    onClick={() => navigate('/mis-ordenes')}
                    className="text-primary-600 font-bold hover:underline"
                >
                    Volver a mis órdenes
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {toast && (
                <ToastNotification
                    mensaje={toast.mensaje}
                    tipo={toast.tipo}
                    onClose={() => setToast(null)}
                />
            )}

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Volver</span>
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Detalle de <span className="text-primary-600">Orden</span></h1>
                <p className="text-slate-500">Información detallada de tu compra.</p>
            </div>

            <OrderDetailComponent order={orden} />
        </div>
    );
};

export default OrdenDetalle;
