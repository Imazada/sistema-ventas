# Manual de Usuario - InventarioPro

Este manual describe las funciones principales del sistema según el rol del usuario.

## 🔑 Roles y Accesos

### 🛠️ Administrador (Admin)
Tiene control total sobre el sistema.
- **Dashboard**: Visualiza métricas de ventas, tendencias, rentabilidad y KPIs en tiempo real.
- **Gestión de Productos**: Puede crear, editar, eliminar y gestionar el stock de todos los productos.
- **Gestión de Usuarios**: Puede crear cuentas para vendedores, cambiar roles y activar/desactivar usuarios.
- **Gestión de Órdenes**: Puede ver todas las órdenes del sistema y cambiar sus estados.
- **Notificaciones**: Recibe alertas de stock bajo y nuevas ventas.
- **Reportes**: Genera reportes operacionales y de gestión en PDF.

### 💼 Vendedor
Enfocado en la operación diaria de inventario y pedidos.
- **Dashboard**: Visualiza métricas básicas y órdenes recientes.
- **Gestión de Productos**: Puede ver la lista de productos y consultar el stock, pero no puede crear ni eliminar (Solo lectura).
- **Gestión de Órdenes**: Puede gestionar los pedidos, cambiar estados (ej: de Pagado a Enviado) y ver detalles.
- **Notificaciones**: Recibe alertas de órdenes pendientes de procesar.

### 👤 Cliente
Usuario final que realiza compras.
- **Catálogo**: Explora productos, busca por nombre o categoría.
- **Carrito**: Gestiona productos antes de realizar la compra.
- **Checkout**: Proceso de pago y generación de orden.
- **Mis Órdenes**: Historial personal de compras con seguimiento de estados.
- **Notificaciones**: Recibe alertas cuando el estado de su pedido cambia (ej: su pedido ha sido enviado).

## 🚀 Flujos Principales

### 1. Realizar una Compra (Cliente)
1. Navegue al catálogo y añada productos al carrito.
2. Haga clic en el icono del carrito y seleccione "Ir al Checkout".
3. Complete los datos de envío y confirme el pedido.
4. Recibirá una notificación confirmando su orden.

### 2. Gestionar un Pedido (Admin/Vendedor)
1. Inicie sesión y vaya a la sección "Gestión de Órdenes".
2. Localice la orden deseada y haga clic en "Ver Detalles".
3. Cambie el estado según corresponda (ej: de "Pendiente" a "Pagado" tras recibir el comprobante).
4. El sistema notificará automáticamente al cliente sobre el cambio.

### 3. Generar Reportes (Admin)
1. Vaya a la sección "Reportes".
2. Elija entre "Reporte Operacional" (Listado de stock) o "Reporte de Gestión" (Análisis de rendimiento).
3. Utilice los filtros si es necesario y haga clic en "Generar PDF".
