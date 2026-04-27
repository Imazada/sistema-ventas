import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Usuario, Rol, Carrito, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import CarritoService from '../services/carritoService.js';

class AuthController {
    async registrar(req, res) {
        try {
            const { email, password, nombre, apellido } = req.body;
            
            // Verificar si usuario existe
            const existe = await Usuario.findOne({ 
                where: sequelize.where(
                    sequelize.fn('lower', sequelize.col('email')),
                    sequelize.fn('lower', email)
                )
            });
            if (existe) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }
            
            // Hash de contraseña
            const password_hash = await bcrypt.hash(password, 10);
            
            // Obtener rol por defecto (comprador)
            const rolComprador = await Rol.findOne({ where: { nombre: 'comprador' } });
            
            const usuario = await Usuario.create({
                email: email.toLowerCase(),
                password_hash,
                nombre,
                apellido,
                rol_id: rolComprador.id,
                activo: true
            });
            
            // Crear token
            const token = jwt.sign(
                { id: usuario.id, email: usuario.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            // Si había carrito en sesión, fusionar
            const { sessionId } = req.body;
            if (sessionId) {
                await CarritoService.fusionarCarritos(usuario.id, sessionId);
            }
            
            res.status(201).json({
                success: true,
                token,
                usuario: {
                    id: usuario.id,
                    email: usuario.email,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    rol: rolComprador.nombre
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al registrar usuario' });
        }
    }
    
    async login(req, res) {
        try {
            const { email, password, sessionId } = req.body;
            
            const usuario = await Usuario.findOne({
                where: {
                    [Op.and]: [
                        sequelize.where(
                            sequelize.fn('lower', sequelize.col('email')),
                            sequelize.fn('lower', email)
                        ),
                        { activo: true }
                    ]
                },
                include: [{ model: Rol, as: 'rol' }]
            });
            
            if (!usuario) {
                console.log('Usuario no encontrado o inactivo:', email);
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const passwordValido = await usuario.validarPassword(password);
            console.log('Intento de login:', { email, passwordValido });

            if (!passwordValido) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            
            // Actualizar último acceso
            await usuario.update({ ultimo_acceso: new Date() });
            
            // Generar token
            const token = jwt.sign(
                { id: usuario.id, email: usuario.email, rol: usuario.rol.nombre },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            // Fusionar carrito de sesión si existe
            if (sessionId) {
                await CarritoService.fusionarCarritos(usuario.id, sessionId);
            }
            
            res.json({
                success: true,
                token,
                usuario: {
                    id: usuario.id,
                    email: usuario.email,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    rol: usuario.rol.nombre,
                    permisos: usuario.rol.permisos
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }
    
    async perfil(req, res) {
        try {
            const usuario = await Usuario.findByPk(req.usuario.id, {
                include: [{ model: Rol, as: 'rol' }],
                attributes: { exclude: ['password_hash'] }
            });
            
            res.json({ success: true, usuario });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener perfil' });
        }
    }
}

export default new AuthController();