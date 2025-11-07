# 📱 UX/UI MOBILE FIRST - PWA

## CONCEPTO

```
APLICACIÓN: PWA (Progressive Web App)
├─ Funciona en navegador
├─ Instala como app en móvil
├─ Sincronización offline
├─ Push notifications
├─ Cámara para fotos
└─ GPS (opcional)

DISPOSITIVO PRINCIPAL: Móvil (iPhone + Android)
├─ Pantalla 5-6 pulgadas (375-430px ancho)
├─ Gestos táctiles
├─ Orientación portrait (vertical)
└─ Conexión 4G/WiFi

DISPOSITIVOS SECUNDARIOS: 
├─ Tablet (landscape opcional)
├─ Desktop (navegador)
└─ TV (proyector - modo especial)
```

---

## 🎨 DISEÑO VISUAL - MOBILE FIRST

### PALETA DE COLORES

```
PRIMARY:    #2563EB (Azul - acciones principales)
SUCCESS:    #10B981 (Verde - completado/ok)
WARNING:    #F59E0B (Naranja - atención)
DANGER:     #EF4444 (Rojo - crítico)
NEUTRAL:    #6B7280 (Gris - texto secundario)

PRIORIDADES (por color):
🔴 CRÍTICA:   #DC2626 (Rojo oscuro)
🟠 ALTA:      #EA580C (Naranja)
🟡 MEDIA:     #FBBF24 (Amarillo)
🟢 BAJA:      #34D399 (Verde claro)

FONDO:      #FFFFFF (Blanco)
SUPERFICIE: #F9FAFB (Gris muy claro)
BORDER:     #E5E7EB (Gris claro)
```

---

## 📱 ESTRUCTURA DE NAVEGACIÓN

### BOTTOM TAB NAVIGATION (Siempre visible)

```
┌─────────────────────────────────┐
│                                 │ ← Contenido principal
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│ 🏠 | 📋 | 🔧 | 📊 | 👤 |      ← Tab bar fijo abajo
└─────────────────────────────────┘

TABS (5 tabs principales):
🏠 HOME          - Dashboard/inicio
📋 MIS ÓRDENES   - Órdenes asignadas
🔧 TALLER        - Repuestos/componentes
📊 REPORTES      - KPIs y análisis
👤 PERFIL        - Usuario/configuración

CADA TAB:
├─ Icono + Etiqueta
├─ Badge de notificaciones (si aplica)
├─ Color activo/inactivo
└─ Transición suave
```

---

## 🏠 PANTALLA 1: HOME (Dashboard)

```
┌─────────────────────────────────────┐
│ ← Mantenimiento  [⚙️]              │ ← Header: Nombre app + settings
├─────────────────────────────────────┤
│ Buenos días, Juan ✋                │ ← Saludo + hora
│ Martes, 5 de noviembre             │
├─────────────────────────────────────┤
│                                     │
│ 📊 ESTADO ACTUAL                    │ ← Section title
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Disponibilidad              │    │ ← KPI Card 1
│ │ ████████░░ 92%             │    │
│ │ ✓ Muy bueno                │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Tus órdenes hoy             │    │ ← KPI Card 2
│ │ 📋 3 | ⏳ 1 | ✅ 2           │    │
│ └─────────────────────────────┘    │
│                                     │
│ 🚨 ALERTAS                          │ ← Alerts section
│                                     │
│ ⚠️ Stock bajo: Aceite ISO 32        │ ← Alert item
│    Quedan: 5L                       │
│    [Reponer]                        │
│                                     │
│ 🔔 Tu orden OT-4503 fue rechazada  │ ← Alert item
│    [Ver detalles]                   │
│                                     │
├─────────────────────────────────────┤
│ 🏠 | 📋 | 🔧 | 📊 | 👤 |          │
└─────────────────────────────────────┘
```

### HOME - Desglose

```
HEADER (Fixed top, height: 56px):
├─ Logo/Nombre app (left)
├─ Hora actual (center)
└─ Ícono settings (right)

BODY (Scrollable):
├─ Saludo personalizado
├─ Fecha/Hora
├─ KPI Cards (2 principales)
├─ Alerts section
├─ Acciones rápidas
└─ Upcoming tasks

BOTTOM TAB (Fixed, height: 64px):
├─ 5 tabs
└─ Siempre visible
```

---

## 📋 PANTALLA 2: MIS ÓRDENES

