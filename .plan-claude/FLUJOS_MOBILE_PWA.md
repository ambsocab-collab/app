# 📱 FLUJOS ESPECÍFICOS - MOBILE PWA

## FLUJO 1: INSTALACIÓN APP (Primera vez)

```
PASO 1: Usuario abre app en navegador
├─ URL: mantenimiento.vercel.app
├─ PWA manifest.json carga
└─ Service worker se registra

┌─────────────────────────────┐
│ < Mantenimiento             │ ← URL visible
├─────────────────────────────┤
│ [Loading...]                │
│ Inicializando app...        │
└─────────────────────────────┘

PASO 2: Auth (Si no está logueado)
├─ Redirect a /login
├─ Formulario email + password
└─ Guardar en localStorage (token JWT)

┌─────────────────────────────┐
│ < Login                     │
├─────────────────────────────┤
│ Email                       │
│ [______________]            │
│ Contraseña                  │
│ [______________]            │
│ [ENTRAR]                    │
└─────────────────────────────┘

PASO 3: Después de login
├─ Caché inicial descarga
│  ├─ Órdenes del usuario
│  ├─ Repuestos stock
│  ├─ Componentes taller
│  └─ KPIs principales
├─ Skeleton screens aparecen
└─ Data reemplaza esqueletos

PASO 4: Browser muestra "Instalar"
├─ A los 2+ visitios
├─ En 5 minutos de uso
├─ Banner OR Add to home screen

┌─────────────────────────────┐
│ 📱 Instalar app             │ ← Banner
│ Accede rápido desde        │
│ tu pantalla de inicio      │
│ [NO] [INSTALAR]             │
└─────────────────────────────┘

O (iOS):
├─ Tap Share
├─ "Add to Home Screen"
└─ App añadida a pantalla

PASO 5: App instalada
├─ Nuevo icono en pantalla de inicio
├─ Abre sin URL bar (fullscreen)
├─ Funciona offline
├─ Push notifications habilitadas
└─ Appearance: "standalone"
```

---

## FLUJO 2: TRABAJAR ONLINE vs OFFLINE

```
SCENARIO A: CON CONEXIÓN (Online)

┌─────────────────────────────┐
│ 🏠 Home                     │
├─────────────────────────────┤
│ Buenos días, Juan           │
│                             │
│ 📊 Disponibilidad           │ ← Datos actualizados
│ ████████░░ 92%             │    desde servidor
│                             │
│ [Real-time sync activo]     │
│                             │
│ 🏠 | 📋 | 🔧 | 📊 | 👤 │
└─────────────────────────────┘

CAMBIOS EN TIEMPO REAL:
- Nueva orden → aparece inmediatamente
- Stock actualizado → KPI se recalcula
- Notificaciones push → llegan al instante
- Fotos suben a servidor


SCENARIO B: SIN CONEXIÓN (Offline)

┌─────────────────────────────┐
│ 📴 Modo offline             │ ← Banner superior
│ Cambios se sincronizarán   │
├─────────────────────────────┤
│ 🏠 Home                     │
├─────────────────────────────┤
│ Buenos días, Juan           │
│                             │
│ 📊 Disponibilidad           │ ← Datos de caché
│ ████████░░ 92%             │    (última actualización)
│                             │
│ ⏳ Última sync: hace 5 min  │
│                             │
│ 🏠 | 📋 | 🔧 | 📊 | 👤 │
└─────────────────────────────┘

LIMITACIONES OFFLINE:
- ❌ No crear nuevas órdenes
- ❌ No subir fotos
- ❌ No cambiar estado
- ✅ Puedo ver órdenes (caché)
- ✅ Puedo leer detalles
- ✅ Puedo ver histórico local

LOCAL STORAGE:
- IndexedDB guarda todo
- Cambios en localStorage (queue)
- Al recuperar conexión → sync automático


SCENARIO C: RECONEXIÓN

USER REGRESA A CONEXIÓN:
1. Service worker detecta conexión
2. Banner desaparece
3. "Sincronizando cambios..."
4. Queue de cambios se envía
   ├─ Órdenes completadas
   ├─ Fotos pendientes
   └─ Cambios de estado
5. Servidor responde
6. Caché se actualiza
7. UI se refresca
8. ✓ "Sincronización completada"
```

---

## FLUJO 3: CREAR ORDEN (Supervisor/Admin)

