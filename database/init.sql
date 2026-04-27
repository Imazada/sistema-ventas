-- Crear base de datos
CREATE DATABASE bd_tienda;

\c bd_tienda;

-- Crear tabla de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50) NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL CHECK (precio_compra >= 0),
    precio_venta DECIMAL(10,2) NOT NULL CHECK (precio_venta > 0),
    stock_actual INTEGER NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    stock_minimo INTEGER NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    proveedor VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_productos_sku ON productos(sku);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_nombre ON productos(nombre);

-- Trigger para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_fecha
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- Agregar índice compuesto para búsquedas rápidas
CREATE INDEX idx_productos_busqueda ON productos(nombre, sku, categoria);

-- Función para validar precio_venta > precio_compra
CREATE OR REPLACE FUNCTION validar_precios()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.precio_venta <= NEW.precio_compra THEN
        RAISE EXCEPTION 'El precio de venta debe ser mayor que el precio de compra';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_precios
    BEFORE INSERT OR UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION validar_precios();

-- ==========================================
-- TABLAS DE AUTENTICACIÓN Y ROLES
-- ==========================================

-- Tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB NOT NULL DEFAULT '[]'
);

-- Insertar roles por defecto
INSERT INTO roles (nombre, descripcion, permisos) VALUES
('admin', 'Administrador del sistema', '["*"]'),
('vendedor', 'Vendedor - puede gestionar ventas', '["ver_dashboard","ver_productos","crear_ventas","ver_reportes_operacionales"]'),
('comprador', 'Comprador - puede comprar', '["ver_productos","crear_compras","ver_historial"]');

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol_id INTEGER REFERENCES roles(id),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLAS DE CARRITO Y ÓRDENES
-- ==========================================

-- Tabla de carrito (persistente)
CREATE TABLE carritos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- Para usuarios no autenticados
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT carrito_usuario_session_unique UNIQUE (usuario_id, session_id)
);

-- Items del carrito
CREATE TABLE carrito_items (
    id SERIAL PRIMARY KEY,
    carrito_id INTEGER REFERENCES carritos(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes
CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    numero_orden VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    subtotal DECIMAL(10,2) NOT NULL,
    impuesto DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50),
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_completada TIMESTAMP,
    CONSTRAINT estados_orden CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'))
);

-- Items de la orden
CREATE TABLE orden_items (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER REFERENCES ordenes(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- ==========================================
-- TABLAS DE MOVIMIENTOS Y ESTADÍSTICAS
-- ==========================================

-- Movimientos de inventario (auditoría)
CREATE TABLE movimientos_inventario (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id),
    tipo VARCHAR(20) NOT NULL, -- 'entrada', 'salida', 'ajuste'
    cantidad INTEGER NOT NULL,
    stock_anterior INTEGER NOT NULL,
    stock_nuevo INTEGER NOT NULL,
    referencia_id INTEGER, -- ID de orden o ajuste
    referencia_tipo VARCHAR(50),
    usuario_id INTEGER REFERENCES usuarios(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Estadísticas diarias (para rendimiento)
CREATE TABLE estadisticas_diarias (
    id SERIAL PRIMARY KEY,
    fecha DATE UNIQUE NOT NULL,
    total_ventas DECIMAL(10,2) DEFAULT 0,
    num_ordenes INTEGER DEFAULT 0,
    productos_vendidos INTEGER DEFAULT 0,
    ingresos_promedio DECIMAL(10,2) DEFAULT 0
);

-- ==========================================
-- ÍNDICES PARA RENDIMIENTO
-- ==========================================

CREATE INDEX idx_carrito_usuario ON carritos(usuario_id);
CREATE INDEX idx_carrito_session ON carritos(session_id);
CREATE INDEX idx_ordenes_usuario ON ordenes(usuario_id);
CREATE INDEX idx_ordenes_estado ON ordenes(estado);
CREATE INDEX idx_ordenes_fecha ON ordenes(fecha_creacion);
CREATE INDEX idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha);

-- ==========================================
-- FUNCIONES Y TRIGGERS
-- ==========================================

-- Función para actualizar stock al crear orden
CREATE OR REPLACE FUNCTION actualizar_stock_por_orden()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar stock de productos
    UPDATE productos
    SET stock_actual = stock_actual - NEW.cantidad,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = NEW.producto_id;
    
    -- Registrar movimiento
    INSERT INTO movimientos_inventario (
        producto_id, tipo, cantidad, 
        stock_anterior, stock_nuevo, 
        referencia_id, referencia_tipo, usuario_id
    )
    SELECT 
        NEW.producto_id, 'salida', NEW.cantidad,
        stock_actual + NEW.cantidad, stock_actual,
        NEW.orden_id, 'orden',
        (SELECT usuario_id FROM ordenes WHERE id = NEW.orden_id)
    FROM productos WHERE id = NEW.producto_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_stock
    AFTER INSERT ON orden_items
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_stock_por_orden();