import React, { useState } from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CartIcon from '../Cart/CartIcon';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout, isAdmin, isVendedor } = useAuth();

  const getRoleDisplay = () => {
    if (isAdmin) return 'Administrador';
    if (isVendedor) return 'Vendedor';
    return 'Cliente';
  };

  const getTitleDisplay = () => {
    if (isAdmin) return 'Panel de Administración';
    if (isVendedor) return 'Panel de Gestión';
    return 'Catálogo de Productos';
  };

  const getSubtitleDisplay = () => {
    if (isAdmin) return 'Gestión Global';
    if (isVendedor) return 'Control de Inventario y Órdenes';
    return 'Explora nuestra tienda';
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 sticky top-0 z-30">
      <div className="flex justify-between items-center max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-2 h-6 bg-primary-600 rounded-full"></span>
            {getTitleDisplay()}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            {getSubtitleDisplay()}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {!isAdmin && !isVendedor && (
              <div className="relative group">
                <CartIcon />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-wider">Carrito</span>
              </div>
            )}
            
            <div className="relative group">
              <NotificationBell />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-wider">Notificaciones</span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-100 hidden md:block"></div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`
                flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all duration-300
                ${showMenu ? 'bg-slate-100' : 'hover:bg-slate-50'}
              `}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center text-white font-bold text-sm">
                {user?.nombre?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user?.nombre || 'Usuario'}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getRoleDisplay()}</p>
              </div>
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 py-4 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-6 py-4 border-b border-slate-50 mb-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Mi Cuenta</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                  </div>

                  <div className="px-3 space-y-1">
                    <button className="w-full px-4 py-3 rounded-xl text-left text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-600 flex items-center gap-3 transition-colors group">
                      <div className="p-2 bg-slate-50 group-hover:bg-primary-50 rounded-lg transition-colors">
                        <User size={18} />
                      </div>
                      Mi Perfil
                    </button>
                    <button className="w-full px-4 py-3 rounded-xl text-left text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-600 flex items-center gap-3 transition-colors group">
                      <div className="p-2 bg-slate-50 group-hover:bg-primary-50 rounded-lg transition-colors">
                        <Settings size={18} />
                      </div>
                      Configuración
                    </button>
                  </div>

                  <div className="mx-3 my-3 border-t border-slate-50 pt-3">
                    <button 
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 rounded-xl text-left text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors group"
                    >
                      <div className="p-2 bg-rose-50 group-hover:bg-rose-100 rounded-lg transition-colors">
                        <LogOut size={18} />
                      </div>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;