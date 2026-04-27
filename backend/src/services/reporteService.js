import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

class ReporteService {
    // Configuración de colores profesionales
    colors = {
        primary: [15, 23, 42],      // Slate 900
        secondary: [37, 99, 235],   // Blue 600
        success: [16, 185, 129],    // Emerald 500
        danger: [225, 29, 72],      // Rose 600
        warning: [245, 158, 11],    // Amber 500
        textMain: [30, 41, 59],     // Slate 800
        textMuted: [100, 116, 139], // Slate 500
        lightBg: [248, 250, 252]    // Slate 50
    };

    _agregarEncabezado(doc, titulo, subtitulo = '') {
        const pageWidth = doc.internal.pageSize.width;
        
        // Rectángulo superior decorativo
        doc.setFillColor(...this.colors.primary);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        // Logo / Nombre de Empresa
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('InventarioPro', 14, 25);
        
        // Línea divisoria blanca sutil
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.5);
        doc.line(70, 15, 70, 30);
        
        // Título del Reporte
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text(titulo.toUpperCase(), 75, 25);
        
        // Fecha y Subtítulo en la parte inferior del encabezado o debajo
        doc.setTextColor(...this.colors.textMuted);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const fecha = new Date().toLocaleString();
        doc.text(`Generado el: ${fecha}`, pageWidth - 14, 50, { align: 'right' });
        
        if (subtitulo) {
            doc.setTextColor(...this.colors.textMain);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text(subtitulo, 14, 50);
        }
        
