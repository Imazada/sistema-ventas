import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Menu, 
  X,
  TrendingUp,
  ShoppingBag,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { isAdmin, isVendedor, isCliente } = useAuth();

  const menuItems = [
    // Menú para Administradores y Vendedores
    { path: '/', nombre: 'Panel de Control', icon: LayoutDashboard, roles: ['admin', 'vendedor'] },
    { path: '/reportes', nombre: 'Reportes', icon: FileText, roles: ['admin'] },
    { path: '/gestion-usuarios', nombre: 'Usuarios', icon: Users, roles: ['admin'] },
    
    // Gestión de Órdenes (Vendedor y Admin)
    { path: '/gestion-ordenes', nombre: 'Gestión Órdenes', icon: ShoppingBag, roles: ['admin', 'vendedor'] },
    
    // Menú para Clientes y Acceso General (Productos)
    { path: '/productos', nombre: 'Catálogo', icon: Package },
    { path: '/mis-ordenes', nombre: 'Mis Órdenes', icon: ShoppingBag, roles: ['cliente', 'comprador'] },
  ];

  const filteredItems = menuItems.filter(item => {
    if (!item.roles) return true; // Público
    if (isAdmin && item.roles.includes('admin')) return true;
    if (isVendedor && item.roles.includes('vendedor')) return true;
    // Si el usuario es cliente
    if (isCliente && (item.roles.includes('cliente') || item.roles.includes('comprador'))) return true;
    return false;
  });

  return (
    <div className={`${collapsed ? 'w-20' : 'w-72'} bg-slate-900 shadow-2xl transition-all duration-500 ease-in-out flex flex-col relative z-20`}>
      <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 p-2 rounded-xl shadow-lg shadow-primary-500/20">
              <TrendingUp className="text-white" size={20} />
            </div>
            <span className="font-black text-xl text-white tracking-tight">Inventario<span className="text-primary-400">Pro</span></span>
          </div>
        )}
        {collapsed && (
          <div className="bg-primary-500 p-2 rounded-xl shadow-lg shadow-primary-500/20 mx-auto">
            <TrendingUp className="text-white" size={20} />
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <Icon size={22} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary-400'} transition-colors`} />
              {!collapsed && <span className="font-bold text-sm tracking-wide">{item.nombre}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-3 hover:bg-slate-800 rounded-xl text-slate-500 transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <div className="flex items-center gap-2"><X size={20} /> <span className="text-xs font-bold uppercase tracking-widest">Colapsar</span></div>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
