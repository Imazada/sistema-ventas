
import { Rol } from './src/models/index.js';
import sequelize from './src/config/database.js';

async function checkRoles() {
    try {
        await sequelize.authenticate();
        const roles = await Rol.findAll();
        console.log('Roles encontrados:', roles.map(r => ({ id: r.id, nombre: r.nombre })));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkRoles();
