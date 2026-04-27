import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { autenticar, autorizar } from '../middleware/auth.js';

// Mock de Usuario para evitar conexión real a DB
jest.unstable_mockModule('../models/Usuario.js', () => ({
    default: {
        findByPk: jest.fn()
    }
}));

// Importar dinámicamente después del mock
const Usuario = (await import('../models/Usuario.js')).default;

const app = express();
app.use(express.json());

// Endpoint de prueba
app.get('/test-admin', autenticar, autorizar(['admin']), (req, res) => {
    res.json({ message: 'Acceso Admin OK' });
});

app.get('/test-vendedor', autenticar, autorizar(['vendedor']), (req, res) => {
    res.json({ message: 'Acceso Vendedor OK' });
});

app.post('/test-producto', autenticar, autorizar(['admin']), (req, res) => {
    res.json({ message: 'Producto Creado' });
});

describe('Pruebas de Permisos y Roles', () => {
    const JWT_SECRET = process.env.JWT_SECRET || 'secret';
    
    beforeAll(() => {
        process.env.JWT_SECRET = JWT_SECRET;
    });

    test('Debe denegar acceso si no hay token', async () => {
        const res = await request(app).get('/test-admin');
        expect(res.statusCode).toBe(401);
    });

    test('Vendedor NO debe poder acceder a rutas de Admin', async () => {
        // Mock de usuario vendedor
        const token = jwt.sign({ id: 1 }, JWT_SECRET);
        
        Usuario.findByPk.mockImplementation((id, options) => {
            return Promise.resolve({
                id: 1,
                nombre: 'Test Vendedor',
                activo: true,
                rol: { nombre: 'vendedor', permisos: [] },
                toJSON: () => ({ id: 1, nombre: 'Test Vendedor', rol: { nombre: 'vendedor' } })
            });
        });

        const res = await request(app)
            .post('/test-producto')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(403);
    });

    test('Admin DEBE poder acceder a todas las rutas', async () => {
        const token = jwt.sign({ id: 2 }, JWT_SECRET);
        
        Usuario.findByPk.mockImplementation((id, options) => {
            return Promise.resolve({
                id: 2,
                nombre: 'Test Admin',
                activo: true,
                rol: { nombre: 'admin', permisos: ['all'] },
                toJSON: () => ({ id: 2, nombre: 'Test Admin', rol: { nombre: 'admin' } })
            });
        });

        const res = await request(app)
            .get('/test-admin')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Acceso Admin OK');
    });
});
