import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Power, Search, Filter } from 'lucide-react';
import { usuariosAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ToastNotification from '../components/Common/ToastNotification';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Filtros
  const [filtroRol, setFiltroRol] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol_id: '',
    activo: true
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [userRes, roleRes] = await Promise.all([
        usuariosAPI.listar(),
        usuariosAPI.obtenerRoles()
      ]);
      setUsuarios(userRes.data.data);
      setRoles(roleRes.data.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      mostrarToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: '', // No se edita password aquí por simplicidad
      rol_id: usuario.rol_id,
      activo: usuario.activo
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usuariosAPI.actualizar(editingUser.id, formData);
        mostrarToast('Usuario actualizado con éxito');
      } else {
        await usuariosAPI.crear(formData);
        mostrarToast('Usuario creado con éxito');
      }
      setShowForm(false);
      setEditingUser(null);
      cargarDatos();
    } catch (error) {
      mostrarToast(error.response?.data?.error || 'Error al procesar solicitud', 'error');
    }
  };

  const toggleActivo = async (usuario) => {
    try {
      await usuariosAPI.actualizar(usuario.id, { activo: !usuario.activo });
      mostrarToast(`Usuario ${usuario.activo ? 'desactivado' : 'activado'} correctamente`);
      cargarDatos();
    } catch (error) {
      mostrarToast('Error al cambiar estado del usuario', 'error');
    }
  };

  const filteredUsers = usuarios.filter(u => {
    const matchesBusqueda = (u.nombre + ' ' + u.apellido + ' ' + u.email).toLowerCase().includes(busqueda.toLowerCase());
    const matchesRol = !filtroRol || u.rol?.nombre === filtroRol;
    return matchesBusqueda && matchesRol;
  });

  if (loading) return <LoadingSpinner mensaje="Cargando usuarios..." />;

  return (
    <div className="pb-12">
      {toast && <ToastNotification {...toast} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Gestión de <span className="text-primary-600">Usuarios</span>
          </h1>
          <p className="text-slate-500 mt-2">Administra los accesos de vendedores y administradores.</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setFormData({ nombre: '', apellido: '', email: '', password: '', rol_id: '', activo: true });
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            className="input-field pl-10"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            className="input-field pl-10"
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="vendedor">Vendedores</option>
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Usuario</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Rol</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Estado</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map(usuario => (
              <tr key={usuario.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{usuario.nombre} {usuario.apellido}</span>
                    <span className="text-xs text-slate-400">{usuario.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    usuario.rol?.nombre === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {usuario.rol?.nombre}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs font-bold ${usuario.activo ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${usuario.activo ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(usuario)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => toggleActivo(usuario)}
                      className={`p-2 rounded-lg transition-all ${
                        usuario.activo ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={usuario.activo ? 'Desactivar' : 'Activar'}
                    >
                      <Power size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-800 mb-6">
              {editingUser ? 'Editar' : 'Crear'} <span className="text-primary-600">Usuario</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Nombre</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Apellido</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Contraseña</label>
                  <input
                    type="password"
                    required
                    className="input-field"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Rol</label>
                <select
                  required
                  className="input-field"
                  value={formData.rol_id}
                  onChange={(e) => setFormData({...formData, rol_id: e.target.value})}
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary px-8">
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;
