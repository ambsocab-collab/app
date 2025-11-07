# 🎨 PROMPT PARA GENERAR UI/UX EN GOOGLE SKETCH

## INSTRUCCIONES PARA IA (CLAUDE/CHATGPT)

```
Necesito que generes una guía completa para crear los diseños UI/UX 
de un sistema de gestión de mantenimiento industrial en Google Sketch.

El sistema se llama: "Sistema de Gestión de Mantenimiento Industrial"

CARACTERÍSTICAS PRINCIPALES:
- Aplicación web + PWA (mobile first)
- Sincronización en tiempo real
- Dashboard con KPIs
- Tablero Kanban interactivo
- Pantalla TV con rotación automática
- Notificaciones push

FRAMEWORKS RECOMENDADOS:
- Material Design 3 (Google)
- Tailwind CSS compatible
- Componentes reutilizables

```

---

## 📋 PROMPT DETALLADO PARA GOOGLE SKETCH

```
Estoy creando un Sistema de Gestión de Mantenimiento Industrial.
Necesito los diseños UI/UX completos en Google Sketch.

===============================================================================
ESPECIFICACIONES TÉCNICAS
===============================================================================

STACK FRONTEND:
- React 18 + Vite
- Tailwind CSS
- Material Design 3
- Responsive (Mobile First)
- PWA compatible

BREAKPOINTS:
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+
- TV: 1920px+

PALETA DE COLORES:
- Primary: #2563EB (Azul)
- Success: #10B981 (Verde)
- Warning: #F59E0B (Naranja)
- Error: #EF4444 (Rojo)
- Neutral: #6B7280 (Gris)
- Background: #FFFFFF
- Surface: #F9FAFB
- Text Primary: #111827

===============================================================================
PANTALLAS REQUERIDAS (19 PANTALLAS PRINCIPALES)
===============================================================================

AUTENTICACIÓN (2 PANTALLAS):
1. Login
   - Email input
   - Password input
   - Remember me checkbox
   - Login button
   - Forgot password link
   - Responsive mobile/desktop

2. Onboarding - Pantalla Inicial
   - Bienvenida
   - Logo empresa
   - Paso 1 de 5
   - Progreso visual
   - Botones: Siguiente, Saltar

ONBOARDING (4 PANTALLAS):
3. Crear Primera Máquina (Paso 1)
   - Nombre input
   - Código input
   - Área dropdown
   - Tipo dropdown
   - Descripción textarea
   - Botones: Atrás, Siguiente, Saltar

4. Agregar Componentes (Paso 2)
   - Formulario componente
   - Lista componentes agregados
   - Botones: Agregar otro, Siguiente
   - Cards de componentes

5. Agregar Repuestos (Paso 3)
   - Formulario repuesto
   - Unidad de medida dropdown
   - Lista repuestos agregados
   - Stock actual / mínimo
   - Botones: Agregar otro, Siguiente

6. Crear Usuarios (Paso 4)
   - Nombre input
   - Email input
   - Rol dropdown
   - Área dropdown
   - Lista usuarios
   - Botones: Agregar otro, Siguiente

7. Confirmación Onboarding (Paso 5)
   - Resumen de todo agregado
   - Checkmarks verdes
   - Botones: Atrás, Ir a Dashboard, Agregar más datos

PANELES PRINCIPALES (7 PANTALLAS):
8. Dashboard Supervisor
   - Header con logo + usuario
   - Sidebar navegación
   - Grid de KPIs (disponibilidad, MTTR, OT pendientes)
   - Gráfico de tendencias
   - Tabla OT por estado
   - Cards con alertas

9. Panel Operario - Mis Órdenes
   - Header
   - 3 Secciones: Pendientes, En Progreso, Completadas
   - Cards de OT con:
     * Número OT
     * Máquina
     * Descripción
     * Prioridad (color)
     * Botón INICIAR / COMPLETAR
   - Sidebar navegación

10. Panel Admin - Gestión
    - Header
    - Tabs: Máquinas, Usuarios, Repuestos, Componentes, Configuración
    - Tabla con datos
    - Botones: Crear, Editar, Eliminar
    - Campos búsqueda/filtro

11. Modo Reunión - Tablero Kanban
    - 11+ columnas estados
    - Tarjetas drag-and-drop
    - Filtros: Prioridad, Operario, Área
    - Zoom: 100%, 150%, 200%
    - Botones: Filtrar, Zoom, Opciones
    - Tarjetas con info: OT, Máquina, Prioridad, Operario

12. Modo TV - Pantalla 1 KPIs
    - Full screen
    - 6 Cards grandes con KPIs
    - Colores: Verde (bien), Naranja (cuidado), Rojo (crítico)
    - Tipografía muy grande
    - Indicador de página 1/4
    - Actualización cada 30 seg

13. Modo TV - Pantalla 2 Tarjetas Pendientes
    - Full screen
    - Grid de tarjetas OT pendientes
    - Colores por prioridad
    - Tarjetas grandes, legibles desde lejos
    - Sin scroll (máx 6 tarjetas)

14. Modo TV - Pantalla 3 KPIs Secundarios
    - Full screen
    - 4 Secciones principales
    - Gráficos simples
    - Tipografía grande
    - Datos: preventivo/correctivo, repuestos, operarios, costos

15. Modo TV - Pantalla 4 En Progreso
    - Full screen
    - 4 Cards (máximo)
    - Barra de progreso por card
    - Operario, máquina, progreso %
    - Colores: Verde (ok), Amarillo (atrasado)

DETALLES (4 PANTALLAS):
16. Detalle OT Completa
    - Header con OT número
    - Tabs: Datos, Repuestos, Historial, Fotos
    - Formulario editable
    - Botones de acción
    - Historial de cambios

17. Detalle Máquina
    - Información técnica
    - Componentes reemplazables
    - Historial OT
    - Tabs: Datos, Componentes, OT, Documentos

18. Detalle Componente Reemplazable
    - Múltiples instancias (tabla)
    - Estados por instancia
    - Historial completo
    - Costo total invertido
    - Recomendación (reparar vs reemplazar)

19. Detalle Repuesto
    - Stock actual/mínimo
    - Gráfico consumo
    - Máquinas que usan
    - Proveedor
    - Historial movimientos

===============================================================================
ESTILOS Y COMPONENTES REUTILIZABLES
===============================================================================

TIPOGRAFÍA:
- Título H1: 32px, Bold, Color Primary
- Título H2: 24px, Bold, Color Primary
- Título H3: 18px, SemiBold, Color Primary
- Párrafo: 14px, Regular, Color Text Primary
- Small: 12px, Regular, Color Text Secondary

BOTONES:
- Primary Button: 
  * Background: Primary Blue
  * Text: White
  * Padding: 12px 24px
  * Border Radius: 6px
  * Hover: Darker blue

- Secondary Button:
  * Background: Surface
  * Border: 1px Primary
  * Text: Primary
  * Padding: 12px 24px
  * Border Radius: 6px

- Danger Button:
  * Background: Error Red
  * Text: White
  * Padding: 12px 24px

- Icon Button:
  * Background: Transparent
  * Icon: 24px
  * Padding: 8px

INPUTS:
- Text Input:
  * Border: 1px Neutral
  * Padding: 12px 16px
  * Border Radius: 6px
  * Font: 14px
  * Placeholder: Gray
  * Focus: Blue border + shadow

- Textarea:
  * Mismo que input
  * Min-height: 120px
  * Resize: vertical

- Select/Dropdown:
  * Mismo que input
  * Dropdown icon derecha
  * Options list debajo

- Checkbox:
  * Size: 18px
  * Checked: Primary color
  * Label al lado

CARDS:
- Elevación: 1px shadow
- Border Radius: 8px
- Padding: 16px
- Background: White
- Hover: Elevación 4px

ALERTAS:
- Success (Verde):
  * Background: #ECFDF5
  * Border-left: 4px #10B981
  * Icon + Text

- Warning (Naranja):
  * Background: #FFFBEB
  * Border-left: 4px #F59E0B

- Error (Rojo):
  * Background: #FEF2F2
  * Border-left: 4px #EF4444

BADGES/ETIQUETAS:
- Por prioridad:
  * CRÍTICA: Red background, white text
  * ALTA: Orange background
  * MEDIA: Yellow background
  * BAJA: Green background

- Por estado:
  * ABIERTA: Gray
  * PLANIFICADA: Blue
  * EN EJECUCIÓN: Purple
  * COMPLETADA: Green
  * RECHAZADA: Red

BARRAS DE PROGRESO:
- Height: 8px
- Border Radius: 4px
- Background: #E5E7EB
- Progress bar: Gradient Primary color
- Porcentaje texto encima

TABLAS:
- Header: Background #F3F4F6, Bold text
- Filas alternadas: Blanco y #F9FAFB
- Hover fila: Background #F0F4F8
- Border: 1px #E5E7EB

===============================================================================
FLUJOS Y TRANSICIONES
===============================================================================

TRANSICIONES:
- Fade in/out: 200ms
- Slide: 300ms
- Color change: 150ms
- Hover states: 100ms

MODALS/DIÁLOGOS:
- Overlay: Semi-transparent black (40%)
- Modal: Centered, 90% width en móvil, máx 500px
- Close button: X icon top-right
- Buttons: Primary + Secondary

NOTIFICACIONES (Toast):
- Posición: Bottom-right (desktop), Bottom-center (móvil)
- Auto-hide: 4 segundos
- Slide in: 300ms
- Slide out: 200ms
- Tipos: Success, Error, Warning, Info

ANIMACIONES:
- Loading spinner: Rotación continua
- Skeleton loaders: Shimmer effect
- Pulse animación para alertas críticas
- Bounce para notificaciones

===============================================================================
RESPONSIVE DESIGN
===============================================================================

MÓVIL (320px - 640px):
- Stack vertical
- Full width inputs
- Bottom tabs navigation
- Drawer menu (hamburger)
- Tarjetas en 1 columna
- Tipografía más pequeña (12px min)
- Botones más grandes (44px altura)
- Padding reduced

TABLET (641px - 1024px):
- 2 columnas (donde aplique)
- Sidebar parcial (icons + label)
- Tarjetas en 2 columnas
- Tipografía normal
- Padding moderado

DESKTOP (1025px+):
- Layouts completos
- Sidebar completo (expandible)
- Tablas con scroll
- Múltiples columnas
- Tipografía normal
- Padding generoso

===============================================================================
DARK MODE (OPCIONAL)
===============================================================================

Si implementar dark mode:
- Background: #1F2937
- Surface: #111827
- Text Primary: #F9FAFB
- Cards: #374151
- Mismo esquema de colores ajustado

===============================================================================
ASSETS NECESARIOS
===============================================================================

ICONOS:
- Material Design Icons (Google)
- Feather Icons (alternativa)
- Size: 24px (estándar), 16px (small), 32px (grande)
- Color: Inherit from text

LOGOS/IMAGERÍA:
- Logo empresa (placeholder SVG)
- Avatar usuario (placeholder)
- Íconos máquinas (CNC, Robot, Compresor, etc)
- Íconos estados OT

IMÁGENES:
- Illustrations vacías (cuando no hay datos)
- Empty state icons
- Error state illustration

===============================================================================
ESPECIFICACIONES EXPORTACIÓN
===============================================================================

FORMATOS:
- SVG: Para iconos, componentes reutilizables
- PNG: Para imágenes, ilustraciones
- CSS: Exportar colores, tipografía, espaciado

ESTRUCTURA SKETCH:
- Páginas por sección (Auth, Onboarding, Panels, TV, etc)
- Componentes maestros para reutilizar
- Symbols para buttons, inputs, cards
- Color styles definidas
- Text styles definidas

===============================================================================
NOTAS IMPORTANTES
===============================================================================

1. ACCESIBILIDAD:
   - Contrast ratio mínimo WCAG AA (4.5:1)
   - Tamaño texto mínimo 12px
   - Focus states visibles
   - Alt text para imágenes

2. PERFORMANCE:
   - Diseños simples, no sobrecargar
   - Animaciones suaves sin lag
   - Iconos SVG en lugar de imágenes

3. CONSISTENCIA:
   - Usar la misma tipografía en todo
   - Espaciado consistent (8px base)
   - Padding/margin escalado

4. MOBILE FIRST:
   - Diseñar móvil primero
   - Luego expandir a desktop
   - No es solo versión más pequeña

5. VALIDACIONES:
   - Estados: Default, Hover, Focus, Disabled, Error
   - Mostrar errores claros en inputs
   - Loading states en botones
```

