# 🚀 GUÍA COMPLETA DE DESPLIEGUE EN RENDER.COM (GRATUITO)

## ✅ Estado Actual
- ✅ `.env` removido del historial de GitHub
- ✅ Credenciales regeneradas
- ✅ Archivos `.env.example` actualizados
- ⏳ Listo para desplegar

---

## 📋 PASO 1: Crear Cuenta en Render.com

1. Ve a [render.com](https://render.com)
2. Haz clic en **"Sign Up"**
3. Crea cuenta con tu GitHub (más fácil)
4. Verifica tu email

---

## 🔧 PASO 2: Conectar tu Repositorio GitHub a Render

1. En Dashboard de Render → **"New +"** → **"Blueprint"**
2. Haz clic en **"Connect account"** y selecciona tu repositorio `sistema-ventas`
3. Render detectará automáticamente el archivo `render.yaml`

---

## 🌐 PASO 3: Configurar Variables de Entorno en Render

Render te mostrará un formulario para las variables. **COPIA EXACTAMENTE ESTAS** (reemplaza los valores):

### Para el servicio **Backend**:
```
DATABASE_URL = (Se genera automáticamente en Render)
JWT_SECRET = CbHjLqPVKwuYDsWITaZNkRmXpyigxcMd
NODE_ENV = production
FRONTEND_URL = https://frontend-gestion-productos.onrender.com
PORT = 3000
```

### Para el servicio **Frontend**:
```
VITE_API_URL = https://backend-gestion-productos.onrender.com/api
```

---

## 🗄️ PASO 4: Crear Base de Datos en Render

1. Render creará **automáticamente** una base de datos PostgreSQL
2. Esta base de datos se vinculará al backend (variable `DATABASE_URL`)
3. El archivo `database/init.sql` NO se ejecuta automáticamente

### ⚠️ IMPORTANTE: Ejecutar Scripts SQL

Una vez que se cree el servicio, necesitas ejecutar los scripts de inicialización:

#### Opción A: Usar pgAdmin web de Render (más fácil)
1. En el Dashboard de Render → Tu servicio de BD
2. Busca "Connect" → "Internal Database URL" o "pgAdmin"
3. Abre pgAdmin
4. Copia y pega el contenido de `database/init.sql`
5. Ejecuta los scripts en orden:
   - `001_initial_schema.sql`
   - `002_create_users_roles.sql`
   - `003_create_carts_orders.sql`
   - `004_create_movements.sql`
   - `005_add_image_to_products.sql`

#### Opción B: Usar terminal (si tienes acceso)
```bash
psql $DATABASE_URL < database/init.sql
```

---

## ✨ PASO 5: Desplegar

1. Haz clic en **"Apply"** en Render
2. Verás el progreso de cada servicio
3. Espera a que todos los servicios tengan estado **"Live"**
4. Esto puede tomar 5-10 minutos

---

## 🧪 PASO 6: Probar tu Aplicación

1. Render te dará URLs como:
   - **Frontend**: `https://frontend-gestion-productos.onrender.com`
   - **Backend**: `https://backend-gestion-productos.onrender.com`

2. Abre la URL del frontend en tu navegador
3. Intenta:
   - **Registrarse** (crear un usuario nuevo)
   - **Iniciar sesión**
   - **Ver productos** (si ejecutaste `seed.sql`)

---

## ⚠️ NOTAS IMPORTANTES

### Plan Gratuito de Render:
- **Inactividad**: Los servicios "duermen" después de 15 min sin usar → primera carga tarda ~30 seg
- **Base de datos**: Expira después de 90 días → hacer backups
- **Memoria**: Limitada pero suficiente para esta app

### Base de Datos:
- Si ejecutaste `seed.sql` en tu máquina, **los datos NO se migran automáticamente**
- Necesitas ejecutar los scripts SQL nuevamente en Render
- Los nuevos datos que crees en Render se guardarán

### URLs Dinámicas:
```
BACKEND RENDER URL: https://backend-gestion-productos.onrender.com
FRONTEND RENDER URL: https://frontend-gestion-productos.onrender.com

(Estas serán generadas automáticamente por Render)
```

---

## 🆘 Solución de Problemas

### El backend devuelve error 404
→ Verifica que `FRONTEND_URL` esté correcto en variables de entorno

### El frontend no puede conectar al backend
→ Verifica que `VITE_API_URL` apunte al backend correcto + `/api`

### La BD está vacía
→ Ejecuta los scripts SQL manualmente en pgAdmin de Render

### El servicio tarda mucho en responder
→ Normal en plan gratuito (está en "reposo"), espera 30 segundos

---

## 📱 Estructura de Roles y Autenticación (Ya Implementada)

Tu sistema tiene:
- **JWT Authentication**: Tokens seguros para usuarios
- **Roles**: `admin`, `vendedor`, `cliente` (configurables en BD)
- **Rutas Protegidas**: Frontend valida rutas según rol

Nada que hacer aquí, ¡ya está listo! ✅

---

## 🔐 Credenciales de Seguridad

### Contraseña de BD (Render la genera automáticamente)
- Render crea automáticamente un usuario seguro
- La verás en la variable `DATABASE_URL`

### JWT_SECRET (Mantén esto SECRETO)
```
CbHjLqPVKwuYDsWITaZNkRmXpyigxcMd
```
**⚠️ Copia esto en Render SOLO en variables de entorno, NUNCA en código**

---

## 📝 Checklist Final

- [ ] Cuenta creada en Render.com
- [ ] Repositorio GitHub conectado
- [ ] Variables de entorno configuradas en Render
- [ ] BD PostgreSQL creada automáticamente
- [ ] Scripts SQL ejecutados en pgAdmin de Render
- [ ] Frontend desplegado y accesible
- [ ] Backend desplegado y responde
- [ ] Login funciona
- [ ] Productos se muestran
- [ ] Carrito funciona
- [ ] Órdenes se pueden crear
- [ ] Reportes están disponibles

---

¡Listo para desplegar! 🚀

