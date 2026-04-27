-- Migración para agregar campo de imagen a productos
-- Versión: 1.1.0
-- Fecha: 2024-04-27

ALTER TABLE productos ADD COLUMN IF NOT EXISTS imagen_url VARCHAR(255);