        return 60; // Retorna la posición Y sugerida para empezar el contenido
    }

    _agregarPieDePagina(doc) {
        const pageCount = doc.internal.getNumberOfPages();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(...this.colors.textMuted);
            
            // Línea divisoria
            doc.setDrawColor(...this.colors.lightBg);
            doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);
            
            doc.text(
                'InventarioPro - Sistema de Gestión de Productos. Confidencial.',
                14,
                pageHeight - 10
            );
            
            doc.text(
                `Página ${i} de ${pageCount}`,
                pageWidth - 14,
                pageHeight - 10,
                { align: 'right' }
            );
        }
    }

    generarReporteOperacional(productos, categoria = 'Todas') {
        const doc = new jsPDF();
        let yPos = this._agregarEncabezado(doc, 'Reporte de Inventario', `Categoría: ${categoria}`);
        
        const tableData = productos.map(p => [
            p.sku,
            p.nombre,
            p.categoria,
            p.stock_actual,
            `$${parseFloat(p.precio_venta).toFixed(2)}`,
            `$${(p.stock_actual * parseFloat(p.precio_venta)).toFixed(2)}`
        ]);
        
        doc.autoTable({
            startY: yPos,
            head: [['SKU', 'Producto', 'Categoría', 'Stock', 'Precio Unit.', 'Valor Total']],
            body: tableData,
            theme: 'grid',
            headStyles: { 
                fillColor: this.colors.secondary, 
                textColor: 255, 
                fontStyle: 'bold',
                halign: 'center'
            },
            alternateRowStyles: { fillColor: this.colors.lightBg },
            styles: { 
                fontSize: 9, 
                cellPadding: 4,
                lineColor: [230, 230, 230]
            },
            columnStyles: {
                0: { fontStyle: 'bold', textColor: this.colors.primary },
                3: { halign: 'center' },
                4: { halign: 'right' },
                5: { halign: 'right', fontStyle: 'bold' }
            }
        });
        
        const totalValor = productos.reduce((sum, p) => 
            sum + (p.stock_actual * parseFloat(p.precio_venta)), 0);
            
        yPos = doc.lastAutoTable.finalY + 15;
        
        // Cuadro de Resumen Final
        doc.setFillColor(...this.colors.primary);
        doc.roundedRect(doc.internal.pageSize.width - 94, yPos, 80, 20, 3, 3, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('VALOR TOTAL INVENTARIO', doc.internal.pageSize.width - 54, yPos + 8, { align: 'center' });
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`$${totalValor.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, doc.internal.pageSize.width - 54, yPos + 16, { align: 'center' });
        
        this._agregarPieDePagina(doc);
        return doc;
    }
    
    generarReporteGestion(kpis, topCategorias, productosBajoStock) {
        const doc = new jsPDF();
        let yPos = this._agregarEncabezado(doc, 'Análisis de Gestión', 'Resumen Ejecutivo de Rendimiento');
        
        // Sección de KPIs en Tarjetas
        const cardWidth = 44;
        const cardHeight = 25;
        const gap = 5;
        let xPos = 14;
        
        const kpiItems = [
            { label: 'Productos', value: kpis.totalProductos, color: this.colors.secondary },
            { label: 'Valor Total', value: `$${kpis.valorInventario.toLocaleString()}`, color: this.colors.success },
            { label: 'Bajo Stock', value: kpis.bajoStock, color: this.colors.danger },
            { label: 'Top Valor', value: kpis.productoMasValioso ? `$${kpis.productoMasValioso.valor.toLocaleString()}` : 'N/A', color: this.colors.warning }
        ];
        
        kpiItems.forEach(item => {
            // Fondo de la tarjeta
            doc.setFillColor(...this.colors.lightBg);
            doc.roundedRect(xPos, yPos, cardWidth, cardHeight, 2, 2, 'F');
            
            // Línea lateral de color
            doc.setFillColor(...item.color);
            doc.rect(xPos, yPos, 2, cardHeight, 'F');
            
            // Texto
            doc.setTextColor(...this.colors.textMuted);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(item.label.toUpperCase(), xPos + 6, yPos + 8);
            
            doc.setTextColor(...this.colors.textMain);
            doc.setFontSize(11);
            doc.text(item.value.toString(), xPos + 6, yPos + 18);
            
            xPos += cardWidth + gap;
        });
        
        yPos += cardHeight + 15;
        
        // Sección: Distribución por Categoría
        doc.setTextColor(...this.colors.primary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('DISTRIBUCIÓN POR CATEGORÍA (TOP 10)', 14, yPos);
        yPos += 6;
        
        const categoriasData = topCategorias.map(c => [
            c.nombre, 
            c.cantidad, 
            `$${c.valor.toFixed(2)}`,
            `${((c.valor / kpis.valorInventario) * 100).toFixed(1)}%`
        ]);
        
        doc.autoTable({
            startY: yPos,
            head: [['Categoría', 'Unidades', 'Valor Inventario', '% Participación']],
            body: categoriasData,
            theme: 'grid',
            headStyles: { fillColor: this.colors.primary, textColor: 255 },
            styles: { fontSize: 8, cellPadding: 3 },
            columnStyles: {
                1: { halign: 'center' },
                2: { halign: 'right' },
                3: { halign: 'center', fontStyle: 'bold' }
            }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
        
        // Sección: Alertas de Stock
        doc.setTextColor(...this.colors.danger);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('ALERTAS CRÍTICAS DE REABASTECIMIENTO', 14, yPos);
        yPos += 6;
        
        const bajoStockData = productosBajoStock.map(p => [
            p.sku,
            p.nombre,
            p.stock_actual,
            p.stock_minimo,
            p.stock_minimo - p.stock_actual
        ]);
        
        doc.autoTable({
            startY: yPos,
            head: [['SKU', 'Producto', 'Stock Actual', 'Mínimo', 'Faltante']],
            body: bajoStockData,
            theme: 'striped',
            headStyles: { fillColor: this.colors.danger, textColor: 255 },
            styles: { fontSize: 8, cellPadding: 3 },
            columnStyles: {
                2: { halign: 'center', textColor: this.colors.danger, fontStyle: 'bold' },
                3: { halign: 'center' },
                4: { halign: 'center', fontStyle: 'bold' }
            }
        });
        
        this._agregarPieDePagina(doc);
        return doc;
    }
}

export default new ReporteService();
