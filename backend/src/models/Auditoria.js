import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Auditoria = sequelize.define('Auditoria', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    accion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tabla: {
        type: DataTypes.STRING,
        allowNull: false
    },
    registro_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    detalles: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'auditoria',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false
});

export default Auditoria;
