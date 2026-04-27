# InventarioPro - Sistema de Gestión de Productos

Sistema profesional para la gestión de inventario, análisis de rendimiento y generación de reportes automáticos.

## 🚀 Inicio Rápido en una Nueva Computadora

Para correr este proyecto en otro equipo, sigue estos pasos esenciales (consulta la [Guía de Despliegue Detallada](./docs/DEPLOYMENT_GUIDE.md) para más info):

### 1. Prerrequisitos
- Tener instalado **Node.js** (v18+) y **PostgreSQL** (v14+).

### 2. Base de Datos
- Crea una base de datos llamada `bd_tienda`.
- Ejecuta los scripts en este orden:
  1. `database/init.sql` (Estructura)
  2. `database/seed.sql` (Datos de prueba opcionales)

### 3. Backend
- Ve a la carpeta `backend/`.
- Copia `.env.example` a `.env` y coloca tu usuario y contraseña de Postgres.
- Ejecuta: `npm install --legacy-peer-deps` y luego `npm run dev`.

### 4. Frontend
- Ve a la carpeta `frontend/`.
- Ejecuta: `npm install` y luego `npm run dev`.
- Abre [http://localhost:5173](http://localhost:5173).

## 🛠️ Tecnologías Principales
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Node.js, Express, Sequelize ORM (PostgreSQL).
- **Comunicación**: Polling para notificaciones en tiempo real.
- **Reportes**: jsPDF + AutoTable para reportes operacionales y de gestión.

## ✨ Funcionalidades Destacadas
- **Sistema de Notificaciones**: Alertas automáticas por stock bajo, nuevas ventas y cambios en el estado de pedidos, personalizadas por rol (Admin, Vendedor, Cliente).
- **Análisis de Negocio**: Dashboard avanzado con KPIs, tendencias de ventas, ticket promedio y análisis de rentabilidad por producto.
- **Gestión Multi-Rol**: Control de acceso granular para Administradores (control total), Vendedores (inventario y ventas) y Clientes (catálogo y compras).
- **Reportes Profesionales**: Generación de PDFs detallados para inventario y métricas de gestión.
- **Auditoría**: Registro automático de acciones críticas para seguridad y trazabilidad.

## 📂 Estructura del Proyecto
- `backend/`: API REST y lógica de negocio.
- `frontend/`: Interfaz de usuario SPA.
- `database/`: Scripts SQL y migraciones.
- `docs/`: Documentación técnica y manuales.
