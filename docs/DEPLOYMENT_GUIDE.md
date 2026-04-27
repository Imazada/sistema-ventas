# 🚀 Guía de Despliegue - InventarioPro

Esta guía detalla los pasos necesarios para correr el proyecto en una nueva computadora.

## 📋 Prerrequisitos
- **Node.js**: v18 o superior.
- **PostgreSQL**: v14 o superior.
- **Git**: Para clonar el repositorio.

---

## 🛠️ Paso 1: Configuración de la Base de Datos
1. Abre tu terminal de PostgreSQL (`psql`) o una herramienta como pgAdmin.
2. Crea la base de datos:
   ```sql
   CREATE DATABASE bd_tienda;
   ```
3. Ejecuta el script de inicialización para crear tablas y triggers:
   - El archivo se encuentra en `/database/init.sql`.
4. (Opcional) Carga datos de prueba:
   - El archivo se encuentra en `/database/seed.sql`.

---

## ⚙️ Paso 2: Configuración del Backend
1. Entra a la carpeta: `cd backend`
2. Instala dependencias:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Configura variables de entorno:
   - Copia `.env.example` a un nuevo archivo `.env`.
   - Edita `.env` con las credenciales de TU base de datos (usuario y contraseña).
4. Inicia el servidor:
   ```bash
   npm run dev
   ```

---

## 💻 Paso 3: Configuración del Frontend
1. Entra a la carpeta: `cd frontend`
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura variables de entorno (opcional):
   - Copia `.env.example` a `.env`.
4. Inicia la aplicación:
   ```bash
   npm run dev
   ```

---

## ☁️ Paso 4: Despliegue en la Nube (Gratis con Render)

El proyecto está configurado para desplegarse fácilmente en **Render.com**.

### 1. Preparación en GitHub
1. Sube todo el código de este proyecto a un repositorio privado o público en tu cuenta de GitHub.

### 2. Configuración en Render
1. Crea una cuenta gratuita en [Render.com](https://render.com).
2. En el Dashboard, haz clic en **"New +"** y selecciona **"Blueprint"**.
3. Conecta tu cuenta de GitHub y selecciona el repositorio del proyecto.
4. Render detectará automáticamente el archivo `render.yaml` y te mostrará los servicios a crear (Base de Datos, Backend y Frontend).
5. Haz clic en **"Apply"**.

### 3. Ajustes Finales
Una vez creados los servicios, Render te dará URLs específicas (ej: `https://backend-xxx.onrender.com`).
1. Ve a la configuración del servicio **Backend** en Render y asegúrate de que `FRONTEND_URL` coincida con la URL de tu frontend.
2. Ve a la configuración del servicio **Frontend** y asegúrate de que `VITE_API_URL` apunte a la URL de tu backend seguida de `/api`.

### ⚠️ Notas importantes para el plan gratuito:
- **Base de Datos**: El plan gratuito de Render expira después de 90 días. Se recomienda hacer backups periódicos.
- **Spin-up**: Los servicios gratuitos "se duermen" tras 15 minutos de inactividad. La primera carga puede tardar unos 30 segundos.
