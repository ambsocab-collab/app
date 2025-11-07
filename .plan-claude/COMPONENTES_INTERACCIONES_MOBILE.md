# 🛠️ COMPONENTES & INTERACCIONES MOBILE PWA

## COMPONENTES REUTILIZABLES

### 1. BOTTOM TAB NAVIGATION

```
ESTRUCTURA:
├─ Fixed bottom
├─ Height: 64px (incluye safe area)
├─ 5 tabs icons + labels
├─ Indicador de la tab activa
└─ Badges para notificaciones

IMPLEMENTACIÓN:
<BottomNav>
  <Tab icon="home" label="Inicio" badge={0} />
  <Tab icon="list" label="Mis órdenes" badge={3} />
  <Tab icon="wrench" label="Taller" badge={1} />
  <Tab icon="chart" label="Reportes" badge={0} />
  <Tab icon="user" label="Perfil" badge={0} />
</BottomNav>

ESTILOS:
- Ancho: 100%
- Alto: 64px
- Background: #FFFFFF
- Border-top: 1px #E5E7EB
- Shadow: 0 -2px 8px rgba(0,0,0,0.1)
```

### 2. ORDEN CARD

```
ESTRUCTURA:
┌─────────────────────────┐
│ OT-4510 - Máquina       │ ← Número + máquina (16px bold)
│ Descripción breve       │ ← Descripción (14px regular)
│                         │
│ 🔴 CRÍTICA • 2h        │ ← Prioridad + duración (14px)
│ Hace 2 horas            │ ← Timestamp (12px gray)
│                         │
│ [INICIAR] [VER DETALLES]│ ← Botones secundarios
└─────────────────────────┘

PROPIEDADES:
interface OrdenCard {
  numero: string;        // "OT-4510"
  maquina: string;       // "CNC Línea A"
  descripcion: string;   // "Cambiar rodamiento"
  prioridad: Prioridad;  // CRÍTICA | ALTA | MEDIA | BAJA
  duracion: string;      // "2h"
  estado: Estado;        // ABIERTA | PENDIENTE | etc
  timestamp: number;     // milliseconds
  onIniciar: () => void;
  onVerDetalles: () => void;
}

ESTILOS:
- Padding: 16px
- Margin-bottom: 12px
- Background: #FFFFFF
- Border: 1px #E5E7EB
- Border-radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

INTERACCIONES:
- Tap tarjeta: expand detalles
- Tap [INICIAR]: confirmación modal
- Tap [VER DETALLES]: abrir pantalla completa
- Swipe derecha: acciones rápidas (50% opacity)
- Long-press: menú contextual
```

### 3. KPI BADGE

```
ESTRUCTURA:
┌──────────────────────┐
│ Disponibilidad       │ ← Label (14px bold)
│ ████████░░ 92%      │ ← Progress bar + %
│ ↑ +3% semana anterior│ ← Trend (12px gray)
│ ✓ Muy bueno 🟢      │ ← Status (14px)
└──────────────────────┘

PROPIEDADES:
interface KPIBadge {
  label: string;         // "Disponibilidad"
  value: number;         // 92
  unit: string;          // "%"
  progressBar: boolean;
  trend?: {
    change: number;      // +3
    type: 'up' | 'down'; // dirección
    period: string;      // "semana anterior"
  };
  status?: 'good' | 'warning' | 'critical';
  icon?: string;         // emoji o icon
}

ESTILOS:
- Padding: 16px
- Background: #F9FAFB
- Border-radius: 12px
- Width: 100% (o 2x1 grid)
- Progress bar: 8px alto

COLORES PROGRESO:
- Good (>80%): #10B981 (verde)
- Warning (50-80%): #F59E0B (naranja)
- Critical (<50%): #EF4444 (rojo)
```

### 4. ACTION BUTTON

```
PRIMARY BUTTON:
┌──────────────────────┐
│   INICIAR ORDEN      │ ← 48px height, 100% width
└──────────────────────┘

PROPIEDADES:
interface Button {
  label: string;
  variant: 'primary' | 'secondary' | 'danger' | 'success';
  size: 'small' | 'medium' | 'large';  // default: medium
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;  // default: false
  icon?: string;
  onPress: () => void;
}

VARIANTES:

1. PRIMARY (Acciones principales)
   Background: #2563EB
   Text: #FFFFFF
   Touch: #1D4ED8 (más oscuro)

2. SECONDARY (Acciones secundarias)
   Background: #F3F4F6
   Text: #1F2937
   Border: 1px #E5E7EB
   Touch: #E5E7EB

3. DANGER (Destructivas)
   Background: #EF4444
   Text: #FFFFFF
   Touch: #DC2626

4. SUCCESS (Confirmación)
   Background: #10B981
   Text: #FFFFFF
   Touch: #059669

TAMAÑOS:
- Small: 36px height, 12px font
- Medium: 48px height, 16px font (default)
- Large: 56px height, 18px font

ESTADOS:
- Normal: opacity 1
- Hover: más oscuro
- Active: escala 0.98
- Disabled: opacity 0.5, pointer-events: none
- Loading: spinner + texto "Cargando..."
```

