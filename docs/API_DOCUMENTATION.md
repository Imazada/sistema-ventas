# Documentación de la API - InventarioPro

La API está construida con Node.js, Express y Sequelize. Utiliza JWT para la autenticación y RBAC para la autorización.

## 🔐 Autenticación
- `POST /api/auth/register`: Registro de nuevos clientes.
- `POST /api/auth/login`: Inicio de sesión, devuelve un token JWT.
- `GET /api/auth/me`: Obtiene los datos del usuario autenticado.

## 📦 Productos
- `GET /api/productos`: Lista todos los productos activos (con filtros de búsqueda y categoría).
- `GET /api/productos/:id`: Detalle de un producto.
- `POST /api/productos`: Crear producto (Solo Admin).
- `PUT /api/productos/:id`: Actualizar producto (Solo Admin).
- `DELETE /api/productos/:id`: Eliminación lógica (Solo Admin).
- `GET /api/productos/estadisticas`: KPIs básicos de inventario.

## 🛒 Carrito
- `GET /api/carrito`: Obtiene el carrito del usuario actual.
- `POST /api/carrito/items`: Agrega o actualiza un item en el carrito.
- `DELETE /api/carrito/items/:id`: Elimina un item del carrito.
- `DELETE /api/carrito`: Vacía el carrito.

## 📑 Órdenes
- `POST /api/ordenes`: Crea una nueva orden a partir del carrito.
- `GET /api/ordenes`: Lista órdenes (Admin ve todas, Cliente solo las suyas).
- `GET /api/ordenes/:id`: Detalle de una orden específica.
- `PATCH /api/ordenes/:id/estado`: Cambia el estado de una orden (Solo Admin/Vendedor).

## 📊 Estadísticas (Solo Admin)
- `GET /api/estadisticas/analisis-completo`: Métricas avanzadas de ventas, tendencias y rentabilidad.
- `GET /api/estadisticas/tiempo-real`: Ventas del día y órdenes recientes.

## 🔔 Notificaciones
- `GET /api/notificaciones`: Lista notificaciones para el usuario actual.
- `PATCH /api/notificaciones/:id/leer`: Marca una notificación como leída.
- `PATCH /api/notificaciones/leer-todas`: Marca todas las notificaciones como leídas.

## 👥 Usuarios (Solo Admin)
- `GET /api/usuarios`: Lista todos los usuarios.
- `POST /api/usuarios`: Crea un nuevo usuario (Vendedor/Admin).
- `PUT /api/usuarios/:id`: Actualiza datos de un usuario.
- `PATCH /api/usuarios/:id/estado`: Activa/Desactiva una cuenta.