---

## 🎯 CÓMO USAR ESTE PROMPT

### Opción 1: Claude/ChatGPT directo

```
1. Copia todo el PROMPT DETALLADO
2. Pégalo en Claude o ChatGPT
3. Pide: "Genera las pantallas para Google Sketch"
4. Recibirás instrucciones completas
```

### Opción 2: Usar con Google Sketch AI

```
1. Abre Google Sketch
2. Nuevo proyecto
3. AI Assistant (si está disponible)
4. Pega el prompt
5. Espera los diseños generados
```

### Opción 3: Importar en Figma (alternativa)

```
1. Google Sketch exporta a Figma
2. Usa mismo prompt en Figma AI
3. Figma tiene mejores herramientas AI para diseño
```

---

## 📋 CHECKLIST DE PANTALLAS

### Autenticación (2)
- [ ] Login
- [ ] Onboarding Bienvenida

### Onboarding (5)
- [ ] Pantalla 1: Máquina
- [ ] Pantalla 2: Componentes
- [ ] Pantalla 3: Repuestos
- [ ] Pantalla 4: Usuarios
- [ ] Pantalla 5: Confirmación

### Paneles (7)
- [ ] Dashboard Supervisor
- [ ] Panel Operario
- [ ] Panel Admin
- [ ] Kanban Reunión
- [ ] TV KPIs
- [ ] TV Tarjetas
- [ ] TV Análisis

