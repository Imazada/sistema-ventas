import express from 'express';
import ReportePDFService from '../services/reportePDFService.js';
import { autenticar, autorizar } from '../middleware/auth.js';
import { Orden } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/ventas', autenticar, autorizar(['admin']), async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const ordenes = await Orden.findAll({ where: { estado: 'entregado', fecha_creacion: { [Op.between]: [fechaInicio, fechaFin] } }, include: ['items'] });
        const pdf = await ReportePDFService.generarReporteVentas({ ordenes }, { inicio: fechaInicio, fin: fechaFin });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_ventas.pdf');
        res.send(pdf);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;