### 5. INPUT FIELD

```
TEXT INPUT:
┌────────────────────────────┐
│ Descripción de la nota     │ ← Placeholder
│ ________________           │ ← Texto usuario
└────────────────────────────┘

PROPIEDADES:
interface Input {
  type: 'text' | 'number' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  value: string;
  label?: string;        // Si no, en placeholder
  error?: string;        // Mensaje error si aplica
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
}

ESTILOS:
- Padding: 12px 16px
- Font-size: 16px (no zoom en mobile)
- Border: 1px #E5E7EB
- Border-radius: 8px
- Focus: border-color #2563EB, shadow 0 0 0 3px rgba(37,99,235,0.1)

ERROR STATE:
- Border-color: #EF4444
- Message: 12px, color #EF4444

TEXTAREA:
- Min-height: 100px
- Max-height: 300px (scrollable)
```

### 6. MODAL DIALOG

```
STRUCTURE:
┌─────────────────────────────┐
│ ✋ Overlay (backdrop)       │ ← Tap cierra modal
├─────────────────────────────┤
│ ┌───────────────────────┐   │
│ │ TÍTULO MODAL          │   │ ← Header
│ ├───────────────────────┤   │
│ │ Contenido del modal   │   │ ← Body (scrollable)
│ │                       │   │
│ │ [Formulario, etc]     │   │
│ ├───────────────────────┤   │
│ │ [CANCELAR] [ACEPTAR]  │   │ ← Footer buttons
│ └───────────────────────┘   │
└─────────────────────────────┘

PROPIEDADES:
interface Modal {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: {
    cancel?: { label: string; onPress: () => void };
    confirm?: { label: string; onPress: () => void };
  };
  size?: 'small' | 'medium' | 'large'; // default: medium
}

COMPORTAMIENTO:
- Overlay: rgba(0,0,0,0.3)
- Animación entrada: scale up + fade in 300ms
- Animación salida: scale down + fade out 200ms
- Tap overlay: cierra modal
- ESC key: cierra modal
- Safe area: respeta notch
```

### 7. LOADER / SKELETON SCREEN

```
SKELETON CARD:
┌─────────────────────┐
│ ▓▓▓▓ ▓▓▓▓           │ ← Línea shimmer
│                     │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │ ← Línea shimmer
│                     │
│ ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓   │ ← Línea shimmer
└─────────────────────┘

LOADING SPINNER:
    ↻ Cargando...

PROPIEDADES:
interface Skeleton {
  width: string | number;
  height: string | number;
  borderRadius?: number;
  count?: number;        // múltiples líneas
  circle?: boolean;      // para avatares
}

ANIMACIÓN:
- Background: linear-gradient 
- Shimmer: -100% → 100% en 1.5s
- Loop: infinite
- Color: #E5E7EB
- Shimmer highlight: #F3F4F6
```

### 8. BADGE / CHIP

```
SMALL BADGE:
  🔴 CRÍTICA

PROPIEDADES:
interface Badge {
  label: string;
  variant: 'critical' | 'high' | 'medium' | 'low' | 'success' | 'info';
  icon?: string;
  onClose?: () => void;  // Si es dismissable
}

ESTILOS:
- Padding: 4px 8px
- Font-size: 12px (bold)
- Border-radius: 12px (pill)
- Inline element

VARIANTES:
- CRITICAL: bg #FEE2E2, text #DC2626
- HIGH: bg #FEF3C7, text #D97706
- MEDIUM: bg #FEF08A, text #FBBF24
- LOW: bg #DCFCE7, text #22C55E
- SUCCESS: bg #D1FAE5, text #059669
- INFO: bg #DBEAFE, text #0284C7
```

---

## INTERACCIONES & GESTOS

### TAP (Toque simple)

```
EJEMPLO: Abrir orden
1. Usuario toca tarjeta
2. Visual feedback: escala 0.98, shadow
3. Duration: 150ms
4. Trigger: acción (navegación, etc)

ELEMENTOS TAPPABLES:
- Botones: 48x48px mínimo
- Links: padding 8px
- Cards: padding 12px
- Iconos: 44x44px
- Tab items: altura total
```

### DOUBLE TAP

```
EJEMPLO: Marcar importante/favorito
1. Usuario toca 2x rápido
2. Animación: escala pulse
3. Trigger: toggle state

ELEMENTOS:
- Tarjetas de orden
- Repuestos importantes
```

### LONG PRESS (Toque prolongado)

