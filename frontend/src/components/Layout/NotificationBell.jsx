import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, ExternalLink, X } from 'lucide-react';
import { notificationsAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const response = await notificationsAPI.obtenerMisNotificaciones();
            if (response.data.success) {
                setNotifications(response.data.data);
                setUnreadCount(response.data.data.filter(n => !n.leida).length);
            }
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Polling cada 30 segundos
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationsAPI.marcarLeida(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsAPI.marcarTodasLeidas();
            fetchNotifications();
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
        }
    };

    const getTipoStyles = (tipo) => {
        switch (tipo) {
            case 'error': return 'bg-rose-100 text-rose-600';
            case 'warning': return 'bg-amber-100 text-amber-600';
            case 'success': return 'bg-emerald-100 text-emerald-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className={`p-2.5 rounded-xl transition-all duration-300 relative ${showDropdown ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'}`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 bg-rose-500 border-2 border-white text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '+9' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Notificaciones</p>
                            <p className="text-sm font-bold text-slate-800">{unreadCount} pendientes</p>
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllAsRead}
                                className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
                            >
                                <Check size={12} />
                                Marcar todas
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((notif) => (
                                    <div 
                                        key={notif.id} 
                                        className={`px-6 py-4 flex gap-4 hover:bg-slate-50 transition-colors relative group ${!notif.leida ? 'bg-primary-50/30' : ''}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${getTipoStyles(notif.tipo)}`}>
                                            <Bell size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className={`text-sm font-bold truncate ${!notif.leida ? 'text-slate-900' : 'text-slate-600'}`}>
                                                    {notif.titulo}
                                                </p>
                                                {!notif.leida && (
                                                    <button 
                                                        onClick={() => handleMarkAsRead(notif.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-primary-600 transition-all"
                                                        title="Marcar como leída"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                                                {notif.mensaje}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    {new Date(notif.fecha_creacion).toLocaleDateString()}
                                                </span>
                                                {notif.link && (
                                                    <Link 
                                                        to={notif.link}
                                                        onClick={() => {
                                                            setShowDropdown(false);
                                                            handleMarkAsRead(notif.id);
                                                        }}
                                                        className="text-[10px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                                                    >
                                                        Ver <ExternalLink size={10} />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <Bell size={32} />
                                </div>
                                <p className="text-sm font-bold text-slate-800 mb-1">Sin notificaciones</p>
                                <p className="text-xs text-slate-400 font-medium">Te avisaremos cuando pase algo importante</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
                        <button 
                            onClick={() => setShowDropdown(false)}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Cerrar panel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
