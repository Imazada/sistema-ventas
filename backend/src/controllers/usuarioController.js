import { Usuario, Rol, Auditoria, sequelize } from '../models/index.js';
import bcrypt from 'bcryptjs';

class UsuarioController {
    async listarUsuarios(req, res) {
        try {
            const { rol } = req.query;
            const where = {};
            
            const include = [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre']
            }];

            if (rol) {
                include[0].where = { nombre: rol };
            } else {
                // Por defecto, excluir clientes si no se especifica rol
                include[0].where = { 
                    nombre: ['admin', 'vendedor', 'Administrador', 'Vendedor'] 
                };
            }

            const usuarios = await Usuario.findAll({
                where,
                include,
                attributes: { exclude: ['password_hash'] },
                order: [['nombre', 'ASC']]
            });

            res.json({ success: true, data: usuarios });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async crearUsuario(req, res) {
        const t = await sequelize.transaction();
        try {
            const { nombre, apellido, email, password, rol_id } = req.body;

            // Validar duplicado
            const existe = await Usuario.findOne({ where: { email } });
            if (existe) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }

            const password_hash = await bcrypt.hash(password, 10);
            const usuario = await Usuario.create({
                nombre,
                apellido,
                email,
                password_hash,
                rol_id,
                activo: true
            }, { transaction: t });

            // Auditoría
            await Auditoria.create({
                usuario_id: req.usuario.id,
                accion: 'CREAR_USUARIO',
                tabla: 'usuarios',
                registro_id: usuario.id.toString(),
                detalles: { nombre, apellido, email, rol_id },
                ip_address: req.ip
            }, { transaction: t });

            await t.commit();
            res.status(201).json({ success: true, data: usuario });
        } catch (error) {
            await t.rollback();
            res.status(400).json({ error: error.message });
        }
    }

    async actualizarUsuario(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { nombre, apellido, email, rol_id, activo } = req.body;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Validar duplicado si cambia email
            if (email && email !== usuario.email) {
                const existe = await Usuario.findOne({ where: { email } });
                if (existe) {
                    return res.status(400).json({ error: 'El email ya está en uso' });
                }
            }

            const cambios = {};
            if (nombre && nombre !== usuario.nombre) cambios.nombre = { de: usuario.nombre, a: nombre };
            if (apellido && apellido !== usuario.apellido) cambios.apellido = { de: usuario.apellido, a: apellido };
            if (email && email !== usuario.email) cambios.email = { de: usuario.email, a: email };
            if (rol_id && rol_id !== usuario.rol_id) cambios.rol_id = { de: usuario.rol_id, a: rol_id };
            if (activo !== undefined && activo !== usuario.activo) cambios.activo = { de: usuario.activo, a: activo };

            await usuario.update({
                nombre: nombre || usuario.nombre,
                apellido: apellido || usuario.apellido,
                email: email || usuario.email,
                rol_id: rol_id || usuario.rol_id,
                activo: activo !== undefined ? activo : usuario.activo
            }, { transaction: t });

            // Auditoría
            if (Object.keys(cambios).length > 0) {
                await Auditoria.create({
                    usuario_id: req.usuario.id,
                    accion: 'ACTUALIZAR_USUARIO',
                    tabla: 'usuarios',
                    registro_id: id,
                    detalles: cambios,
                    ip_address: req.ip
                }, { transaction: t });
            }

            await t.commit();
            res.json({ success: true, data: usuario });
        } catch (error) {
            await t.rollback();
            res.status(400).json({ error: error.message });
        }
    }

    async obtenerRoles(req, res) {
        try {
            const roles = await Rol.findAll({
                where: {
                    nombre: ['admin', 'vendedor', 'Administrador', 'Vendedor']
                }
            });
            res.json({ success: true, data: roles });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new UsuarioController();
