# 🎨 MODO REUNIÓN - KANBAN INTERACTIVO

## CONCEPTO

```
MODO REUNIÓN = Vista colaborativa tipo Kanban/Canvas
├─ Tarjetas de órdenes de trabajo
├─ Columnas por ESTADO (11 estados)
├─ Drag-and-drop interactivo
├─ Cambios en TIEMPO REAL
├─ Se refleja automáticamente en todas las pantallas
├─ Ideal para proyector/TV en planta
└─ Accesible desde cualquier dispositivo
```

---

## 🎯 FLUJO DE INTERACCIÓN

### CAMBIAR ESTADO (Drag-and-drop):
```
Admin arrastra tarjeta OT-4503 de columna "ABIERTA" a "PLANIFICADA"
    ↓
Estado actualizado en BD
    ↓
WebSocket notifica a todos los clientes conectados
    ↓
Pantalla supervisor actualiza (si está viendo)
    ↓
Tabla operario se actualiza (si está en su panel)
    ↓
Histórico registra: quién, cuándo, qué cambió
```

### ASIGNAR OPERARIO:
```
Admin arrastra tarjeta a sección "JUAN" en columna "PLANIFICADA"
    ↓
OT asignada a JUAN en BD
    ↓
JUAN recibe notificación: "Nueva orden asignada"
    ↓
OT aparece en panel "Mis órdenes" de JUAN
    ↓
Si JUAN está en otra pantalla, no se interrumpe (notificación silenciosa)
```

---

## 🎨 DISEÑO TARJETA KANBAN

```
┌─────────────────────────────────┐
│ OT-4503                 🔧 ▼   │ ← Número + Menú
├─────────────────────────────────┤
│ CNC Línea A - Motor             │ ← Máquina
├─────────────────────────────────┤
│ Cambiar rodamiento              │ ← Descripción
├─────────────────────────────────┤
│ 🔴 CRÍTICA  2h  👤 Juan        │ ← Prioridad, duración, asignado
├─────────────────────────────────┤
│ Hace 45 min                     │ ← Tiempo creación
└─────────────────────────────────┘

COLORES POR PRIORIDAD:
🔴 CRÍTICA (Rojo)
🟠 ALTA (Naranja)
🟡 MEDIA (Amarillo)
🟢 BAJA (Verde)
```

---

## 📊 LAYOUT COMPLETO

```
┌──────────────────────────────────────────────────────────────┐
│ MODO REUNIÓN - TABLERO DE ÓRDENES                           │
│ [← Volver] [Actualizar] [Filtrar ▼] [Zoom ▼] [⚙️]           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 📋      │ 🔵        │ ▶️         │ ✅        │ ⏳      │ ❌   │
│ ABIERTA │ PLANIF.   │ EN EJECUC. │ COMPLETADA│EN ESPERA│RECH. │
│ (5)     │ (8)       │ (3)        │ (4)       │ (2)     │ (1)  │
│         │           │            │           │         │      │
│ ┌─────┐ │ ┌─────┐  │ ┌─────┐   │ ┌─────┐   │ ┌─────┐ │      │
│ │OT.. │ │ │OT.. │  │ │OT.. │   │ │OT.. │   │ │OT.. │ │      │
│ │CNC  │ │ │BOB  │  │ │COM  │   │ │FIL  │   │ │ECT  │ │      │
│ │ALTA │ │ │MEDIA│  │ │CRÍTICA  │ │BAJA │   │ │MEDIA│ │      │
│ └─────┘ │ └─────┘  │ └─────┘   │ └─────┘   │ └─────┘ │      │
│         │           │            │           │         │      │
│ ┌─────┐ │ ┌─────┐  │            │ ┌─────┐   │        │      │
│ │OT.. │ │ │OT.. │  │            │ │OT.. │   │        │      │
│ │LIN  │ │ │ROB  │  │            │ │VAL  │   │        │      │
│ │BAJA │ │ │ALTA │  │            │ │BAJA │   │        │      │
│ └─────┘ │ └─────┘  │            │ └─────┘   │        │      │
│         │           │            │           │         │      │
│ ┌─────┐ │ ┌─────┐  │            │           │        │      │
│ │OT.. │ │ │OT.. │  │            │           │        │      │
│ │TRB  │ │ │COM  │  │            │           │        │      │
│ │MEDIA│ │ │CRÍTICA  │            │           │        │      │
│ └─────┘ │ └─────┘  │            │           │        │      │
│         │           │            │           │         │      │
└──────────────────────────────────────────────────────────────┘
```

