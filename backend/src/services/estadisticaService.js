import { Sequelize } from 'sequelize';
import { Orden, OrdenItem, Producto, Usuario, Rol } from '../models/index.js';

class EstadisticaService {
    async obtenerAnalisisVentas(filtros = {}) {
        const { fechaInicio, fechaFin, vendedorId, categoria } = filtros;
        
        const whereOrden = {
            estado: ['pagado', 'enviado', 'entregado']
        };

        if (fechaInicio && fechaFin) {
            whereOrden.fecha_creacion = {
                [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFin + 'T23:59:59')]
            };
        }

        if (vendedorId) {
            whereOrden.usuario_id = vendedorId;
        }

        const includeItems = {
            model: OrdenItem,
            as: 'items',
            include: [{
                model: Producto,
                as: 'producto',
                attributes: ['id', 'nombre', 'sku', 'categoria', 'precio_compra', 'precio_venta']
            }]
        };

        if (categoria) {
            includeItems.include[0].where = { categoria };
        }

        const ordenes = await Orden.findAll({
            where: whereOrden,
            include: [
                includeItems,
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'apellido'],
                    include: [{
                        model: Rol,
                        as: 'rol',
                        attributes: ['nombre']
                    }]
                }
            ]
        });

        // 1. Promedio de ventas diarias y tendencias
        const ventasPorDia = {};
        ordenes.forEach(o => {
            try {
                const date = o.fecha_creacion ? new Date(o.fecha_creacion) : null;
                if (!date || isNaN(date.getTime())) return;
                
                const fecha = date.toISOString().split('T')[0];
                const total = parseFloat(o.total || 0);
                if (!isNaN(total)) {
                    ventasPorDia[fecha] = (ventasPorDia[fecha] || 0) + total;
                }
            } catch (err) {
                console.error('Error procesando orden para ventas por día:', err);
            }
        });

        const dias = Object.keys(ventasPorDia).length || 1;
        const totalVentasValor = Object.values(ventasPorDia).reduce((a, b) => a + (isNaN(b) ? 0 : b), 0);
        const promedioVentasDiarias = totalVentasValor / dias;

        // 2. Promedio de ventas mensuales y comparativas
        const ventasPorMes = {};
        ordenes.forEach(o => {
            try {
                const date = o.fecha_creacion ? new Date(o.fecha_creacion) : null;
                if (!date || isNaN(date.getTime())) return;

                const mes = date.toISOString().substring(0, 7); // YYYY-MM
                const total = parseFloat(o.total || 0);
                if (!isNaN(total)) {
                    ventasPorMes[mes] = (ventasPorMes[mes] || 0) + total;
                }
            } catch (err) {
                console.error('Error procesando orden para ventas por mes:', err);
            }
        });

        // 3. Producto más vendido
        const productosVentas = {};
        ordenes.forEach(o => {
            if (!o.items) return;
            o.items.forEach(item => {
                const p = item.producto;
                if (!p) return;
                if (!productosVentas[p.id]) {
                    productosVentas[p.id] = {
                        id: p.id,
                        nombre: p.nombre,
                        sku: p.sku,
                        unidades: 0,
                        ingresos: 0,
                        margenTotal: 0
                    };
                }
                const subtotal = parseFloat(item.subtotal || 0);
                const precioVenta = parseFloat(p.precio_venta || 0);
                const precioCompra = parseFloat(p.precio_compra || 0);
                const cantidad = parseInt(item.cantidad || 0);

                productosVentas[p.id].unidades += cantidad;
                productosVentas[p.id].ingresos += isNaN(subtotal) ? 0 : subtotal;
                productosVentas[p.id].margenTotal += (precioVenta - precioCompra) * cantidad;
            });
        });

        const listaProductos = Object.values(productosVentas);
        const productoMasVendido = listaProductos.sort((a, b) => b.unidades - a.unidades)[0] || null;

        // 4. KPIs
        // Tasa de conversión (Simulada ya que no tenemos tabla de visitas, usaremos órdenes/total_usuarios)
        const totalUsuarios = await Usuario.count();
        const tasaConversion = totalUsuarios > 0 ? (ordenes.length / totalUsuarios) * 100 : 0;

        // Ticket promedio
        const ticketPromedio = ordenes.length > 0 ? totalVentasValor / ordenes.length : 0;

        // Ventas por vendedor
        const ventasPorVendedor = {};
        ordenes.forEach(o => {
            const v = o.usuario;
            if (v && (v.rol?.nombre === 'vendedor' || v.rol?.nombre === 'admin')) {
                const nombre = `${v.nombre} ${v.apellido}`;
                const total = parseFloat(o.total || 0);
                if (!isNaN(total)) {
                    ventasPorVendedor[nombre] = (ventasPorVendedor[nombre] || 0) + total;
                }
            }
        });

        // Margen de ganancia por producto
        const productosMayorMargen = listaProductos
            .sort((a, b) => b.margenTotal - a.margenTotal)
            .slice(0, 5);

        // Ventas por categoría
        const ventasPorCategoria = {};
        ordenes.forEach(o => {
            if (!o.items) return;
            o.items.forEach(item => {
                const cat = item.producto?.categoria || 'Sin categoría';
                const subtotal = parseFloat(item.subtotal || 0);
                if (!isNaN(subtotal)) {
                    ventasPorCategoria[cat] = (ventasPorCategoria[cat] || 0) + subtotal;
                }
            });
        });

        return {
            promedioVentasDiarias: promedioVentasDiarias.toFixed(2),
            tendenciaDiaria: Object.entries(ventasPorDia).map(([fecha, total]) => ({ fecha, total })),
            promedioVentasMensuales: (totalVentasValor / (Object.keys(ventasPorMes).length || 1)).toFixed(2),
            comparativaMensual: Object.entries(ventasPorMes).map(([mes, total]) => ({ mes, total })),
            productoMasVendido,
            kpis: {
                tasaConversion: tasaConversion.toFixed(2),
                ticketPromedio: ticketPromedio.toFixed(2),
                ventasPorVendedor: Object.entries(ventasPorVendedor).map(([nombre, total]) => ({ nombre, total })),
                productosMayorMargen,
                ventasPorCategoria: Object.entries(ventasPorCategoria).map(([categoria, total]) => ({ categoria, total }))
            }
        };
    }

    async calcularEstadisticasVentas(fechaInicio, fechaFin) {
        const ordenes = await Orden.findAll({
            where: {
                estado: ['pagado', 'enviado', 'entregado'],
                fecha_creacion: {
                    [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFin + 'T23:59:59')]
                }
            },
            include: [{
                model: OrdenItem,
                as: 'items',
                include: [{ model: Producto, as: 'producto' }]
            }]
        });
        
        const valores = ordenes.map(o => parseFloat(o.total));
        
        // Media
        const media = valores.reduce((a, b) => a + b, 0) / valores.length;
        
        // Mediana
        const sorted = [...valores].sort((a, b) => a - b);
        const mediana = sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];
        
        // Moda
        const frecuencia = {};
        valores.forEach(v => frecuencia[v] = (frecuencia[v] || 0) + 1);
        let moda = [];
        let maxFreq = 0;
        for (let [valor, freq] of Object.entries(frecuencia)) {
            if (freq > maxFreq) {
                maxFreq = freq;
                moda = [parseFloat(valor)];
            } else if (freq === maxFreq) {
                moda.push(parseFloat(valor));
            }
        }
        
        // Desviación estándar
        const sumaCuadrados = valores.reduce((sum, val) => sum + Math.pow(val - media, 2), 0);
        const desviacionEstandar = Math.sqrt(sumaCuadrados / valores.length);
        
        // Percentiles
        const percentil = (p) => {
            const index = Math.ceil((p / 100) * sorted.length) - 1;
            return sorted[index];
        };
        
        return {
            media: media.toFixed(2),
            mediana: mediana.toFixed(2),
            moda: moda.map(m => m.toFixed(2)),
            desviacionEstandar: desviacionEstandar.toFixed(2),
            varianza: (desviacionEstandar * desviacionEstandar).toFixed(2),
            percentil25: percentil(25).toFixed(2),
            percentil50: percentil(50).toFixed(2),
            percentil75: percentil(75).toFixed(2),
            percentil90: percentil(90).toFixed(2),
            totalVentas: ordenes.length,
            ingresosTotales: valores.reduce((a, b) => a + b, 0).toFixed(2)
        };
    }
    
    async obtenerMetricasTiempoReal() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const ventasHoy = await Orden.sum('total', {
            where: {
                estado: ['pagado', 'enviado', 'entregado'],
                fecha_creacion: { [Sequelize.Op.gte]: hoy }
            }
        });
        
        const ordenesActivas = await Orden.count({
            where: {
                estado: { [Sequelize.Op.in]: ['pagado', 'enviado'] }
            }
        });
        
        const productosMasVendidos = await OrdenItem.findAll({
            attributes: [
                'producto_id',
                [Sequelize.fn('SUM', Sequelize.col('cantidad')), 'total_vendido']
            ],
            include: [{
                model: Producto,
                as: 'producto',
                attributes: ['nombre', 'sku']
            }],
            group: ['producto_id', 'Producto.id'],
            order: [[Sequelize.literal('total_vendido'), 'DESC']],
            limit: 5
        });
        
        const rotacionInventario = await this.calcularRotacionInventario();
        
        return {
            ventasHoy: ventasHoy || 0,
            ordenesActivas,
            productosMasVendidos,
            rotacionInventario,
            ticketPromedio: await this.calcularTicketPromedio()
        };
    }
    
    async calcularRotacionInventario() {
        const productos = await Producto.findAll({
            where: { activo: true }
        });
        
        const rotacion = [];
        for (const producto of productos) {
            const vendidos = await OrdenItem.sum('cantidad', {
                where: { producto_id: producto.id }
            }) || 0;
            
            const rotacionValor = producto.stock_actual > 0 
                ? vendidos / producto.stock_actual 
                : 0;
            
            rotacion.push({
                producto: producto.nombre,
                stockActual: producto.stock_actual,
                vendidos,
                rotacion: rotacionValor.toFixed(2)
            });
        }
        
        return rotacion.sort((a, b) => b.rotacion - a.rotacion);
    }
    
    async calcularTicketPromedio() {
        const ordenesCompletadas = await Orden.findAll({
            where: { estado: ['pagado', 'enviado', 'entregado'] },
            attributes: ['total']
        });
        
        if (ordenesCompletadas.length === 0) return 0;
        
        const suma = ordenesCompletadas.reduce((sum, o) => sum + parseFloat(o.total), 0);
        return (suma / ordenesCompletadas.length).toFixed(2);
    }
}

export default new EstadisticaService();