```
PASO 1: Home → Botón [+]
┌─────────────────────────────┐
│ 🏠 Home              [+]    │ ← Botón crear (visible en tab)
└─────────────────────────────┘

PASO 2: Modal crear orden
┌─────────────────────────────┐
│ + Nueva Orden               │
├─────────────────────────────┤
│ Máquina                     │ ← Selector (expandible)
│ [CNC Línea A ▼]            │
│                             │
│ ├─ CNC Línea A             │ ← Abre lista
│ ├─ Robot B                 │
│ └─ Compresor               │
│                             │
│ Descripción                 │
│ [Cambiar rodamiento...]    │ ← Textarea expandible
│                             │
│ Prioridad                   │
│ (○) Crítica  ○ Alta        │ ← Radio buttons
│ (○) Media    ○ Baja        │
│                             │
│ Duración estimada (horas)   │
│ [2 ▲▼]                     │ ← Número input
│                             │
│ [CANCELAR] [CREAR]          │
└─────────────────────────────┘

PASO 3: Validación
├─ Máquina: requerido
├─ Descripción: mín 10 caracteres
├─ Prioridad: por defecto MEDIA
└─ Duración: mín 0.5h, máx 24h

SI ERROR:
│ [Máquina requerida] ← inline error
│ [Descripción muy corta (10 caract min)]

PASO 4: Submit
├─ Botón [CREAR] se desactiva
├─ Spinner aparece
├─ Backend: guarda en BD
└─ Service worker: guarda en caché

PASO 5: Success
┌─────────────────────────────┐
│ ✅ Orden creada!            │
│                             │
│ OT-4520: CNC - Rodamiento  │
│ Prioridad: CRÍTICA          │
│                             │
│ [VOLVER] [VER ORDEN]        │
└─────────────────────────────┘

PASO 6: Mostrar en lista
├─ Modal cierra
├─ Vuelve a "Mis órdenes"
├─ Nueva orden aparece en TOP
├─ Badge de notificación actualizado
└─ Notificación push (si está configurado)
```

---

## FLUJO 4: INICIAR ORDEN (Operario)

```
PASO 1: Ver orden pendiente
┌─────────────────────────────┐
│ 📋 Mis Órdenes             │
├─────────────────────────────┤
│ 📌 PENDIENTES (3)           │
│                             │
│ ┌─────────────────────────┐ │
│ │ OT-4510 - CNC          │ │
│ │ Cambiar rodamiento      │ │
│ │ 🔴 CRÍTICA • 2h        │ │
│ │ [INICIAR] [VER DETALLES]│ │
│ └─────────────────────────┘ │
│                             │
│ 📋 MIS ÓRDENES             │
└─────────────────────────────┘

PASO 2: Tap [INICIAR]
├─ Modal confirmación aparece
└─ Haptic feedback (light)

┌─────────────────────────────┐
│ ¿Iniciar OT-4510?           │
│                             │
│ CNC Línea A                 │
│ Cambiar rodamiento          │
│ 🔴 CRÍTICA                  │
│ Duración estimada: 2 horas  │
│                             │
│ [CANCELAR] [INICIAR]        │
└─────────────────────────────┘

PASO 3: Tap [INICIAR]
├─ Backend: actualiza estado → EN EJECUCIÓN
├─ Backend: guarda timestamp inicio
├─ Service worker: caché local
├─ UI: transición a pantalla de trabajo
└─ Haptic: medium feedback

PASO 4: Pantalla de trabajo abierta
┌─────────────────────────────┐
│ ← OT-4510 - CNC            │ ← Back button
├─────────────────────────────┤
│                             │
│ ⏱️ 00:00 / 2h est.         │ ← Timer inicia automático
│ ▁▁▁░░░░░░░ 0%             │ ← Progress bar
│                             │
│ 📝 DESCRIPCIÓN              │
│ Cambiar rodamiento...       │
│                             │
│ 🛠️ REPUESTOS                │
│ ☐ Rodamiento FAG (1 un)    │
│ ☐ Aceite ISO 32 (0.5L)     │
│ ☐ Trapos limpios            │
│                             │
│ 📷 FOTOS                    │
│ [📷 TOMAR FOTO]             │
│                             │
│ 💬 NOTAS                    │
│ [Agregar nota...]           │
│                             │
│ [PAUSAR] [COMPLETAR]        │
│                             │
├─────────────────────────────┤
│ 🏠 | 📋 | 🔧 | 📊 | 👤 │
└─────────────────────────────┘

PASO 5: Durante trabajo
├─ Timer cuenta automáticamente
├─ Cada 30 seg: auto-sync si hay conexión
├─ Usuario puede:
│  ├─ Tomar fotos
│  ├─ Agregar notas
│  ├─ Marcar repuestos
│  ├─ Pausar timer
│  └─ Consultar detalles

FOTOS:
┌─────────────────────────────┐
│ Tap [📷 TOMAR FOTO]         │
├─────────────────────────────┤
│ Abre cámara                 │
│ Usuario captura             │
│ ↓                           │
│ Preview y confirma          │
│ ↓                           │
│ Descripción opcional        │
│ ↓                           │
│ [GUARDAR]                   │
│ Foto se agrega a lista      │
│ (queued si offline)         │
└─────────────────────────────┘

PASO 6: Completar orden
├─ Tap [COMPLETAR]
├─ Modal confirmación

┌─────────────────────────────┐
│ ✅ Marcar como completada   │
│                             │
│ Tiempo total: 47 minutos    │
│ (Estimado: 2 horas)         │
│ ⭐ 76% más rápido!         │
│                             │
│ [CANCELAR] [COMPLETAR]      │
└─────────────────────────────┘

PASO 7: Enviar al servidor
├─ Estado → COMPLETADA
├─ Timestamp → guardado
├─ Fotos → suben (si hay conexión)
├─ Datos → caché actualizado
└─ En espera de validación supervisor

PASO 8: Success screen
┌─────────────────────────────┐
│ ✅ ¡LISTO!                  │
│                             │
│ OT-4510 completada          │
│ Pendiente validación        │
│ supervisor                  │
│                             │
│ Tiempo total: 47 min        │
│ vs 2h estimado (76% ↓)      │
│                             │
│ [VOLVER A ÓRDENES]          │
└─────────────────────────────┘

PASO 9: Vuelve a Mis Órdenes
├─ OT-4510 aparece en sección COMPLETADAS
├─ Badge actualizado
├─ Notificación push opcional
└─ Acciones: Solo ver detalles (read-only)
```