```
EJEMPLO: Menú contextual
1. Usuario mantiene presionado 500ms
2. Haptic feedback: vibración
3. Muestra menú con opciones

MENÚ CONTEXTUAL:
┌─────────────────────┐
│ ✏️ Editar           │
│ 📋 Copiar           │
│ 🗑️ Eliminar         │
│ ↗️ Compartir        │
└─────────────────────┘

ELEMENTOS:
- Tarjetas (editar, eliminar)
- Items lista (duplicar)
- Repuestos (información)
```

### SWIPE

```
SWIPE RIGHT (Deslizar derecha):
- Deshacer acción reciente
- Volver a pantalla anterior

SWIPE LEFT (Deslizar izquierda):
- Mostrar acciones rápidas
- Marcar como leído
- Archivar

EJEMPLO SWIPE LEFT:
┌─────────────────────┐
│ OT-4510 │ [🗑️] [✓] │ ← Botones aparecen
└─────────────────────┘

SWIPE UP:
- Pull-to-refresh (desde top)
- Abrir teclado (desde input)

SWIPE DOWN:
- Cerrar modal/sheet
- Cancelar acción
```

### PULL-TO-REFRESH

```
PULL DOWN:
┌─────────────────────┐
│ ↓ Tirar para...     │ ← Antes de trigger
├─────────────────────┤
│ Mis órdenes         │
└─────────────────────┘

RELEASE:
┌─────────────────────┐
│ ↻ Refrescando...    │ ← Loading
├─────────────────────┤
│ Mis órdenes         │
└─────────────────────┘

COMPLETE:
┌─────────────────────┐
│ ✓ Actualizado       │ ← Success
├─────────────────────┤
│ Mis órdenes         │
│ (nuevos datos)      │
└─────────────────────┘

IMPLEMENTACIÓN:
- Trigger: -60px de top
- Release: refresca si > -60px
- Duration: 500ms de animación
```

### HAPTIC FEEDBACK

```
Vibración táctil en eventos:

LIGHT (10ms):
- Tap simple
- Button press

MEDIUM (20ms):
- Acción completada
- Success state

HEAVY (30ms):
- Error
- Acción crítica
- Warning

PATTERN (secuencia):
- Notificación: light, light, heavy
- Success: medium, light
```

---

## FLUJOS DE NAVEGACIÓN

### TAB NAVIGATION

```
HOME (Tab 1) → Dashboard
├─ KPI cards
├─ Alerts
├─ Acciones rápidas
└─ Upcoming tasks

TAP en tarjeta → DETALLE ORDEN
  ├─ Información completa
  ├─ Repuestos
  ├─ Documentación (fotos)
  └─ Botones: Iniciar, Pausar, Completar

BACK → HOME
```

### MODAL STACK

```
NIVEL 1: Pantalla base (Tab)
  ↓ Modal appears
NIVEL 2: Primer modal (confirmación)
  ↓ Modal appears
NIVEL 3: Segundo modal (picker)
  ↓ Cerrar → NIVEL 2
BACK → NIVEL 1
```

### BOTTOM SHEET

```
PARCIALMENTE VISIBLE:
┌─────────────────────┐
│ [Contenido tab]     │
├─────────────────────┤
│ ╔═════════════════╗ │ ← 50% visible
│ ║ Opciones o      ║ │
│ ║ formulario      ║ │
│ ║                 ║ │
└─────────────────────┘

SWIPE UP → FULLSCREEN
┌─────────────────────┐
│ ╔═════════════════╗ │
│ ║ Opciones o      ║ │ ← 100% visible
│ ║ formulario      ║ │
│ ║                 ║ │
│ ║                 ║ │
│ ║                 ║ │
└─────────────────────┘

SWIPE DOWN → CERRAR
```

---

## LOADING STATES

### SKELETON SCREEN

```
PRIMERO: Cargar datos
- Mostrar esqueleto (fake UI)
- Shimmer animation
- No es aburrido esperar

LUEGO: Datos listos
- Fade in datos reales
- Reemplazar esqueleto
- Smooth transition
```

### INLINE LOADING

```
BOTÓN LOADING:
[    INICIAR ORDEN    ] (normal)
        ↓ press
[  ↻ Enviando...      ] (loading)
        ↓ complete
[ ✓ Orden iniciada!   ] (success)
        ↓ 1s
[    VOLVER A ÓRDENES ] (final state)
```

---

## ERROR HANDLING

### INLINE ERRORS

```
EMAIL FIELD (vacío):
┌────────────────────────────┐
│ Email                      │ ← Label
│ [______________________]   │ ← Input
│ Campo requerido            │ ← Error (12px, red)
└────────────────────────────┘

VALIDACIÓN EN TIEMPO REAL:
├─ Green checkmark cuando válido
├─ Red X cuando inválido
└─ Mensaje de ayuda
```

### ERROR SCREEN

