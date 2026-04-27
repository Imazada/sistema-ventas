import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isAdmin = user?.rol?.nombre === 'admin' || user?.rol === 'admin';
    const isVendedor = user?.rol?.nombre === 'vendedor' || user?.rol === 'vendedor';
    const isCliente = user?.rol?.nombre === 'cliente' || user?.rol?.nombre === 'comprador' || user?.rol === 'cliente' || user?.rol === 'comprador';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            cargarPerfil();
        } else {
            setLoading(false);
        }
    }, []);

    const cargarPerfil = async () => {
        try {
            const response = await authAPI.perfil();
            // Asegurarse de que el objeto usuario tenga el rol correctamente estructurado
            const usuarioData = response.data.usuario;
            setUser(usuarioData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, usuario } = response.data;
            
            localStorage.setItem('token', token);
            setUser(usuario);
            setIsAuthenticated(true);
            
            // Retornar el usuario para que el componente de Login pueda redirigir
            return usuario;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const register = async (data) => {
        const response = await authAPI.registrar(data);
        localStorage.setItem('token', response.data.token);
        setUser(response.data.usuario);
        setIsAuthenticated(true);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return ( <AuthContext.Provider value={{ user, usuario: user, loading, isAuthenticated, isAdmin, isVendedor, isCliente, login, register, logout }}> {children} </AuthContext.Provider> );
};