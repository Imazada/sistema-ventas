import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CarritoItem = sequelize.define('CarritoItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    carrito_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'carritos',
            key: 'id'
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'productos',
            key: 'id'
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.cantidad * this.precio_unitario;
        }
    }
}, {
    tableName: 'carrito_items',
    timestamps: true,
    createdAt: 'fecha_agregado',
    updatedAt: false
});

export default CarritoItem;