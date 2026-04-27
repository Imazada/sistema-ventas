import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ReportePDFService {
    async generarReporteVentas(datos, rangoFechas) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.on('error', reject);
            
            // Encabezado
            doc.fontSize(20)
                .text('Reporte de Ventas - Sistema de Gestión', { align: 'center' })
                .moveDown();
            
            doc.fontSize(12)
                .text(`Período: ${rangoFechas.inicio} al ${rangoFechas.fin}`, { align: 'center' })
                .text(`Fecha generación: ${new Date().toLocaleString()}`, { align: 'center' })
                .moveDown(2);
            
            // KPIs principales
            doc.fontSize(14).text('Resumen de Ventas', { underline: true }).moveDown(0.5);
            
            const kpis = [
                { label: 'Total Ventas', value: `$${datos.resumen.totalVentas}` },
                { label: 'Ingresos Totales', value: `$${datos.resumen.ingresosTotales}` },
                { label: 'Ticket Promedio', value: `$${datos.resumen.ticketPromedio}` },
                { label: 'Productos Vendidos', value: datos.resumen.productosVendidos }
            ];
            
            let y = doc.y;
            kpis.forEach((kpi, index) => {
                const x = 50 + (index * 130);
                doc.rect(x, y, 120, 60).stroke();
                doc.fontSize(10).text(kpi.label, x + 10, y + 10);
                doc.fontSize(14).text(kpi.value, x + 10, y + 30);
            });
            
            doc.moveDown(4);
            
            // Tabla de productos más vendidos
            doc.fontSize(14).text('Top 10 Productos Más Vendidos', { underline: true }).moveDown(0.5);
            
            const tableTop = doc.y;
            let tableY = tableTop;
            
            // Encabezados tabla
            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Producto', 50, tableY);
            doc.text('Cantidad', 300, tableY);
            doc.text('Ingresos', 400, tableY);
            
            doc.moveTo(50, tableY + 15).lineTo(550, tableY + 15).stroke();
            
            doc.font('Helvetica');
            tableY += 20;
            
            datos.topProductos.forEach((producto, index) => {
                if (tableY > 700) {
                    doc.addPage();
                    tableY = 50;
                }
                
                doc.text(`${index + 1}. ${producto.nombre}`, 50, tableY, { width: 200 });
                doc.text(producto.cantidad.toString(), 310, tableY);
                doc.text(`$${producto.ingresos}`, 410, tableY);
                tableY += 20;
            });
            
            // Gráfico ASCII (simulado) - En producción usar Chart.js o similar
            doc.addPage();
            doc.fontSize(14).text('Estadísticas Descriptivas', { underline: true }).moveDown(0.5);
            
            doc.fontSize(10);
            doc.text(`Media de ventas: $${datos.estadisticas.media}`, 50, doc.y);
            doc.text(`Mediana: $${datos.estadisticas.mediana}`, 50, doc.y + 20);
            doc.text(`Moda: [${datos.estadisticas.moda.join(', ')}]`, 50, doc.y + 40);
            doc.text(`Desviación estándar: $${datos.estadisticas.desviacionEstandar}`, 50, doc.y + 60);
            doc.text(`Percentil 25: $${datos.estadisticas.percentil25}`, 50, doc.y + 80);
            doc.text(`Percentil 75: $${datos.estadisticas.percentil75}`, 50, doc.y + 100);
            doc.text(`Percentil 90: $${datos.estadisticas.percentil90}`, 50, doc.y + 120);
            
            // Pie de página
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                doc.fontSize(8)
                    .text(
                        `Página ${i + 1} de ${pageCount} | Sistema de Gestión de Productos`,
                        50,
                        doc.page.height - 50,
                        { align: 'center' }
                    );
            }
            
            doc.end();
        });
    }
    
    async generarReporteInventario(datos) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            
            doc.fontSize(20).text('Reporte de Inventario', { align: 'center' }).moveDown();
            doc.fontSize(12).text(`Fecha: ${new Date().toLocaleString()}`, { align: 'center' }).moveDown(2);
            
            // Resumen
            doc.fontSize(14).text('Resumen de Inventario', { underline: true }).moveDown();
            doc.fontSize(10);
            doc.text(`Total de productos: ${datos.resumen.totalProductos}`);
            doc.text(`Valor total inventario: $${datos.resumen.valorTotal}`);
            doc.text(`Productos con bajo stock: ${datos.resumen.bajoStock}`);
            doc.moveDown();
            
            // Tabla de productos con bajo stock
            if (datos.bajoStock.length > 0) {
                doc.fontSize(14).text('Productos con Stock Crítico', { underline: true }).moveDown();
                
                let y = doc.y;
                doc.font('Helvetica-Bold');
                doc.text('Producto', 50, y);
                doc.text('Stock Actual', 250, y);
                doc.text('Stock Mínimo', 370, y);
                doc.text('Estado', 450, y);
                
                doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
                y += 25;
                
                doc.font('Helvetica');
                datos.bajoStock.forEach(producto => {
                    if (y > 700) {
                        doc.addPage();
                        y = 50;
                    }
                    
                    doc.text(producto.nombre, 50, y, { width: 180 });
                    doc.text(producto.stock_actual.toString(), 260, y);
                    doc.text(producto.stock_minimo.toString(), 380, y);
                    doc.text('⚠️ Crítico', 450, y);
                    y += 20;
                });
            }
            
            doc.end();
        });
    }
}

export default new ReportePDFService();