---

## FLUJO 5: CÁMARA Y FOTOS

```
CONTEXTO: Operario documenta trabajo

PASO 1: Usuario tap [📷 TOMAR FOTO]
├─ Abre cámara app
├─ Video preview en tiempo real
└─ Botones: [Galería] [📷 CAPTURAR] [X]

┌─────────────────────────────┐
│ [Frontal/Trasera]          │ ← Switch cámara
├─────────────────────────────┤
│ ╔═════════════════════════╗ │
│ ║ (LIVE CAMERA PREVIEW)   ║ │
│ ║                         ║ │
│ ║ [Objetivo del trabajo]  ║ │
│ ║                         ║ │
│ ╚═════════════════════════╝ │
│                             │
│   [Galería] [📷] [X]        │
│                             │
└─────────────────────────────┘

PASO 2: Tap [📷 CAPTURAR]
├─ Flash (opcional)
├─ Click sound
├─ Foto capturada
└─ Vibración (light)

PASO 3: Preview de foto
┌─────────────────────────────┐
│ ← Revisión                  │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ (FOTO CAPTURADA)        │ │
│ │                         │ │
│ │ (Miniatura previsión)   │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ Descripción (opcional)      │
│ [Rodamiento instalado...]  │ ← Textarea
│                             │
│ [RETOMAR] [USAR FOTO]      │
│                             │
└─────────────────────────────┘

PASO 4: Tap [USAR FOTO]
├─ Si ONLINE:
│  └─ Foto sube a servidor
│     └─ Mostrar progreso [▓▓░░░░]
├─ Si OFFLINE:
│  └─ Foto guarda local (IndexedDB)
│     └─ Badge "⏳ Pendiente sync"
└─ Vuelve a pantalla de trabajo

PASO 5: Foto agregada a lista
┌─────────────────────────────┐
│ 📷 FOTOS                    │
│                             │
│ ┌─────────────┐             │
│ │ [Thumbnail] │ ← Foto 1   │
│ │ Rodamiento  │   (sync OK) │
│ │ instalado   │             │
│ │ [X]         │ ← Delete   │
│ └─────────────┘             │
│                             │
│ ┌─────────────┐             │
│ │ [Thumbnail] │ ← Foto 2   │
│ │ Engrasado   │   (⏳ Sync) │
│ │ [X]         │             │
│ └─────────────┘             │
│                             │
│ [📷 TOMAR MÁS]              │
│                             │
└─────────────────────────────┘

PASO 6: Al completar orden
├─ Si hay OFFLINE fotos:
│  ├─ Mostrar "⏳ Pendiente sync"
│  ├─ Al reconectar → auto-upload
│  └─ Después → [COMPLETAR]
├─ Si todo online:
│  └─ Tap [COMPLETAR] directo
```

---