```
┌─────────────────────────────┐
│          ❌                 │
│ Algo salió mal              │
│                             │
│ No pudimos cargar tus       │
│ órdenes. Verifica tu        │
│ conexión e intenta de       │
│ nuevo.                      │
│                             │
│ Error: Network timeout      │ ← Detalles (opcional)
│                             │
│ [REINTENTAR] [VOLVER]       │
│                             │
└─────────────────────────────┘
```

### NETWORK ERROR

```
BANNER EN TOP:
┌─────────────────────────────┐
│ ⚠️ Sin conexión a internet │ ← Siempre visible
│ Modo offline - cambios      │
│ se sincronizarán después    │
└─────────────────────────────┘

RETRY BUTTON:
[REINTENTAR CONEXIÓN]
- Intenta cada 5 segundos
- Muestra "Intentando..."
- Auto-cierra cuando recupera
```

---

## EMPTY STATES

```
LISTA VACÍA:
┌─────────────────────────────┐
│                             │
│          📋                 │ ← Icono
│                             │
│ Sin órdenes pendientes      │ ← Título
│                             │
│ Cuando te asignen una       │
│ orden aparecerá aquí        │ ← Mensaje ayuda
│                             │
│ [CREAR NUEVA ORDEN]         │ ← CTA (si aplica)
│                             │
└─────────────────────────────┘
```

---

## ACCESSIBILITY FOCUS STATES

```
KEYBOARD NAVIGATION:
- Tab: siguiente elemento
- Shift+Tab: elemento anterior
- Enter: activar
- Space: toggle
- Escape: cerrar modal

FOCUS INDICATOR:
┌──────────────────────┐
│ Focus ring: 3px,    │ ← Azul
│ offset: 2px          │
│ Visible siempre      │
│                      │
│ [BUTTON]             │ ← Con focus outline
└──────────────────────┘

SCREEN READER:
- Todas imágenes: alt text
- Botones: label claro
- Errores: anunciados
- Alerts: aria-live
- Forms: labels asociados
```

---

## PERFORMANCE OPTIMIZATIONS

### IMAGE OPTIMIZATION

```
┌─ ORIGINALS (fotos cámara)
├─ Resize a 1080px (max width)
├─ Compress (quality 70%)
├─ WebP format (con fallback JPG)
├─ Lazy load cuando scroll
└─ Blur-up placeholder (LQIP)

TAMAÑOS:
- Thumbnail: 80x80px
- Preview: 300x300px
- Full: 1080x1920px (max)
```

### PAGINATION / INFINITE SCROLL

```
LISTA DE ÓRDENES:

PRIMERO: 10 items
├─ User scrolls
├─ Detect: 3 items de fin
├─ Load next 10 items
├─ Append a lista
├─ Animation: fade in
└─ Continúa infinito

O PAGINATION:
[1] [2] [3] [Siguiente ▶]
```

### CODE SPLITTING

```
CADA TAB: Separado chunk
- Home: bundle pequeño
- Órdenes: bundle separado
- Taller: bundle separado
- Reportes: bundle separado
- Perfil: bundle separado

LOAD ON DEMAND:
├─ Initial: Home + Tab navigation
├─ On Tab Click: Load that chunk
├─ Parallel: Preload next tab
└─ Transición suave
```

---

## PWA SPECIFICS

### INSTALLATION PROMPT

```
CUANDO APLICABLE:
- Usuario visita app >2 veces
- En 5 minutos
- Mostra banner:

┌─────────────────────────────┐
│ 📱 Instalar app             │
│ Accede rápido sin navegar   │
│                             │
│ [NO GRACIAS] [INSTALAR]     │
└─────────────────────────────┘

AFTER INSTALL:
- Icono en home screen
- Abre fullscreen (sin URL bar)
- Funciona offline
- Push notifications
```

### SERVICE WORKER CACHING

```
ESTRATEGIAS:

1. Cache First (Offline-first):
   ├─ Intenta caché
   ├─ Si no existe → fetch
   ├─ Guarda en caché
   └─ Ideal para: Assets, imágenes

2. Network First:
   ├─ Intenta network
   ├─ Si falla → caché
   ├─ Actualiza caché
   └─ Ideal para: API calls, datos

3. Stale While Revalidate:
   ├─ Devuelve caché
   ├─ Actualiza en background
   ├─ Próxima vez es fresca
   └─ Ideal para: Content, página
```

---

## RESPONSIVE BREAKPOINTS

```
MOBILE FIRST:
- Base: 375px (pequeños)
- Tablet: 768px (landscape)
- Desktop: 1024px+

DISEÑO FLUIDO:
- Padding: relativo
- Font: responsive (clamp)
- Grid: fluid columns
- Images: 100% width
```

---

EOF
cat /mnt/user-data/outputs/COMPONENTES_INTERACCIONES_MOBILE.md
