# 🏗️ ARQUITECTURA TÉCNICA DEL SISTEMA

## 📐 ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIOS (Web/Tablet/PC)                │
│                                                             │
│  Admin Dashboard | Supervisor Panel | Operario Panel      │
│  Modo Reunión   | Modo TV          | Notificaciones       │
└────────────────────┬──────────────────────────────────────┘
                     │ HTTP/HTTPS
                     │
┌────────────────────▼──────────────────────────────────────┐
│              FRONTEND (React + Vite)                      │
│                                                            │
│  ├─ Pages (Screens)                                       │
│  ├─ Components (Reusables)                               │
│  ├─ Hooks (Custom logic)                                 │
│  ├─ Store (Zustand)                                      │
│  ├─ API (Fetch/Axios)                                    │
│  └─ WebSocket (Socket.io client)                         │
└────────────────────┬──────────────────────────────────────┘
                     │ REST API + WebSocket
                     │
┌────────────────────▼──────────────────────────────────────┐
│          BACKEND (Express + Node.js)                      │
│                                                            │
│  ├─ Routes (API endpoints)                               │
│  ├─ Controllers (Logic)                                  │
│  ├─ Middleware (Auth, CORS, etc)                         │
│  ├─ Services (Business logic)                            │
│  ├─ WebSocket (Socket.io)                                │
│  └─ Database client (Supabase-js)                        │
└────────────────────┬──────────────────────────────────────┘
                     │ SQL
                     │
