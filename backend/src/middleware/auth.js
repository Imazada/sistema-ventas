import jwt from 'jsonwebtoken';
import { Usuario, Rol } from '../models/index.js';

export const autenticar = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id, {
            include: [{ model: Rol, as: 'rol' }]
        });
        
        if (!usuario || !usuario.activo) {
            throw new Error();
        }
        
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ error: 'No autorizado' });
    }
};

export const autorizar = (permisosRequeridos = []) => {
    return (req, res, next) => {
        const usuario = req.usuario;
        
        if (!usuario) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        
        // Admin tiene todos los permisos
        if (usuario.rol?.nombre === 'admin') {
            return next();
        }

        // Si los permisos requeridos son nombres de roles
        const rolesPermitidos = permisosRequeridos.filter(p => ['admin', 'vendedor', 'cliente', 'comprador'].includes(p));
        if (rolesPermitidos.length > 0) {
            const userRole = usuario.rol?.nombre;
            // Normalizar 'comprador' y 'cliente' si se usan indistintamente
            if (rolesPermitidos.includes(userRole) || 
                (rolesPermitidos.includes('comprador') && userRole === 'cliente') ||
                (rolesPermitidos.includes('cliente') && userRole === 'comprador')) {
                return next();
            }
        }
        
        const permisosUsuario = usuario.rol?.permisos || [];
        
        const tienePermiso = permisosRequeridos.every(permiso => 
            permisosUsuario.includes(permiso) || permisosUsuario.includes('*')
        );
        
        if (!tienePermiso) {
            return res.status(403).json({ error: 'Permisos insuficientes' });
        }
        
        next();
    };
};