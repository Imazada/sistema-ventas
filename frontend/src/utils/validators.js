// Validadores reutilizables
export const validarSKU = (sku) => {
  const regex = /^[A-Za-z0-9-]{3,50}$/;
  return regex.test(sku);
};

export const validarPrecio = (precio) => {
  return !isNaN(precio) && precio > 0;
};

export const validarStock = (stock) => {
  return !isNaN(stock) && stock >= 0 && Number.isInteger(Number(stock));
};

export const validarProducto = (producto) => {
  const errores = [];
  
  if (!producto.sku || !validarSKU(producto.sku)) {
    errores.push('SKU inválido (mínimo 3 caracteres, solo letras, números y guiones)');
  }
  
  if (!producto.nombre || producto.nombre.length < 2 || producto.nombre.length > 100) {
    errores.push('Nombre debe tener entre 2 y 100 caracteres');
  }
  
  if (!producto.categoria || producto.categoria.length < 2) {
    errores.push('Categoría inválida');
  }
  
  if (!validarPrecio(producto.precio_compra)) {
    errores.push('Precio de compra debe ser mayor a 0');
  }
  
  if (!validarPrecio(producto.precio_venta)) {
    errores.push('Precio de venta debe ser mayor a 0');
  }
  
  if (producto.precio_venta <= producto.precio_compra) {
    errores.push('El precio de venta debe ser mayor que el precio de compra');
  }
  
  if (!validarStock(producto.stock_actual)) {
    errores.push('Stock actual inválido');
  }
  
  if (!validarStock(producto.stock_minimo)) {
    errores.push('Stock mínimo inválido');
  }
  
  return errores;
};