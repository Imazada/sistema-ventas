import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notificacion = sequelize.define('Notificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // null puede significar para todos los admins o rol específico si se maneja así
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    rol_destino: {
        type: DataTypes.STRING(50),
        allowNull: true // admin, vendedor, cliente
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('info', 'warning', 'error', 'success'),
        defaultValue: 'info'
    },
    leida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    link: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    data_extra: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    tableName: 'notificaciones',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
});

export default Notificacion;
