import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(null);
    const [items, setItems] = useState([]);
    const [totales, setTotales] = useState({ subtotal: 0, impuesto: 0, total: 0 });
    const [loading, setLoading] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const [sessionId, setSessionId] = useLocalStorage('cart_session_id', null);
    
    // Cargar carrito al iniciar o cambiar usuario
    useEffect(() => {
        cargarCarrito();
    }, [isAuthenticated, user, sessionId]);
    
    const cargarCarrito = async () => {
        setLoading(true);
        try {
            let response;
            if (isAuthenticated && user) {
                response = await cartAPI.obtenerCarrito(user.id);
            } else {
                response = await cartAPI.obtenerCarrito(null, sessionId);
                if (response.data.data && !sessionId) {
                    setSessionId(response.data.data.session_id);
                }
            }
            
            if (response.data.data) {
                const cartData = response.data.data;
                setCarrito(cartData);
                
                // Si el backend ya incluye los items en el include, los usamos directamente
                // o llamamos a calcularTotales que devuelve items + totales actualizados
                const totalesCalc = await cartAPI.calcularTotales(cartData.id);
                if (totalesCalc.data.data) {
                    const { subtotal, impuesto, total, items: itemsActualizados } = totalesCalc.data.data;
                    setTotales({ subtotal, impuesto, total });
                    setItems(itemsActualizados || []);
                }
            }
        } catch (error) {
            console.error('Error cargando carrito:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const agregarItem = async (productoId, cantidad) => {
        setLoading(true);
        try {
            const response = await cartAPI.agregarItem(carrito.id, productoId, cantidad);
            await cargarCarrito();
            return { success: true };
        } catch (error) {
            console.error('Error agregando item:', error);
            return { success: false, error: error.response?.data?.error || 'Error al agregar' };
        } finally {
            setLoading(false);
        }
    };
    
    const actualizarCantidad = async (itemId, cantidad) => {
        setLoading(true);
        try {
            await cartAPI.actualizarCantidad(carrito.id, itemId, cantidad);
            await cargarCarrito();
        } catch (error) {
            console.error('Error actualizando cantidad:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const eliminarItem = async (itemId) => {
        setLoading(true);
        try {
            await cartAPI.eliminarItem(carrito.id, itemId);
            await cargarCarrito();
        } catch (error) {
            console.error('Error eliminando item:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const vaciarCarrito = async () => {
        setLoading(true);
        try {
            await cartAPI.vaciarCarrito(carrito.id);
            await cargarCarrito();
        } catch (error) {
            console.error('Error vaciando carrito:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const valorContexto = {
        carrito,
        items,
        totales,
        loading,
        isCartOpen,
        setIsCartOpen,
        agregarItem,
        actualizarCantidad,
        eliminarItem,
        vaciarCarrito,
        cargarCarrito
    };
    
    return (
        <CartContext.Provider value={valorContexto}>
            {children}
        </CartContext.Provider>
    );
};