┌────────────────────▼──────────────────────────────────────┐
│           DATABASE (Supabase / PostgreSQL)                │
│                                                            │
│  ├─ Usuarios                                              │
│  ├─ Máquinas                                              │
│  ├─ Órdenes de trabajo                                   │
│  ├─ Componentes reemplazables                            │
│  ├─ Repuestos                                            │
│  ├─ Historial (Auditoría)                                │
│  └─ KPIs (Métricas)                                      │
└────────────────────────────────────────────────────────────┘
```

---

## 📁 ESTRUCTURA DE CARPETAS

```
proyecto-mantenimiento/
│
├─── frontend/                          # React app
│    ├─ src/
│    │  ├─ pages/
│    │  │  ├─ LoginPage.jsx
│    │  │  ├─ DashboardPage.jsx
│    │  │  ├─ SupervisorPage.jsx
│    │  │  ├─ OperarioPage.jsx
│    │  │  ├─ ModoReunionPage.jsx
│    │  │  ├─ ModoTVPage.jsx
│    │  │  └─ AdminPage.jsx
│    │  │
│    │  ├─ components/
│    │  │  ├─ OT/
│    │  │  │  ├─ OTCard.jsx
│    │  │  │  ├─ OTForm.jsx
│    │  │  │  ├─ OTDetail.jsx
│    │  │  │  └─ OTList.jsx
│    │  │  │
│    │  │  ├─ Kanban/
│    │  │  │  ├─ KanbanBoard.jsx
│    │  │  │  ├─ KanbanColumn.jsx
│    │  │  │  └─ KanbanCard.jsx
│    │  │  │
│    │  │  ├─ TV/
│    │  │  │  ├─ TVScreen.jsx
│    │  │  │  ├─ KPIScreen.jsx
│    │  │  │  ├─ TarjetasScreen.jsx
│    │  │  │  ├─ ProgressScreen.jsx
│    │  │  │  └─ TVToggle.jsx
│    │  │  │
│    │  │  ├─ Dashboard/
│    │  │  │  ├─ KPICard.jsx
│    │  │  │  ├─ ChartOT.jsx
│    │  │  │  ├─ MachineMap.jsx
│    │  │  │  └─ StockAlert.jsx
│    │  │  │
│    │  │  ├─ Repuestos/
│    │  │  │  ├─ RepuestoForm.jsx
│    │  │  │  ├─ RepuestoList.jsx
│    │  │  │  ├─ StockControl.jsx
│    │  │  │  └─ AlertaStock.jsx
│    │  │  │
│    │  │  ├─ Componentes/
│    │  │  │  ├─ ComponenteForm.jsx
│    │  │  │  ├─ InstanciaForm.jsx
│    │  │  │  ├─ ComponenteDetail.jsx
│    │  │  │  └─ HistorialComponente.jsx
│    │  │  │
│    │  │  ├─ Common/
│    │  │  │  ├─ Header.jsx
│    │  │  │  ├─ Sidebar.jsx
│    │  │  │  ├─ Navbar.jsx
│    │  │  │  ├─ Notification.jsx
│    │  │  │  └─ Modal.jsx
│    │  │  │
│    │  │  └─ Admin/
│    │  │     ├─ UserManagement.jsx
│    │  │     ├─ MaquinaManagement.jsx
│    │  │     ├─ ConfigSystem.jsx
│    │  │     └─ Backup.jsx
│    │  │
│    │  ├─ hooks/
│    │  │  ├─ useOrdenes.js
│    │  │  ├─ useRepuestos.js
│    │  │  ├─ useComponentes.js
│    │  │  ├─ useKPIs.js
│    │  │  ├─ useWebSocket.js
│    │  │  ├─ useAuth.js
│    │  │  └─ useMachines.js
│    │  │
│    │  ├─ store/
│    │  │  ├─ authStore.js
│    │  │  ├─ otStore.js
│    │  │  ├─ repuestosStore.js
│    │  │  ├─ componentesStore.js
│    │  │  ├─ uiStore.js
│    │  │  └─ tvStore.js
│    │  │
│    │  ├─ services/
│    │  │  ├─ api.js
│    │  │  ├─ socket.js
│    │  │  ├─ supabase.js
│    │  │  └─ notifications.js
│    │  │
│    │  ├─ utils/
│    │  │  ├─ constants.js
│    │  │  ├─ validators.js
│    │  │  ├─ formatters.js
│    │  │  ├─ helpers.js
│    │  │  └─ dates.js
│    │  │
│    │  ├─ styles/
│    │  │  ├─ globals.css
│    │  │  ├─ colors.css
│    │  │  ├─ animations.css
│    │  │  └─ responsive.css
│    │  │
│    │  ├─ App.jsx
│    │  ├─ main.jsx
│    │  └─ index.css
│    │
│    ├─ public/
│    │  ├─ favicon.ico
│    │  └─ logo.svg
│    │
│    ├─ .env.example
│    ├─ .gitignore
│    ├─ package.json
│    ├─ vite.config.js
│    ├─ tailwind.config.js
│    └─ postcss.config.js
│
├─── backend/                           # Express server
│    ├─ src/
│    │  ├─ routes/
│    │  │  ├─ auth.js
│    │  │  ├─ ordenes.js
│    │  │  ├─ repuestos.js
│    │  │  ├─ componentes.js
│    │  │  ├─ maquinas.js
│    │  │  ├─ usuarios.js
│    │  │  ├─ reportes.js
│    │  │  └─ kpis.js
│    │  │
│    │  ├─ controllers/
│    │  │  ├─ authController.js
│    │  │  ├─ ordenesController.js
│    │  │  ├─ repuestosController.js
│    │  │  ├─ componentesController.js
│    │  │  ├─ maquinasController.js
│    │  │  ├─ usuariosController.js
│    │  │  ├─ reportesController.js
│    │  │  └─ kpisController.js
│    │  │
│    │  ├─ services/
│    │  │  ├─ authService.js
│    │  │  ├─ ordenesService.js
│    │  │  ├─ repuestosService.js
│    │  │  ├─ componentesService.js
│    │  │  ├─ maquinasService.js
│    │  │  ├─ usuariosService.js
│    │  │  ├─ reportesService.js
│    │  │  └─ kpisService.js
│    │  │
│    │  ├─ middleware/
│    │  │  ├─ auth.js
│    │  │  ├─ errorHandler.js
│    │  │  ├─ cors.js
│    │  │  ├─ validation.js
│    │  │  ├─ logging.js
│    │  │  └─ rateLimiter.js
│    │  │
│    │  ├─ socket/
│    │  │  ├─ socketHandler.js
│    │  │  ├─ eventos.js
│    │  │  ├─ handlers/
│    │  │  │  ├─ otHandler.js
│    │  │  │  ├─ repuestoHandler.js
│    │  │  │  ├─ componenteHandler.js
│    │  │  │  └─ tvHandler.js
│    │  │  │
│    │  │  └─ rooms.js
│    │  │
│    │  ├─ db/
│    │  │  ├─ supabase.js
│    │  │  ├─ queries/
│    │  │  │  ├─ ordenes.queries.js
│    │  │  │  ├─ repuestos.queries.js
│    │  │  │  ├─ componentes.queries.js
│    │  │  │  ├─ kpis.queries.js
│    │  │  │  └─ usuarios.queries.js
│    │  │  │
│    │  │  └─ triggers/
│    │  │     ├─ actualizarStock.sql
│    │  │     ├─ actualizarKPIs.sql
│    │  │     ├─ auditoria.sql
│    │  │     └─ alertas.sql
│    │  │
│    │  ├─ utils/
│    │  │  ├─ constants.js
│    │  │  ├─ validators.js
│    │  │  ├─ helpers.js
│    │  │  ├─ jwt.js
│    │  │  ├─ logger.js
│    │  │  └─ errors.js
│    │  │
│    │  ├─ config/
│    │  │  ├─ database.js
│    │  │  ├─ server.js
│    │  │  ├─ socket.js
│    │  │  └─ jwt.js
│    │  │
│    │  └─ app.js
│    │
│    ├─ .env.example
│    ├─ .gitignore
│    ├─ package.json
│    ├─ server.js
│    └─ nodemon.json
│
├─── db/                                # Scripts SQL
│    ├─ schema/
│    │  ├─ 00_initial.sql
│    │  ├─ 01_usuarios.sql
│    │  ├─ 02_maquinas.sql
│    │  ├─ 03_ordenes_trabajo.sql
│    │  ├─ 04_repuestos.sql
│    │  ├─ 05_componentes.sql
│    │  ├─ 06_reparaciones_externas.sql
│    │  ├─ 07_historial.sql
│    │  ├─ 08_kpis.sql
│    │  └─ 09_indices.sql
│    │
│    ├─ triggers/
│    │  ├─ actualizar_stock.sql
│    │  ├─ calcular_kpis.sql
│    │  ├─ auditoria.sql
│    │  └─ alertas.sql
│    │
│    ├─ policies/
│    │  ├─ usuarios.rls.sql
│    │  ├─ ordenes.rls.sql
│    │  ├─ repuestos.rls.sql
│    │  └─ componentes.rls.sql
│    │
│    ├─ seeds/
│    │  ├─ usuarios.sql
│    │  ├─ maquinas.sql
│    │  ├─ repuestos.sql
│    │  └─ demo_data.sql
│    │
│    └─ setup.sh
│
├─── docs/                              # Documentación
│    ├─ MVP_DEFINICION_FINAL.md
│    ├─ MODO_REUNION_KANBAN.md
│    ├─ MODO_TV_ROTACION.md
│    ├─ RESUMEN_EJECUTIVO.md
│    ├─ ARQUITECTURA_TECNICA.md
│    ├─ API_ENDPOINTS.md
│    ├─ SETUP_GUIDE.md
│    └─ DEPLOYMENT.md
│
├─── .github/
│    ├─ workflows/
│    │  ├─ frontend-deploy.yml
│    │  ├─ backend-deploy.yml
│    │  └─ tests.yml
│    │
│    └─ ISSUE_TEMPLATE.md
│
├─ .gitignore
├─ README.md
├─ package.json (root)
├─ docker-compose.yml (opcional)
└─ DEPLOYMENT.md