```
┌─────────────────────────────────────┐
│ ← Mis Órdenes            [+]        │ ← Back + title + add button
├─────────────────────────────────────┤
│                                     │
│ 📌 PENDIENTES (3)                   │ ← Sección collapsed/expandida
│                                     │
│ ┌─────────────────────────────┐    │
│ │ OT-4510 - CNC Línea A       │    │ ← Tarjeta orden
│ │ Cambiar rodamiento          │    │   (can tap to expand)
│ │                             │    │
│ │ 🔴 CRÍTICA • 2h estimado   │    │
│ │ Hace 2 horas                │    │
│ │                             │    │
│ │ [INICIAR] [VER DETALLES]    │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ OT-4511 - Robot B           │    │
│ │ Revisar velocidad           │    │
│ │                             │    │
│ │ 🟠 ALTA • 1h 30min         │    │
│ │ Hace 1 hora                 │    │
│ │                             │    │
│ │ [INICIAR] [VER DETALLES]    │    │
│ └─────────────────────────────┘    │
│                                     │
│ ▶️ EN PROGRESO (1)                  │ ← Sección collapsed
│    [Expandir]                       │
│                                     │
│ ▶️ COMPLETADAS (2)                  │ ← Sección collapsed
│    [Expandir]                       │
│                                     │
├─────────────────────────────────────┤
│ 🏠 | 📋 | 🔧 | 📊 | 👤 |          │
└─────────────────────────────────────┘
```

### MIS ÓRDENES - Desglose

```
HEADER (Fixed):
├─ Back button
├─ Título "Mis órdenes"
└─ [+] Botón crear (solo si es supervisor)

SECCIONES (Expandible):
├─ PENDIENTES (cantidad)
│  └─ Lista de tarjetas
├─ EN PROGRESO (cantidad)
│  └─ Lista de tarjetas
└─ COMPLETADAS (cantidad)
   └─ Lista de tarjetas

TARJETA DE ORDEN:
├─ Número + máquina
├─ Descripción breve
├─ Prioridad (color)
├─ Duración estimada
├─ Tiempo desde creación
├─ Botones de acción
└─ Tap to expand detalles
```

---

## 🔧 PANTALLA 3: TALLER

```
┌─────────────────────────────────────┐
│ ← Taller               [🔍]         │ ← Back + search
├─────────────────────────────────────┤
│                                     │
│ 📦 REPUESTOS EN STOCK               │ ← Tab 1
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Aceite ISO 32 ⚠️             │    │ ← Repuesto (alert badge)
│ │ Stock: 5L / Mín: 10L        │    │
│ │ ████░░░░░░ 50% crítico      │    │
│ │ Proveedor: SHELL            │    │
│ │ [Reponer]                   │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Rodamientos FAG             │    │
│ │ Stock: 23 un                │    │
│ │ ████████░░ 80% ok           │    │
│ │ Proveedor: SKF              │    │
│ │ Último consumo: 5 hace 3d   │    │
│ └─────────────────────────────┘    │
│                                     │
│ 🔧 COMPONENTES REEMPLAZABLES      │ ← Tab 2
│                                     │
│ ┌─────────────────────────────┐    │
│ │ Motor CNC Línea A           │    │
│ │ MTR-CNC-001                 │    │
│ │                             │    │
│ │ 🟢 Disponible (1 unidad)    │    │
│ │ 🟠 En uso (1 unidad)        │    │
│ │ 🔵 En taller (1 unidad)     │    │
│ │                             │    │
│ │ [VER DETALLES]              │    │
│ └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│ 🏠 | 📋 | 🔧 | 📊 | 👤 |          │
└─────────────────────────────────────┘
```

---

## 📊 PANTALLA 4: REPORTES/KPIs

```
┌─────────────────────────────────────┐
│ ← Reportes             [📊]         │
├─────────────────────────────────────┤
│                                     │
│ 🎯 KPIs PRINCIPALES                 │
│                                     │
│ Disponibilidad                      │
│ ████████░░ 92%                      │
│ ↑ +3% vs semana pasada             │
│                                     │
│ MTTR (Promedio)                     │
│ 1h 32min                            │
│ ↓ -15min vs semana pasada          │
│                                     │
│ OT Completadas (mes)                │
│ 187 órdenes                         │
│ ↑ +12 vs mes anterior              │
│                                     │
│ ────────────────────────────        │
│                                     │
│ 📈 GRÁFICOS                          │
│                                     │
│ Preventivo vs Correctivo            │
│ [Gráfico circular]                  │
│ 62% Preventivo | 38% Correctivo     │
│                                     │
│ Disponibilidad últimas 4 semanas    │
│ [Gráfico línea]                     │
│                                     │
│ ────────────────────────────        │
│                                     │
│ 🏆 TOP OPERARIOS                    │
│                                     │
│ 1. Juan García - 23 OT              │
│ 2. Pedro López - 21 OT              │
│ 3. María García - 19 OT             │
│                                     │
├─────────────────────────────────────┤
│ 🏠 | 📋 | 🔧 | 📊 | 👤 |          │
└─────────────────────────────────────┘
```

