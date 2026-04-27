import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, TrendingUp } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(email, password);
            // Redirigir según el rol de forma robusta
            const userRole = user.rol?.nombre || user.rol;
            if (userRole === 'admin' || user.rol_id === 1) {
                navigate('/', { replace: true });
            } else if (userRole === 'vendedor') {
                // El vendedor podría ir al dashboard o a productos según tu preferencia
                // Por ahora lo enviamos al dashboard como al admin
                navigate('/', { replace: true });
            } else {
                navigate('/productos', { replace: true });
            }
        } catch (error) { 
            setError('Credenciales inválidas. Por favor intenta de nuevo.'); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center bg-primary-600 p-4 rounded-3xl shadow-xl shadow-primary-600/20 mb-6">
                        <TrendingUp className="text-white h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                        Inventario<span className="text-primary-600">Pro</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Gestión inteligente para tu negocio</p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                        <LogIn className="text-primary-600" size={24} />
                        <h2 className="text-2xl font-bold text-slate-800">Bienvenido</h2>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-sm font-bold mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="ejemplo@correo.com" 
                                className="input-field" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                            <input 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••" 
                                className="input-field" 
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-2"
                        > 
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Ingresando...</span>
                                </>
                            ) : 'Iniciar Sesión'} 
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            ¿No tienes cuenta? <Link to="/register" className="text-primary-600 font-bold hover:underline ml-1">Regístrate gratis</Link>
                        </p>
                    </div>
                </div>
                
                <p className="text-center mt-8 text-slate-400 text-xs font-medium">
                    &copy; 2026 InventarioPro. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default Login;