---

## ⚙️ FUNCIONALIDADES CLAVE

### 1. DRAG-AND-DROP
- ✅ Mover tarjeta entre columnas
- ✅ Cambio de estado automático
- ✅ Visual feedback (sombra, escala)
- ✅ Validaciones (ej: no pasar de CERRADA a ABIERTA)
- ✅ Deshacer (Ctrl+Z)

### 2. ASIGNACIÓN RÁPIDA
- ✅ Arrastar a zona de operario
- ✅ Nombre del operario visible en tarjeta
- ✅ Notificación inmediata
- ✅ Aparece en panel operario

### 3. SINCRONIZACIÓN REAL-TIME
- ✅ WebSocket (Socket.io)
- ✅ Actualización < 500ms
- ✅ Múltiples usuarios simultáneamente
- ✅ Reconexión automática
- ✅ No hay conflictos de datos

### 4. FILTROS DINÁMICOS
- ✅ Por prioridad (crítica/alta/media/baja)
- ✅ Por operario (mostrar/ocultar)
- ✅ Por área
- ✅ Por tipo (preventivo/correctivo)
- ✅ Combinaciones múltiples

### 5. ZOOM Y VISTA
- ✅ Zoom pequeño (100%) - Ver más
- ✅ Zoom normal (150%) - Balanceado
- ✅ Zoom grande (200%) - TV pequeña
- ✅ Scroll horizontal si es necesario

### 6. OPCIONES AVANZADAS (⚙️)
- ✅ Mostrar/ocultar campos
- ✅ Actualización automática / manual
- ✅ Sonido en cambios
- ✅ Historial visible/oculto

---

## 📱 SINCRONIZACIÓN CON OTROS PANELES

### CUANDO OCURRE CAMBIO EN MODO REUNIÓN:

```
ESCENARIO: Admin asigna OT-4503 a JUAN

1️⃣ MODO REUNIÓN:
   ├─ Tarjeta se mueve a zona de JUAN
   ├─ Nombre "JUAN" aparece en tarjeta
   ├─ Cambio instantáneo
   └─ Se envía al servidor

2️⃣ PANEL DE JUAN (en tiempo real):
   ├─ OT-4503 aparece en "Mis órdenes"
   ├─ Notificación: "Nueva orden asignada"
   ├─ Color de prioridad visible
   └─ Puede [INICIAR] inmediatamente

3️⃣ DASHBOARD SUPERVISOR:
   ├─ OT-4503 ya no en "Sin asignar"
   ├─ Aparece asignada a "JUAN"
   ├─ Estadísticas se actualizan
   └─ Si está mirando, lo ve al instante

4️⃣ BASE DE DATOS:
   ├─ Estado actualizado
   ├─ Asignado_a: juan_id
   ├─ Timestamp registrado
   ├─ Histórico guardado
   └─ Auditable
```

---

## 🎨 TARJETAS ESPECIALES

### CON ALERTA DE STOCK:
```
┌─────────────────────────────────┐
│ OT-4512                 🔧 ▼   │
├─────────────────────────────────┤
│ Robot B - Velocidad             │
├─────────────────────────────────┤
│ Revisar velocidad               │
├─────────────────────────────────┤
│ 🟠 ALTA  1h30m  👤 Pedro       │
├─────────────────────────────────┤
│ ⏳ 2h 15min (⚠️ +45min)        │
│ ⚠️  STOCK BAJO: Aceite          │
│ 📌 PAUSADA por stock            │
├─────────────────────────────────┤
│ [Reponer] [Reanudar]            │
└─────────────────────────────────┘
```