---

## 👤 PANTALLA 5: PERFIL

```
┌─────────────────────────────────────┐
│ Perfil                   [X]        │ ← Title + close
├─────────────────────────────────────┤
│                                     │
│           👤 JUAN GARCÍA            │ ← Avatar + nombre
│         juan@empresa.com            │
│                                     │
│ ────────────────────────────────    │
│                                     │
│ INFORMACIÓN                         │ ← Section
│ Rol: Operario                       │
│ Área: Producción                    │
│ OT completadas (mes): 23            │
│ Rating: ⭐⭐⭐⭐⭐ (4.8/5)         │
│                                     │
│ ────────────────────────────────    │
│                                     │
│ CONFIGURACIÓN                       │ ← Section
│                                     │
│ 🔔 Notificaciones            [ON]  │
│ 📍 Localización              [OFF] │
│ 🌙 Modo oscuro              [OFF] │
│ 📴 Modo offline              [ON]  │
│                                     │
│ ────────────────────────────────    │
│                                     │
│ ENLACES                             │ ← Section
│ Ayuda                               │
│ Sobre la app                        │
│ Política privacidad                 │
│ Contacto soporte                    │
│                                     │
│ ────────────────────────────────    │
│                                     │
│ [DESCARGAR APP]  [CERRAR SESIÓN]   │ ← Buttons
│                                     │
├─────────────────────────────────────┤
│ 🏠 | 📋 | 🔧 | 📊 | 👤 |          │
└─────────────────────────────────────┘
```

---

## 🎯 FLUJO: INICIAR UNA ORDEN (Mobile)

```
PASO 1: Ver orden en "Mis Órdenes"
┌─────────────────────────────────────┐
│ MIS ÓRDENES                         │
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐    │
│ │ OT-4510 - CNC Línea A       │    │
│ │ Cambiar rodamiento          │    │
│ │ 🔴 CRÍTICA • 2h estimado   │    │
│ │ [INICIAR] [VER DETALLES]    │    │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘

↓ Tap [INICIAR]

PASO 2: Confirmación rápida
┌─────────────────────────────────────┐
│ ¿Iniciar orden OT-4510?             │
│                                     │
│ CNC Línea A - Cambiar rodamiento   │
│ Duración estimada: 2 horas         │
│                                     │
│ [CANCELAR] [INICIAR]                │
└─────────────────────────────────────┘

↓ Tap [INICIAR]

PASO 3: Pantalla de trabajo
┌─────────────────────────────────────┐
│ ← OT-4510 - CNC Línea A            │
├─────────────────────────────────────┤
│                                     │
│ ⏱️ 00:15 / 2h estimado             │ ← Timer
│ ████░░░░░░ 12.5% progreso          │ ← Progress bar
│                                     │
│ 📝 DESCRIPCIÓN                      │
│ Cambiar rodamiento delantero        │
│                                     │
│ 🛠️ REPUESTOS NECESARIOS             │
│ ☐ Rodamiento FAG (1 un)            │
│ ☐ Aceite ISO 32 (0.5L)             │
│ ☐ Trapos limpios                   │
│                                     │
│ 📷 DOCUMENTACIÓN                    │
│ [📷 TOMAR FOTO]  [+]               │ ← Foto button
│                                     │
│ ────────────────────────────────    │
│                                     │
│ 💬 NOTAS                            │
│ [Agregar nota...]                  │ ← Note input
│                                     │
│ ────────────────────────────────    │
│                                     │
│ [PAUSAR] [COMPLETAR ORDEN]          │ ← Action buttons
│                                     │
├─────────────────────────────────────┤
│ 🏠 | 📋 | 🔧 | 📊 | 👤 |          │
└─────────────────────────────────────┘

↓ Tap [COMPLETAR ORDEN]

PASO 4: Confirmación final
┌─────────────────────────────────────┐
│ ✅ Marcar como completada           │
│                                     │
│ Tiempo total: 47 minutos            │
│ (Estimado: 2 horas)                │
│ ⭐ Muy rápido! ¡Buen trabajo!      │
│                                     │
│ [CANCELAR] [COMPLETAR]              │
└─────────────────────────────────────┘

↓ Tap [COMPLETAR]

PASO 5: Success
┌─────────────────────────────────────┐
│          ✅ ¡LISTO!                 │
│                                     │
│ Orden OT-4510 completada           │
│ Pendiente verificación supervisor   │
│                                     │
│ [VOLVER A ÓRDENES]                  │
└─────────────────────────────────────┘
```

