import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar modelos desde index para establecer relaciones correctamente
import { 
    sequelize, 
    Usuario, 
    Rol, 
    Producto, 
    Carrito, 
    CarritoItem, 
    Orden, 
    OrdenItem 
} from './models/index.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import productosRoutes from './routes/productos.js';
import categoriasRoutes from './routes/categorias.js';
import carritoRoutes from './routes/carrito.js';
import ordenesRoutes from './routes/ordenes.js';
import estadisticasRoutes from './routes/estadisticas.js';
import reportesRoutes from './routes/reportes.js';
import usuariosRoutes from './routes/usuarios.js';
import notificacionesRoutes from './routes/notificaciones.js';

// Importar middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

// Manejador de errores
app.use(errorHandler);

// Iniciar servidor
const iniciarServidor = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL establecida');
        
        // Intentar limpiar conflictos de columnas generadas en PostgreSQL antes de sincronizar
        try {
            await sequelize.query('ALTER TABLE IF EXISTS carrito_items DROP COLUMN IF EXISTS subtotal;');
            console.log('🧹 Limpieza de columnas generadas completada');
        } catch (err) {
            console.log('⚠️ Nota: No se pudo eliminar la columna subtotal (posiblemente no existe o la tabla no existe aún)');
        }

        // Usar alter: true para asegurar que las tablas reflejen los modelos
        await sequelize.sync({ alter: true });
        console.log('✅ Modelos sincronizados con alter:true');

        // Crear roles básicos si no existen
        try {
            const [adminRol] = await Rol.findOrCreate({
                where: { nombre: 'admin' },
                defaults: { descripcion: 'Administrador del sistema', permisos: ['all'] }
            });
            const [compradorRol] = await Rol.findOrCreate({
                where: { nombre: 'comprador' },
                defaults: { descripcion: 'Cliente de la tienda', permisos: ['read', 'buy'] }
            });
            const [vendedorRol] = await Rol.findOrCreate({
                where: { nombre: 'vendedor' },
                defaults: { descripcion: 'Vendedor de la tienda', permisos: ['read', 'manage_orders'] }
            });

            console.log('Roles verificados:', { 
                adminId: adminRol.id, 
                compradorId: compradorRol.id,
                vendedorId: vendedorRol.id 
            });

            // Crear usuario admin de prueba si no existe
            const adminExist = await Usuario.findOne({ where: { email: 'admin@sistema.com' } });
            if (!adminExist) {
                const password_hash = await bcrypt.hash('admin123', 10);
                await Usuario.create({
                    email: 'admin@sistema.com',
                    password_hash,
                    nombre: 'Admin',
                    apellido: 'Sistema',
                    rol_id: adminRol.id,
                    activo: true
                });
                console.log('👤 Usuario admin@sistema.com creado con contraseña: admin123');
            } else {
                // Forzar actualización de contraseña y rol para asegurar que sea admin
                const password_hash = await bcrypt.hash('admin123', 10);
                await adminExist.update({ 
                    password_hash, 
                    rol_id: adminRol.id,
                    activo: true 
                });
                console.log('👤 Usuario admin@sistema.com actualizado (contraseña: admin123, rol: admin)');
            }

            // Crear usuario vendedor de prueba si no existe
            const vendedorExist = await Usuario.findOne({ where: { email: 'vendedor@sistema.com' } });
            if (!vendedorExist) {
                const password_hash = await bcrypt.hash('vendedor123', 10);
                await Usuario.create({
                    email: 'vendedor@sistema.com',
                    password_hash,
                    nombre: 'Vendedor',
                    apellido: 'Prueba',
                    rol_id: vendedorRol.id,
                    activo: true
                });
                console.log('👤 Usuario vendedor@sistema.com creado con contraseña: vendedor123');
            } else {
                // Forzar actualización de contraseña y rol para asegurar que sea vendedor
                const password_hash = await bcrypt.hash('vendedor123', 10);
                await vendedorExist.update({ 
                    password_hash, 
                    rol_id: vendedorRol.id,
                    activo: true 
                });
                console.log('👤 Usuario vendedor@sistema.com actualizado (contraseña: vendedor123, rol: vendedor)');
            }
        } catch (error) {
            console.error('❌ Error inicializando datos:', error);
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

iniciarServidor();