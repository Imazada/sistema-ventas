import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CartSidebar from '../Cart/CartSidebar';
import { useCart } from '../../contexts/CartContext';

const Layout = () => {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-6 lg:p-10">
            <Outlet />
          </div>
          
          {/* Decoración de fondo sutil */}
          <div className="fixed top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
          <div className="fixed bottom-0 left-0 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2"></div>
        </main>
      </div>
      
      {/* Mover el Carrito aquí para que esté fuera del flujo del main y sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Layout;
