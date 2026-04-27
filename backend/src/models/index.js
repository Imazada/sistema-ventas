import sequelize from '../config/database.js';
import Producto from './Producto.js';
import Usuario from './Usuario.js';
import Rol from './Rol.js';
import Carrito from './Carrito.js';
import CarritoItem from './CarritoItem.js';
import Orden from './Orden.js';
import OrdenItem from './OrdenItem.js';
import Auditoria from './Auditoria.js';
import Notificacion from './Notificacion.js';

// Relaciones Usuario - Rol
Rol.hasMany(Usuario, { foreignKey: 'rol_id' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });

// Relaciones Usuario - Auditoria
Usuario.hasMany(Auditoria, { foreignKey: 'usuario_id', as: 'auditorias' });
Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Relaciones Usuario - Carrito
Usuario.hasOne(Carrito, { foreignKey: 'usuario_id' });
Carrito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relaciones Carrito - CarritoItem - Producto
Carrito.hasMany(CarritoItem, { foreignKey: 'carrito_id', as: 'items' });
CarritoItem.belongsTo(Carrito, { foreignKey: 'carrito_id' });
Producto.hasMany(CarritoItem, { foreignKey: 'producto_id' });
CarritoItem.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Relaciones Usuario - Orden
Usuario.hasMany(Orden, { foreignKey: 'usuario_id', as: 'ordenes' });
Orden.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Relaciones Orden - OrdenItem - Producto
Orden.hasMany(OrdenItem, { foreignKey: 'orden_id', as: 'items' });
OrdenItem.belongsTo(Orden, { foreignKey: 'orden_id' });
Producto.hasMany(OrdenItem, { foreignKey: 'producto_id' });
OrdenItem.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Relaciones Usuario - Notificacion
Usuario.hasMany(Notificacion, { foreignKey: 'usuario_id', as: 'notificaciones' });
Notificacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

export {
    sequelize,
    Producto,
    Usuario,
    Rol,
    Carrito,
    CarritoItem,
    Orden,
    OrdenItem,
    Auditoria,
    Notificacion
};