---

## 📸 CÁMARA - Documentar Trabajo

```
BOTÓN FOTO (en pantalla de trabajo):

Tap [📷 TOMAR FOTO]

↓ 

┌─────────────────────────────────────┐
│ [  CÁMARA FRONTAL/TRASERA  ]        │ ← Switch cámara
├─────────────────────────────────────┤
│                                     │
│   ╔═══════════════════════════╗    │
│   ║                           ║    │
│   ║   (Preview de cámara)    ║    │
│   ║                           ║    │
│   ╚═══════════════════════════╝    │
│                                     │
│     [Galería] [📷 CAPTURAR] [❌]    │
│                                     │
└─────────────────────────────────────┘

↓ Tap [📷 CAPTURAR]

┌─────────────────────────────────────┐
│ ← Revisión de foto                 │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────┐    │
│ │   (Foto capturada)          │    │
│ │                             │    │
│ │   ┌─────────────────┐       │    │
│ │   │ Previsualización│       │    │
│ │   │     de foto     │       │    │
│ │   └─────────────────┘       │    │
│ └─────────────────────────────┘    │
│                                     │
│ [RETOMAR] [USAR ESTA FOTO]          │
│                                     │
│ Descripción (opcional):             │
│ [Rodamiento reemplazado...]         │
│                                     │
│ [CANCELAR] [GUARDAR]                │
│                                     │
└─────────────────────────────────────┘

↓ Tap [GUARDAR]

Foto se agrega a la orden
```

---

## 🔔 NOTIFICACIONES PUSH

```
TIPOS DE NOTIFICACIÓN:

1. NUEVA ORDEN ASIGNADA:
   ┌─────────────────────────────┐
   │ 📋 Nueva orden asignada     │
   │ OT-4515: Compresor          │
   │ Prioridad: ALTA             │
   │ 🎯 Crítica!                 │
   └─────────────────────────────┘
   Tap → Abre en "Mis Órdenes"

2. STOCK BAJO:
   ┌─────────────────────────────┐
   │ ⚠️ Stock bajo alertado       │
   │ Aceite ISO 32: 5L quedan     │
   │ Mínimo: 10L                 │
   └─────────────────────────────┘
   Tap → Abre en "Taller" / "Repuestos"

3. ORDEN REQUIERE VALIDACIÓN:
   ┌─────────────────────────────┐
   │ ✅ Tu orden está completa   │
   │ OT-4510: CNC - Rodamiento   │
   │ Espera validación           │
   └─────────────────────────────┘
   Tap → Abre en "Mis Órdenes"

4. CAMBIO DE ESTADO:
   ┌─────────────────────────────┐
   │ ❌ Orden rechazada           │
   │ OT-4501: Motor              │
   │ Razón: Especificaciones...  │
   └─────────────────────────────┘
   Tap → Abre detalles
```

---

## 📵 MODO OFFLINE

```
SIN CONEXIÓN A INTERNET:

├─ Puedo ver mis órdenes (caché)
├─ Puedo ver repuestos (caché)
├─ NO puedo crear nuevas órdenes
├─ NO puedo cargar fotos
├─ Cambios se guardan localmente
├─ Sync automático cuando hay conexión
└─ Indicador visual: "📴 Modo offline"

INDICADOR:
┌──────────────────────────┐
│ 📴 SIN CONEXIÓN         │
│ Los cambios se              │
│ sincronizarán cuando       │
│ recuperes conexión         │
└──────────────────────────┘
```

---

## 🎨 COMPONENTES REUTILIZABLES

### TARJETA DE ORDEN (Card)
```
┌─────────────────────────────┐
│ OT-4510 - CNC Línea A       │ ← Título
│ Cambiar rodamiento          │ ← Descripción
│                             │
│ 🔴 CRÍTICA • 2h estimado   │ ← Prioridad + duración
│ Hace 2 horas                │ ← Timestamp
│                             │
│ [INICIAR] [VER DETALLES]    │ ← Botones
└─────────────────────────────┘

PROPIEDADES:
- Prioritario: color de fondo cambio
- Estado: icono visual
- Touch: expansión/detalles
- Swipe: acciones rápidas
```