```

---

## 🔌 API ENDPOINTS

```
AUTH:
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/register
GET    /api/auth/me
POST   /api/auth/refresh

ÓRDENES:
GET    /api/ordenes
POST   /api/ordenes
GET    /api/ordenes/:id
PATCH  /api/ordenes/:id
DELETE /api/ordenes/:id
PATCH  /api/ordenes/:id/estado
PATCH  /api/ordenes/:id/asignar
POST   /api/ordenes/:id/completar

REPUESTOS:
GET    /api/repuestos
POST   /api/repuestos
GET    /api/repuestos/:id
PATCH  /api/repuestos/:id
DELETE /api/repuestos/:id
GET    /api/repuestos/stock/bajo

COMPONENTES:
GET    /api/componentes
POST   /api/componentes
GET    /api/componentes/:id
PATCH  /api/componentes/:id
POST   /api/componentes/:id/instancias
PATCH  /api/componentes/:id/instancias/:instanId
GET    /api/componentes/:id/historial

MÁQUINAS:
GET    /api/maquinas
POST   /api/maquinas
GET    /api/maquinas/:id
PATCH  /api/maquinas/:id

USUARIOS:
GET    /api/usuarios
POST   /api/usuarios
GET    /api/usuarios/:id
PATCH  /api/usuarios/:id
DELETE /api/usuarios/:id