### Detalles (4)
- [ ] Detalle OT
- [ ] Detalle Máquina
- [ ] Detalle Componente
- [ ] Detalle Repuesto

### Componentes Base
- [ ] Button primario
- [ ] Button secundario
- [ ] Input text
- [ ] Textarea
- [ ] Dropdown
- [ ] Card
- [ ] Table
- [ ] Modal
- [ ] Alert/Toast
- [ ] Badge
- [ ] Progress bar

---

## 🎨 EXPORTACIÓN

Una vez tengas los diseños:

1. **Exportar assets:**
   - Botón derecho → Export
   - Formato: SVG para componentes, PNG para imágenes

2. **Crear design system:**
   - Documentar tipografía
   - Documentar colores
   - Documentar componentes
   - Crear guía de uso

3. **Integrar con código:**
   - Tailwind: Copiar valores exactos
   - React: Crear componentes basados en diseños
   - Compartir con equipo frontend

---

## 💡 TIPS

1. **Reutiliza componentes:**
   - Un button primario = un componente
   - Úsalo en todas las pantallas
   - Los cambios se actualizar automáticamente

2. **Agrupa por secciones:**
   - Página "Auth" para login
   - Página "Onboarding" para flujo inicial
   - Página "Panels" para dashboards
   - Página "TV" para pantalla TV

3. **Testea responsive:**
   - Desktop: 1920px
   - Tablet: 768px
   - Mobile: 375px
   - Visualiza en cada uno

4. **Documentación:**
   - Añade notas en componentes
   - Especifica tamaños exactos
   - Indicar animaciones esperadas
   - Casos de uso de cada componente

5. **Versioning:**
   - Guarda versiones (v1, v2, etc)
   - Comparte link con equipo
   - Recibe feedback iterativamente

---

## 🔄 ITERACIÓN

Después del diseño inicial:

1. **Feedback equipo frontend:**
   - ¿Se puede implementar fácilmente?
   - ¿Necesita ajustes?
   - ¿Falta algo?

2. **User testing:**
   - ¿Es intuitivo?
   - ¿Es accesible?
   - ¿Necesita cambios?

3. **Ajustes finales:**
   - Refina basado en feedback
   - Asegúrate que sea responsive
   - Valida accesibilidad

4. **Handoff a desarrollo:**
   - Exporta design system
   - Comparte Sketch link
   - Proporciona especificaciones