### CON COMPONENTE EXTERNO:
```
┌─────────────────────────────────┐
│ OT-4503                 🔧 ▼   │
├─────────────────────────────────┤
│ CNC Línea A - Motor             │
├─────────────────────────────────┤
│ Cambiar motor (rep. externa)    │
├─────────────────────────────────┤
│ 🔴 CRÍTICA  4h  👤 Juan        │
├─────────────────────────────────┤
│ 📦 MTR-CNC-001-01               │
│ 🏢 SIEMENS - Retorno 18/11      │
├─────────────────────────────────┤
│ [Contactar] [Ver historial]     │
└─────────────────────────────────┘
```

---

## 🔄 ESTADOS VISIBLES EN KANBAN

```
Las 11 columnas del Kanban corresponden a:

1. 📋 ABIERTA - Recién creada, sin asignar
2. 🔵 PLANIFICADA - Asignada, esperando inicio
3. ▶️  EN EJECUCIÓN - Operario trabajando
4. ⏸️  EN PROCESO - Estado intermedio
5. ✅ COMPLETADA - Operario terminó, espera verificación
6. 🟢 CERRADA - Supervisor verificó y aceptó
7. ❌ RECHAZADA - Supervisor rechazó, requiere redo
8. ⏳ EN ESPERA - Pendiente de disponibilidad
9. 🛑 PENDIENTE STOCK - Falta repuesto
10. ⚠️ NECESIDAD PARADA - Máquina debe parar
11. 🚫 CANCELADA - Se decide no hacerla

+ 1 columna adicional para reparación externa
12. 🏢 REPARACIÓN EXTERNA - En proveedor
```

---

## 📊 ACCIONES MENÚ TARJETA (🔧 ▼)

```
├─ ✏️ Editar OT
├─ 👤 Cambiar asignación
├─ 🔄 Cambiar estado manual
├─ 🎯 Cambiar prioridad
├─ 📝 Agregar nota
├─ 📎 Ver detalles completos
├─ 🗑️ Cambiar a CANCELADA
└─ ⋮ Más opciones
```

---

## 💻 TECNOLOGÍA IMPLEMENTAR

```
Frontend:
├─ react-beautiful-dnd (drag-and-drop)
├─ socket.io-client (WebSocket)
├─ zustand (state management)
└─ tailwindcss (estilos)

Backend:
├─ express
├─ socket.io
├─ supabase-js
└─ cors

BD:
├─ Tabla ordenes_trabajo
├─ Tabla historial_cambios
└─ Triggers para auditoría
```

---

## 📋 CHECKLIST IMPLEMENTACIÓN

- [ ] Interfaz Kanban con 11+ columnas
- [ ] Tarjetas con información esencial
- [ ] Drag-and-drop funcional
- [ ] Cambios de estado automáticos
- [ ] WebSocket sincronización
- [ ] Filtros dinámicos
- [ ] Zoom configurable
- [ ] Asignación rápida
- [ ] Notificaciones en tiempo real
- [ ] Reflejado en otros paneles
- [ ] Responsivo (funciona en TV/PC/Tablet)
- [ ] Performance optimizado (60fps)

---

## 🚀 ESTO COMPLETA EL MVP

Con esto tenemos TODO definido:
- ✅ 11-12 estados de OT
- ✅ 17 funcionalidades
- ✅ Gestión de repuestos
- ✅ Gestión de taller (componentes)
- ✅ Modo reunión Kanban interactivo
- ✅ Stack gratis
- ✅ Sincronización real-time

---

**SIGUIENTE PASO: EMPEZAR A CODIFICAR**