## FLUJO 6: NOTIFICACIONES PUSH

```
ESCENARIO 1: NUEVA ORDEN ASIGNADA

BACKEND:
├─ Crea nueva OT
├─ Asigna a operario "Juan"
├─ Envía push notification

┌─────────────────────────────┐
│ 📋 Nueva orden asignada     │ ← Notificación en status bar
│ OT-4520: Compresor          │
│ Prioridad: ALTA             │
└─────────────────────────────┘

USUARIO VE:
├─ Si app está ABIERTA:
│  └─ Toast notification in-app (2s)
├─ Si app está MINIMIZADA:
│  └─ Notificación system tray
│     └─ Tap abre app → Mis Órdenes
├─ Si app está CERRADA:
│  └─ Notificación system tray
│     └─ Tap abre app → Mis Órdenes → OT-4520


ESCENARIO 2: STOCK BAJO

BACKEND:
├─ Stock de "Aceite ISO 32" cae bajo mínimo
├─ Envía push a administradores + supervisores

┌─────────────────────────────┐
│ ⚠️ Stock bajo: Aceite ISO 32│
│ Quedan: 5L (Mín: 10L)       │
└─────────────────────────────┘

TAP:
├─ Abre app
├─ Va a Tab "Taller"
├─ Muestra Aceite ISO 32 con badge ⚠️
└─ Botón [REPONER]


ESCENARIO 3: ORDEN COMPLETADA

OPERARIO completa OT → BACKEND envía push a SUPERVISOR

┌─────────────────────────────┐
│ ✅ OT-4510 completada      │
│ Juan García - CNC - Motor   │
│ Requiere validación         │
└─────────────────────────────┘

SUPERVISOR TAP:
├─ Abre app
├─ Va a Tab "Mis Órdenes"
├─ Filtra "COMPLETADAS"
├─ Valida/rechaza OT


PUSH SETTINGS (Perfil):

┌─────────────────────────────┐
│ 👤 Perfil                   │
├─────────────────────────────┤
│ 🔔 NOTIFICACIONES           │
│                             │
│ ☑ Nueva orden asignada      │
│ ☑ Stock bajo                │
│ ☑ Orden completada          │
│ ☑ Cambio de estado          │
│ ☑ Recordatorio diario       │
│                             │
│ Horarios silencioso:        │
│ De 22:00 a 07:00           │
│ (sin notificaciones)        │
│                             │
│ [GUARDAR]                   │
│                             │
└─────────────────────────────┘
```

---

## FLUJO 7: SINCRONIZACIÓN DATOS

```
ESCENARIO: Usuario trabaja offline, luego conecta

FASE 1: OFFLINE (Sin conexión)
├─ Usuario crear nota en OT
├─ Guarda en IndexedDB local
├─ Queue de cambios (no sincronizado)
│  └─ { action: 'UPDATE_OT', data: {...}, timestamp: X }
├─ Icono: ⏳ (pendiente)
├─ Badge: "1 cambio pendiente"
└─ Banner: "📴 Modo offline"

┌─────────────────────────────┐
│ 💬 NOTAS                    │
│ [Mi nota de prueba] ⏳      │ ← Pendiente sync
│                             │
│ Status: Pendiente sincronizar
│ Cambios se enviarán cuando
│ recuperes conexión          │
└─────────────────────────────┘


FASE 2: RECONECTA (Conexión restaurada)

1. Service worker detecta conexión
2. "🔄 Sincronizando cambios..."
   ├─ Lee queue de IndexedDB
   ├─ Envía cambios al servidor
   │  ├─ Nota actualizada ✓
   │  ├─ Foto subida ✓
   │  └─ Estado actualizado ✓
   ├─ Servidor responde
   ├─ Caché local se actualiza
   └─ Queue se borra

3. "✓ Sincronización completada"
   ├─ Icono ⏳ desaparece
   ├─ Badge resetea
   └─ Data es fresca


CONFLICTOS (Raro):

Si user actualiza offline y alguien más actualiza en servidor:

SERVIDOR GANA:
├─ Backend detecta versión diferente
├─ Envía versión nueva al cliente
├─ "⚠️ Conflicto de versión"
├─ Muestra ambas versiones
└─ User elige cuál mantener:

┌─────────────────────────────┐
│ ⚠️ Conflicto                │
│                             │
│ Versión local:              │
│ "Mi nota de prueba"         │
│                             │
│ Versión servidor:           │
│ "Nota actualizada"          │
│                             │
│ [USAR LOCAL] [USAR SERVIDOR]│
│                             │
└─────────────────────────────┘
```

---

