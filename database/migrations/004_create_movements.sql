-- Tabla para seguimiento de movimientos de inventario
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL, -- entrada, salida, ajuste
    cantidad INTEGER NOT NULL,
    motivo TEXT,
    usuario_id INTEGER REFERENCES usuarios(id),
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para actualizar stock_actual en productos (opcional, se puede manejar por código)
-- Por ahora lo manejaremos en la lógica del negocio (servicios) para tener más control.
