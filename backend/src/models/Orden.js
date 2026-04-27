import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Orden = sequelize.define('Orden', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_orden: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'pendiente',
        validate: {
            isIn: [['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']]
        }
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    impuesto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    metodo_pago: {
        type: DataTypes.STRING(50)
    },
    notas: {
        type: DataTypes.TEXT
    },
    fecha_completada: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'ordenes',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
});

export default Orden;