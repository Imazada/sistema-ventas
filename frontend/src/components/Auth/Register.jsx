import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) { setError('Las contraseñas no coinciden'); return; }
        setLoading(true); setError('');
        try { await register(formData); navigate('/'); } catch (error) { setError('Error al registrar usuario'); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div className="text-center"><UserPlus className="mx-auto h-12 w-12 text-blue-600" /><h2 className="mt-6 text-3xl font-bold">Registro</h2></div>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" required placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="input-field" />
                        <input type="text" required placeholder="Apellido" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} className="input-field" />
                    </div>
                    <input type="email" required placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
                    <input type="password" required placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" />
                    <input type="password" required placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="input-field" />
                    <button type="submit" disabled={loading} className="w-full btn-primary"> {loading ? 'Registrando...' : 'Registrarse'} </button>
                </form>
                <p className="text-center">¿Ya tienes cuenta? <Link to="/login" className="text-blue-600">Inicia Sesión</Link></p>
            </div>
        </div>
    );
};
export default Register;