KPIS:
GET    /api/kpis
GET    /api/kpis/disponibilidad
GET    /api/kpis/mttr
GET    /api/kpis/mtbf
GET    /api/kpis/costos

REPORTES:
GET    /api/reportes/ot
GET    /api/reportes/disponibilidad
GET    /api/reportes/costos
GET    /api/reportes/export-pdf
GET    /api/reportes/export-excel
```

---

## 🔌 WEBSOCKET EVENTOS

```
CONNECTION:
- connect
- disconnect
- auth (verificar usuario)

OT EVENTS:
- ot:create → nueva OT creada
- ot:update → OT actualizada
- ot:estado-cambio → cambio de estado
- ot:asignar → nueva asignación
- ot:completar → OT completada
- ot:delete → OT eliminada

REPUESTO EVENTS:
- repuesto:stock-cambio → stock actualizado
- repuesto:stock-bajo → alerta stock bajo
- repuesto:crear
- repuesto:eliminar

COMPONENTE EVENTS:
- componente:estado-cambio → cambio estado
- componente:envio-externo → enviado a proveedor
- componente:recepcion → recibido de proveedor

TV EVENTS:
- tv:conectar → TV conectada
- tv:desconectar → TV desconectada
- tv:cambio-pantalla → cambio en rotación
- tv:modo-reunion → entrar a modo reunión
- tv:modo-rotacion → volver a rotación

NOTIFICACIONES:
- notificacion:nueva
- notificacion:leida
- notificacion:eliminar
- alerta:critica
- alerta:stock-bajo
```

---

## 🗄️ VARIABLES DE ENTORNO

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
VITE_APP_NAME=Sistema Mantenimiento
```

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DB_URL=postgresql://user:pass@localhost:5432/mantenimiento
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=xxxxx
JWT_SECRET=xxxxx
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
WS_PORT=3000
LOG_LEVEL=debug
```

---

## 📦 DEPENDENCIAS PRINCIPALES

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "zustand": "^4.x",
    "react-beautiful-dnd": "^13.x",
    "socket.io-client": "^4.x",
    "@supabase/supabase-js": "^2.x",
    "axios": "^1.x",
    "date-fns": "^2.x",
    "chart.js": "^3.x",
    "react-chartjs-2": "^4.x"
  },
  "devDependencies": {
    "vite": "^4.x",
    "@vitejs/plugin-react": "^3.x",
    "tailwindcss": "^3.x",
    "eslint": "^8.x",
    "prettier": "^2.x"
  }
}
```

### Backend
```json
{
  "dependencies": {
    "express": "^4.x",
    "socket.io": "^4.x",
    "cors": "^2.x",
    "@supabase/supabase-js": "^2.x",
    "jsonwebtoken": "^9.x",
    "bcryptjs": "^2.x",
    "dotenv": "^16.x",
    "winston": "^3.x",
    "express-validator": "^7.x"
  },
  "devDependencies": {
    "nodemon": "^2.x",
    "eslint": "^8.x",
    "jest": "^29.x"
  }
}
```

---

## 🚀 SCRIPTS DE DESARROLLO

### Frontend (package.json)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "format": "prettier --write src",
    "test": "vitest"
  }
}
```

### Backend (package.json)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint src",
    "migrate": "node src/db/migrate.js"
  }
}
```

---

## 📋 PRÓXIMOS PASOS

```
1. ✅ Especificación completada
2. 🔜 CREAR ESTRUCTURA INICIAL
   - Carpetas base
   - package.json
   - .env.example
   
3. 🔜 SETUP BASE DE DATOS
   - Crear proyecto Supabase
   - Ejecutar scripts SQL
   - Configurar RLS policies
   
4. 🔜 AUTENTICACIÓN
   - Login/Register
   - JWT tokens
   - Protected routes
   
5. 🔜 OT CRUD
   - Crear/editar/eliminar
   - Cambiar estado
   - Asignación
   
6. 🔜 WEBSOKET + SINCRONIZACIÓN
   - Conectar Socket.io
   - Eventos tiempo real
   - Notificaciones
   
7. 🔜 MODO REUNIÓN
   - Kanban board
   - Drag-and-drop
   - Filtros
   
8. 🔜 MODO TV
   - Rotación automática
   - Toggle conexión
   - KPIs + Tarjetas
   
9. 🔜 DEPLOYMENT
   - Vercel (frontend)
   - Railway (backend)
   - Supabase setup
```

---

*Arquitectura finalizada: 5 de noviembre de 2025*