### KPI CARD
```
┌─────────────────────────┐
│ Disponibilidad          │ ← Label
│ ████████░░ 92%         │ ← Progress bar
│ ↑ +3% vs semana        │ ← Trend
│ Muy bueno 🟢            │ ← Status
└─────────────────────────┘

TAMAÑO: 2x1 grid
COLOR: Varía por estado
INTERACCIÓN: Tap para detalles
```

### BOTÓN DE ACCIÓN
```
[    INICIAR ORDEN    ]
├─ Alto: 48px (tappable)
├─ Color: PRIMARY (#2563EB)
├─ Rounded: 8px
├─ Font weight: 600
├─ Feedback: Ripple effect
└─ Disabled: Opacidad 50%

VARIANTES:
[PRIMARY] [SECONDARY] [DANGER] [SUCCESS]
```

### ALERT/BANNER
```
┌─────────────────────────────┐
│ ⚠️ Stock bajo: Aceite       │ ← Icon + message
│    Quedan: 5L               │ ← Detail
│ [Reponer]                   │ ← Action button
└─────────────────────────────┘

TIPO:
- INFO: 🔵
- WARNING: ⚠️ 
- DANGER: ❌
- SUCCESS: ✅
```

---

## 🎨 TIPOGRAFÍA

```
FUENTE PRINCIPAL: Inter (system font)

TAMAÑOS:
- Heading 1: 28px (bold) - Títulos pantalla
- Heading 2: 20px (bold) - Subtítulos
- Body Large: 16px (regular) - Texto principal
- Body Small: 14px (regular) - Texto secundario
- Label: 12px (medium) - Labels/badges

ESPACIADO (padding/margin):
- XS: 4px
- S: 8px
- M: 16px
- L: 24px
- XL: 32px
```

---

## 🌓 MODO OSCURO (Dark Mode)

```
Disponible pero OPT-IN:
├─ Setting en Perfil
├─ Conserva accesibilidad
├─ Mismo contraste
└─ Automático si dispositivo lo tiene

COLORES OSCUROS:
├─ Fondo: #1F2937
├─ Superficie: #111827
├─ Texto: #F3F4F6
└─ Bordes: #374151
```

---

## ♿ ACCESIBILIDAD

```
✅ WCAG 2.1 AA compliant

REQUISITOS:
├─ Contraste 4.5:1 textos
├─ Tamaño mínimo 12px
├─ Touch targets 48x48px
├─ Keyboard navigation
├─ Screen reader compatible
├─ Labels en inputs
├─ Focus visible
├─ Color no es único indicador
└─ Animaciones: respeta prefers-reduced-motion
```

---

## 📐 LAYOUT GRID

```
MOBILE (375px width):

┌─┬───────────────┬─┐
│ │               │ │ Padding: 16px
├─┼───────────────┼─┤
│ │               │ │ Content: 343px
│ │               │ │
├─┼───────────────┼─┤
│ │               │ │
└─┴───────────────┴─┘

TAB NAVIGATION: 64px (fixed bottom)

SAFEAREA (notch + home indicator):
Top: 44px (notch)
Bottom: 34px (home indicator)
```

---

## 🔄 TRANSICIONES

```
DURACIONES:
- Rápida: 150ms (ripple, hover)
- Normal: 300ms (page transitions)
- Lenta: 500ms (modals)

EASING:
- cubic-bezier(0.4, 0, 0.2, 1) - Standar

EJEMPLOS:
- Tab switch: 300ms
- Modal open: 300ms
- Card expand: 200ms
- Scroll reveal: 150ms
```

---

## 📋 CHECKLIST UX/UI MOBILE FIRST

- [ ] Bottom tab navigation (5 tabs)
- [ ] Card-based layout
- [ ] Tappable elements 48x48px
- [ ] Touch gestures (swipe, tap, long-press)
- [ ] Pull-to-refresh
- [ ] Loading states (skeleton screens)
- [ ] Error states (inline)
- [ ] Empty states (helpful messages)
- [ ] Push notifications
- [ ] Offline mode + sync
- [ ] Dark mode option
- [ ] WCAG 2.1 AA accessibility
- [ ] Performance optimized
- [ ] Responsive typography
- [ ] Fast interactions
- [ ] PWA installable
- [ ] Camera integration
- [ ] Storage offline (IndexedDB)

---

EOF
cat /mnt/user-data/outputs/UX_UI_MOBILE_FIRST.md
