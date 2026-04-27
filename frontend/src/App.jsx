import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';

// Páginas públicas
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Páginas privadas
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Reportes from './pages/Reportes';
import Checkout from './pages/Checkout';
import MisOrdenes from './pages/MisOrdenes';
import OrdenDetalle from './pages/OrdenDetalle';
import GestionOrdenes from './pages/GestionOrdenes';
import GestionUsuarios from './pages/GestionUsuarios';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas para Administradores y Vendedores (Gestión) */}
            <Route element={<PrivateRoute allowedRoles={['admin', 'vendedor']} />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/gestion-ordenes" element={<GestionOrdenes />} />
              </Route>
            </Route>
            
            {/* Rutas exclusivas para Administradores */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route element={<Layout />}>
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
              </Route>
            </Route>

            {/* Rutas para Clientes, Vendedores y Admins (Catálogo y Compra) */}
            <Route element={<PrivateRoute allowedRoles={['comprador', 'cliente', 'admin', 'vendedor']} />}>
              <Route element={<Layout />}>
                <Route path="/productos" element={<Productos />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/mis-ordenes" element={<MisOrdenes />} />
                <Route path="/orden/:id" element={<OrdenDetalle />} />
              </Route>
            </Route>
            
            {/* Redirección inteligente por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;