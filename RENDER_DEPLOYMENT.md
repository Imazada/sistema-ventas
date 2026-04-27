# 🚀 GUÍA COMPLETA DE DESPLIEGUE EN RENDER.COM (SIN BLUEPRINT - EVITANDO CARGOS)

## ✅ Estado Actual
- ✅ `.env` removido del historial de GitHub
- ✅ Credenciales regeneradas
- ✅ Archivos `.env.example` actualizados
- ⏳ Listo para desplegar (MÉTODO MANUAL para control total)

---

## ⚠️ ¿Por Qué No Usar Blueprint?

Blueprint en Render puede causar cargos inesperados. Usaremos el método **MANUAL** para:
- ✅ Control total sobre cada servicio
- ✅ Ver exactamente qué se está creando
- ✅ Evitar sorpresas de facturación
- ✅ Asegurar que todo esté en plan gratuito

---

## 📋 PASO 1: Crear Cuenta en Render.com

1. Ve a [render.com](https://render.com)
2. Haz clic en **"Sign Up"**
3. Crea cuenta con tu GitHub (más fácil)
4. Verifica tu email
5. Ve al Dashboard

---

## 🗄️ PASO 2: Crear Base de Datos PostgreSQL

1. En Dashboard → **"New +"** → **"PostgreSQL"**
2. Completa el formulario:
   - **Name**: `bd_tienda`
   - **Region**: Elige la más cercana a ti
   - **PostgreSQL Version**: 15 o superior
   - **Plan**: ⚠️ **FREE** (importante: aparece arriba como opción)
3. Haz clic en **"Create Database"**
4. **ESPERA** a que se cree (5-10 minutos)

### Guardar la Connection String

Una vez creada:
1. Ve a tu BD en el Dashboard
2. Busca la sección **"Connections"**
3. Copia la **"Internal Database URL"** o **"External Database URL"**
4. Guárdala en un archivo de texto (la necesitarás en el PASO 4)

Debería verse así:
```
postgresql://user:password@host.render.com:5432/dbname
```

---

## ⚙️ PASO 3: Crear Servicio Backend

1. En Dashboard → **"New +"** → **"Web Service"**
2. Completa el formulario:
   - **Repository**: Selecciona `sistema-ventas`
   - **Name**: `backend-gestion-productos`
   - **Region**: Misma región que la BD
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install --legacy-peer-deps`
   - **Start Command**: `npm start`
   - **Plan**: ⚠️ **FREE** (importante)
3. Haz clic en **"Create Web Service"**
4. **ESPERA** a que empiece el build (ve la barra de progreso)

---

## 🔧 PASO 4: Configurar Variables de Entorno - Backend

Una vez que se empieza el build del backend:

1. En el servicio Backend → Ve a la pestaña **"Environment"** (a la izquierda)
2. Haz clic en **"Add Environment Variable"** para cada una:

   ```
   DATABASE_URL = [PEGA LA URL QUE COPIASTE EN PASO 2]
   
   JWT_SECRET = CbHjLqPVKwuYDsWITaZNkRmXpyigxcMd
   
   NODE_ENV = production
   
   FRONTEND_URL = https://frontend-gestion-productos.onrender.com
   
   PORT = 3000
   ```

3. Haz clic en **"Save"** 
4. El servicio se reiniciará automáticamente con las nuevas variables

---

## 🎨 PASO 5: Crear Servicio Frontend

1. En Dashboard → **"New +"** → **"Static Site"**
2. Completa el formulario:
   - **Repository**: Selecciona `sistema-ventas`
   - **Name**: `frontend-gestion-productos`
   - **Region**: Misma región que los otros servicios
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: ⚠️ **FREE** (importante)
3. Haz clic en **"Create Static Site"**
4. **ESPERA** a que empiece el build

---

## 🌐 PASO 6: Configurar Variables de Entorno - Frontend

Una vez que el frontend esté creado:

1. En el servicio Frontend → Ve a la pestaña **"Environment"**
2. Haz clic en **"Add Environment Variable"**:

   ```
   VITE_API_URL = https://backend-gestion-productos.onrender.com/api
   ```

3. Haz clic en **"Save"**
4. El sitio se reconstruirá automáticamente

---

## 📊 PASO 7: Esperar a que se Completen los Despliegues

Ahora tienes que esperar a que ambos servicios lleguen a estado **"Live"**:

- **Backend**: Mira la pestaña "Logs" para ver el progreso
- **Frontend**: Verás "Building..." y luego "Live"

**Tiempo estimado**: 10-15 minutos

Durante este tiempo puedes:
- Preparar los scripts SQL
- Leer la sección de "Solución de Problemas"
- Tomar un café ☕

---

## 💾 PASO 8: Ejecutar Scripts SQL en la Base de Datos

Una vez que todo esté "Live":

1. En tu BD (en Dashboard de Render) → Ve a **"Connect"**
2. Busca y copia la **"External Database URL"** (la que empieza con postgresql://)
3. En tu terminal local, ve a la carpeta del proyecto:
   ```bash
   cd "c:\Users\User\Downloads\Mantenedor Productos"
   ```
4. Ejecuta los scripts SQL:
   ```bash
   psql "[PEGA_LA_URL_AQUI]" < database/init.sql
   ```

### ¿No tienes psql instalado en tu máquina?

Si psql no está disponible, usa pgAdmin de Render (método manual):

1. En Dashboard Render → Tu BD (bd_tienda)
2. Ve a **"Connections"** → Busca **"pgAdmin"**
3. Abre pgAdmin (puede pedir credenciales)
4. Navega a tu base de datos
5. Abre **"Query Tool"**
6. Copia el contenido de `database/init.sql` y pégalo
7. Ejecuta (botón Play o Ctrl+Enter)

---

## 🧪 PASO 9: Probar la Aplicación

1. Abre tu navegador y ve a:
   ```
   https://frontend-gestion-productos.onrender.com
   ```

2. Intenta:
   - **Registrarse** (crear un usuario nuevo)
   - **Iniciar sesión** con ese usuario
   - **Ver productos** (aparecerá una lista)
   - **Agregar productos al carrito**
   - **Crear una orden**
   - **Ver reportes** (si tu rol tiene acceso)

3. Si todo funciona → ¡FELICIDADES! Tu sistema está en producción 🎉

---

## ⚠️ Notas Importantes para el Plan Gratuito

### Base de Datos
- Expira después de **90 días** ⏰
- Haz backups regularmente
- Los datos se pierden después de 90 días si no haces backup

### Servicios Web
- Se "duermen" después de **15 minutos sin actividad**
- Primera carga tarda ~30 segundos (mientras se despiertan)
- Después de eso, es rápido

### Limite de Recursos
- RAM: Limitada pero suficiente para esta app
- CPU: Compartida
- Base de datos: 1 GB de almacenamiento

---

## 🔐 Seguridad

✅ **Lo que ya está seguro**:
- `.env` NO está en GitHub
- Credenciales en Render (no en código)
- JWT_SECRET en variables de entorno

⚠️ **Lo que debes vigilar**:
- No compartas la DATABASE_URL con nadie
- JWT_SECRET debe ser secreto
- Cambia estas credenciales cada cierto tiempo

---

## 🆘 Solución de Problemas

### El frontend dice "Cannot connect to API"
→ Verifica que `VITE_API_URL` sea correcto en variables del frontend
→ Espera 30 segundos (el backend puede estar despertándose)

### El backend devuelve 502 Bad Gateway
→ Mira los logs del servicio Backend en Render
→ Verifica que `DATABASE_URL` sea correcta
→ Asegúrate de que la BD está "Live"

### Los productos no se muestran
→ Verifica que ejecutaste los scripts SQL (PASO 8)
→ Abre pgAdmin y verifica que las tablas existen

### La BD se ve vacía
→ Normal si NO ejecutaste `seed.sql`
→ Necesitas crear datos manualmente o ejecutar el seed

### El login no funciona
→ Asegúrate de haber ejecutado `001_initial_schema.sql` y `002_create_users_roles.sql`
→ Verifica que JWT_SECRET coincida en el backend

---

## 📈 Monitoreo

Render te proporciona:
- **Logs**: Ve qué está pasando en cada servicio
- **Metrics**: CPU, RAM, solicitudes
- **Uptime**: Disponibilidad del servicio

Revisa periódicamente en el Dashboard.

---

## 🎯 Checklist Finalización

- [ ] Cuenta creada en Render.com
- [ ] Base de Datos PostgreSQL creada (en plan FREE)
- [ ] Servicio Backend creado
- [ ] Servicios Backend con variables configuradas
- [ ] Servicio Frontend creado
- [ ] Frontend con VITE_API_URL configurado
- [ ] Ambos servicios en estado "Live"
- [ ] Scripts SQL ejecutados en la BD
- [ ] Frontend accesible en HTTPS
- [ ] Backend respondiendo
- [ ] Login funciona
- [ ] Productos se muestran
- [ ] Carrito funciona
- [ ] Órdenes se pueden crear
- [ ] Sistema completamente en producción ✅

---

## 💡 Tips Finales

1. **Guarda tus credenciales**: Copia la DATABASE_URL en un lugar seguro
2. **Backup regular**: Cada 30 días, descarga un backup de la BD
3. **Monitoreo**: Revisa los logs en Render regularmente
4. **Actualizaciones**: Cuando hagas cambios en GitHub, Render redespliega automáticamente
5. **Costos**: Monitorea el plan gratuito para no exceder límites

---

¡Tu sistema está listo para ser usado en producción! 🚀

