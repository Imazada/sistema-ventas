import { Carrito, CarritoItem, Producto } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

class CarritoService {
    async obtenerCarrito(usuarioId = null, sessionId = null) {
        let carrito;
        
        if (usuarioId) {
            carrito = await Carrito.findOne({
                where: { usuario_id: usuarioId, activo: true },
                include: [{
                    model: CarritoItem,
                    as: 'items',
                    include: [{ model: Producto, as: 'producto' }]
                }]
            });
        } else if (sessionId) {
            carrito = await Carrito.findOne({
                where: { session_id: sessionId, activo: true },
                include: [{
                    model: CarritoItem,
                    as: 'items',
                    include: [{ model: Producto, as: 'producto' }]
                }]
            });
        }
        
        if (!carrito) {
            carrito = await this.crearCarrito(usuarioId, sessionId);
        }
        
        return carrito;
    }
    
    async crearCarrito(usuarioId = null, sessionId = null) {
        const carrito = await Carrito.create({
            usuario_id: usuarioId,
            session_id: sessionId || uuidv4(),
            activo: true
        });
        
        return carrito;
    }
    
    async agregarItem(carritoId, productoId, cantidad) {
        const producto = await Producto.findByPk(productoId);
        
        if (!producto || !producto.activo) {
            throw new Error('Producto no encontrado');
        }
        
        // Convertir stock_actual a número para asegurar comparación correcta
        const stockDisponible = parseInt(producto.stock_actual);
        const cantidadSolicitada = parseInt(cantidad);

        console.log(`[DEBUG CART] Producto: ${producto.nombre}, Stock DB: ${producto.stock_actual}, Stock Parsed: ${stockDisponible}, Cantidad Solicitada: ${cantidadSolicitada}`);

        if (stockDisponible < cantidadSolicitada) {
            console.error(`[DEBUG CART] Error: Stock insuficiente para ${producto.nombre}`);
            throw new Error(`Stock insuficiente. Disponible: ${stockDisponible}`);
        }
        
        let item = await CarritoItem.findOne({
            where: { carrito_id: carritoId, producto_id: productoId }
        });
        
        if (item) {
            const nuevaCantidad = parseInt(item.cantidad) + cantidadSolicitada;
            if (stockDisponible < nuevaCantidad) {
                throw new Error(`Stock insuficiente para agregar más. Disponible: ${stockDisponible}`);
            }
            await item.update({ cantidad: nuevaCantidad });
        } else {
            item = await CarritoItem.create({
                carrito_id: carritoId,
                producto_id: productoId,
                cantidad: cantidadSolicitada,
                precio_unitario: producto.precio_venta
            });
        }
        
        return item;
    }
    
    async actualizarCantidad(carritoId, itemId, cantidad) {
        const item = await CarritoItem.findByPk(itemId);
        
        if (!item || item.carrito_id !== carritoId) {
            throw new Error('Item no encontrado en el carrito');
        }
        
        const producto = await Producto.findByPk(item.producto_id);
        
        if (producto.stock_actual < cantidad) {
            throw new Error(`Stock insuficiente. Disponible: ${producto.stock_actual}`);
        }
        
        if (cantidad <= 0) {
            await item.destroy();
        } else {
            await item.update({ cantidad });
        }
        
        return true;
    }
    
    async eliminarItem(carritoId, itemId) {
        const item = await CarritoItem.findOne({
            where: { id: itemId, carrito_id: carritoId }
        });
        
        if (!item) {
            throw new Error('Item no encontrado');
        }
        
        await item.destroy();
        return true;
    }
    
    async vaciarCarrito(carritoId) {
        await CarritoItem.destroy({ where: { carrito_id: carritoId } });
        return true;
    }
    
    async calcularTotales(carritoId) {
        const items = await CarritoItem.findAll({
            where: { carrito_id: carritoId },
            include: [{ model: Producto, as: 'producto' }]
        });
        
        const subtotal = items.reduce((sum, item) => 
            sum + (parseFloat(item.cantidad) * parseFloat(item.precio_unitario)), 0);
        
        const impuesto = subtotal * 0.21; // 21% IVA
        const total = subtotal + impuesto;
        
        return { subtotal, impuesto, total, items };
    }

    async fusionarCarritos(usuarioId, sessionId) {
        // Buscar el carrito del usuario y el carrito de la sesión
        const carritoUsuario = await this.obtenerCarrito(usuarioId);
        const carritoSesion = await Carrito.findOne({
            where: { session_id: sessionId, activo: true },
            include: [{ model: CarritoItem, as: 'items' }]
        });

        if (carritoSesion && carritoSesion.items.length > 0) {
            for (const itemSesion of carritoSesion.items) {
                // Buscar si el producto ya está en el carrito del usuario
                const itemExistente = await CarritoItem.findOne({
                    where: { 
                        carrito_id: carritoUsuario.id, 
                        producto_id: itemSesion.producto_id 
                    }
                });

                if (itemExistente) {
                    // Sumar cantidades
                    await itemExistente.update({
                        cantidad: parseInt(itemExistente.cantidad) + parseInt(itemSesion.cantidad)
                    });
                } else {
                    // Mover el item al carrito del usuario
                    await itemSesion.update({
                        carrito_id: carritoUsuario.id
                    });
                }
            }
            // Opcional: Desactivar o eliminar el carrito de sesión
            await carritoSesion.update({ activo: false });
        }
        
        return carritoUsuario;
    }
}

export default new CarritoService();