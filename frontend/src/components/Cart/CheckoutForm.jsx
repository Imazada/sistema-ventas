import { useState } from 'react';
import { CreditCard, Truck, MapPin } from 'lucide-react';

const CheckoutForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        metodo_pago: 'tarjeta',
        direccion_envio: '',
        ciudad: '',
        codigo_postal: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            metodo_pago: formData.metodo_pago,
            direccion_envio: `${formData.direccion_envio}, ${formData.ciudad}, CP: ${formData.codigo_postal}`
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-slate-900 flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-blue-600" />
                    Información de Envío
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700">Dirección</label>
                        <div className="mt-1 relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                name="direccion_envio"
                                required
                                className="pl-10 block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={formData.direccion_envio}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Ciudad</label>
                        <input
                            type="text"
                            name="ciudad"
                            required
                            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.ciudad}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Código Postal</label>
                        <input
                            type="text"
                            name="codigo_postal"
                            required
                            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.codigo_postal}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-slate-900 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                    Método de Pago
                </h3>
                <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="metodo_pago"
                            value="tarjeta"
                            checked={formData.metodo_pago === 'tarjeta'}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-3 block text-sm font-medium text-slate-700">Tarjeta de Crédito / Débito</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="metodo_pago"
                            value="transferencia"
                            checked={formData.metodo_pago === 'transferencia'}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-3 block text-sm font-medium text-slate-700">Transferencia Bancaria</label>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
        </form>
    );
};

export default CheckoutForm;
