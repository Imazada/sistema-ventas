
-- Datos de ejemplo
INSERT INTO productos (sku, nombre, descripcion, categoria, precio_compra, precio_venta, stock_actual, stock_minimo, proveedor) VALUES
('SKU-001', 'Laptop HP Pavilion', 'Laptop 15.6 pulgadas, 8GB RAM, 256GB SSD', 'Electrónica', 450.00, 599.99, 15, 5, 'HP Inc.'),
('SKU-002', 'Mouse Logitech', 'Mouse inalámbrico ergonómico', 'Accesorios', 15.00, 29.99, 50, 10, 'Logitech'),
('SKU-003', 'Monitor Samsung', 'Monitor 24 pulgadas Full HD', 'Electrónica', 120.00, 199.99, 8, 3, 'Samsung'),
('SKU-004', 'Teclado Mecánico', 'Teclado RGB switches azules', 'Accesorios', 35.00, 59.99, 3, 5, 'Redragon'),
('SKU-005', 'Silla Gamer', 'Silla ergonómica ajustable', 'Mobiliario', 150.00, 249.99, 4, 2, 'Corsair');


INSERT INTO usuarios (email, password_hash, nombre, apellido, rol_id, activo) 
SELECT 'admin@sistema.com', '$2a$10$rQZQXJqK5J5K5J5K5J5K5u', 'Admin', 'Sistema', r.id, true
FROM roles r 
WHERE r.nombre = 'admin' 
  AND NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@sistema.com');


 INSERT INTO usuarios (email, password_hash, nombre, apellido, rol_id, activo, fecha_creacion) 
SELECT 'vendedor@sistema.com', '$2a$10$rQZQXJqK5J5K5J5K5J5K5u', 'Juan', 'Vendedor', r.id, true, NOW()
FROM roles r WHERE r.nombre = 'vendedor'
AND NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'vendedor@sistema.com');


