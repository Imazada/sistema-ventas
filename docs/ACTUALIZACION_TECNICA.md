# Documentación Técnica - Actualización del Sistema

Esta documentación detalla los cambios implementados en la fase de mejora de seguridad, análisis y gestión de usuarios.

## 1. Seguridad y Control de Acceso (RBAC)

### Restricción de Permisos para Vendedores
Se ha implementado una política de "Solo Lectura" para el rol `vendedor` en el módulo de productos.

- **Backend (`backend/src/routes/productos.js`)**:
  - Los endpoints `POST /api/productos`, `PUT /api/productos/:id` y `DELETE /api/productos/:id` ahora están restringidos exclusivamente al rol `admin`.
  - Middleware utilizado: `autorizar(['admin'])`.
- **Frontend (`frontend/src/components/ProductTable/ProductTable.jsx`)**:
  - Se oculta el botón "Nuevo Producto" para usuarios con rol `vendedor`.
  - Se eliminan las opciones de "Editar" y "Eliminar" de la tabla de productos para este rol.

## 2. Gestión de Usuarios (Módulo Admin)

Nuevo módulo exclusivo para administradores que permite la gestión completa del personal (vendedores y otros admins).

- **Características**:
  - CRUD completo de usuarios.
  - Activación/Desactivación de cuentas.
  - Cambio de roles (Admin/Vendedor).
  - Validaciones de seguridad (Email único, campos obligatorios).
- **Archivos Clave**:
  - `backend/src/controllers/usuarioController.js`: Lógica de negocio y transacciones.
  - `backend/src/routes/usuarios.js`: Definición de rutas protegidas.
  - `frontend/src/pages/GestionUsuarios.jsx`: Interfaz administrativa.

## 3. Análisis de Ventas y Dashboard

Se ha transformado el panel de control estático en un centro de inteligencia de negocios.

### Métricas de Negocio (KPIs)
- **Ventas Diarias/Mensuales**: Promedios calculados dinámicamente.
- **Tasa de Conversión**: Relación entre pedidos y visitas (simulado con base en pedidos completados).
- **Ticket Promedio**: Valor medio de las órdenes de venta.
- **Producto Estrella**: Identificación automática del producto con más ingresos y unidades vendidas.

### Funcionalidades de Análisis
- **Filtros Dinámicos**: Por rango de fechas, vendedor específico y categoría de producto.
- **Gráficos Interactivos**:
  - Tendencia de Ventas (LineChart).
  - Distribución por Categoría (PieChart).
  - Rentabilidad por Producto (Márgenes).
- **Archivos Clave**:
  - `backend/src/services/estadisticaService.js`: Motor de cálculo de métricas SQL/Sequelize.
  - `frontend/src/pages/Dashboard.jsx`: Visualización avanzada con Recharts.

## 4. Sistema de Notificaciones en Tiempo Real

Se implementó un motor de notificaciones proactivo para mejorar la comunicación interna y con el cliente.

- **Arquitectura**:
  - **Backend**: Servicio dedicado (`notificacionService.js`) que centraliza la creación de alertas.
  - **Triggers**: Integrado en el ciclo de vida de las órdenes y la actualización de productos (stock).
  - **Frontend**: Componente `NotificationBell.jsx` que utiliza polling eficiente (30s) para actualizar el estado sin recargar la página.
- **Distribución por Rol**:
  - **Admin**: Notificaciones de stock bajo, nuevas ventas y órdenes pendientes.
  - **Vendedor**: Notificaciones de órdenes asignadas o pendientes.
  - **Cliente**: Alertas sobre cambios en el estado de sus pedidos (Pagado, Enviado, Entregado).

## 5. Pruebas y Calidad
- Se integró **Jest** y **Supertest** para pruebas de integración de API.
- Suite de pruebas inicial en `backend/src/tests/auth.test.js` para validar la integridad del sistema de permisos.

## 6. Auditoría y Trazabilidad
- Se ha implementado un sistema de auditoría formal utilizando una tabla `auditoria` en la base de datos.
- Se registran acciones como `LOGIN`, `CREAR_PRODUCTO`, `ACTUALIZAR_STOCK`, `CAMBIO_ESTADO_ORDEN`, etc.
- Cada registro incluye el `usuario_id`, la acción, los detalles en formato JSON, la IP y el timestamp.

## 7. Preparación para Producción y Despliegue
- **Base de Datos**: Soporte para conexiones SSL (necesario para servicios como Render o AWS).
- **Seguridad**: Configuración de CORS dinámica para permitir el acceso desde el dominio del frontend en producción.
- **Variables de Entorno**: Estructura optimizada para manejar diferentes entornos (desarrollo/producción).
