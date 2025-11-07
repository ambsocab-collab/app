# 📺 MODO TV - ROTACIÓN DE KPIs Y TARJETAS

## CONCEPTO

```
PANTALLA TV (por defecto, cuando no está en MODO REUNIÓN):
├─ Rotación automática cada 10 segundos
├─ Pantalla 1: KPIs principales (5 segundos)
├─ Pantalla 2: Tarjetas órdenes pendientes (10 segundos)
├─ Pantalla 3: KPIs secundarios (5 segundos)
├─ Pantalla 4: Tarjetas en progreso (10 segundos)
├─ Vuelve a Pantalla 1
└─ Se puede entrar a MODO REUNIÓN en cualquier momento (Pause / Click)
```

---

## 📊 PANTALLA 1: KPIs PRINCIPALES (5 seg)

```
┌──────────────────────────────────────────────────────────────┐
│                    KPIs - ESTADO ACTUAL                      │
│                    [Actualizado hace 30 seg]                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ╔════════════════╗  ╔════════════════╗  ╔════════════════╗ │
│  ║  DISPONIBILIDAD║  ║  OT PENDIENTES ║  ║  EN EJECUCIÓN  ║ │
│  ║                ║  ║                ║  ║                ║ │
│  ║      92%       ║  ║       12       ║  ║        5       ║ │
│  ║  📈 +3% hoy    ║  ║  ↓ -2 vs ayer  ║  ║  ↑ +1 vs ayer  ║ │
│  ║                ║  ║                ║  ║                ║ │
│  ║ Excelente 🟢   ║  ║ Normal 🔵      ║  ║ Normal 🔵      ║ │
│  ╚════════════════╝  ╚════════════════╝  ╚════════════════╝ │
│                                                              │
│  ╔════════════════╗  ╔════════════════╗  ╔════════════════╗ │
│  ║ MTTR PROMEDIO  ║  ║  OT COMPLETADAS║  ║  TASA ÉXITO    ║ │
│  ║                ║  ║   (este mes)   ║  ║   (rechazos)   ║ │
│  ║    1h 32min    ║  ║       187      ║  ║      95%       ║ │
│  ║  ↑ -15min ayer ║  ║  📊 +12 vs ago ║  ║  ✓ Excelente   ║ │
│  ║                ║  ║                ║  ║                ║ │
│  ║ Mejorando 🟢   ║  ║ Productivo 🟢  ║  ║ Excelente 🟢   ║ │
│  ╚════════════════╝  ╚════════════════╝  ╚════════════════╝ │
│                                                              │
│  ⏭️ Siguiente: Tarjetas pendientes  [■□□□]               │
└──────────────────────────────────────────────────────────────┘
```

### DATOS MOSTRADOS:
```
Fila 1:
├─ Disponibilidad (%)
├─ OT Pendientes (count)
└─ En Ejecución (count)

Fila 2:
├─ MTTR promedio (tiempo)
├─ OT Completadas este mes (count)
└─ Tasa Éxito (%)

INDICADORES:
🟢 Verde: Bueno/Excelente
🔵 Azul: Normal
🟠 Naranja: Atención requerida
🔴 Rojo: Crítico

COMPARATIVAS:
📈 Mejorando vs ayer
📉 Empeorando vs ayer
➡️ Sin cambios
```

---

## 🎯 PANTALLA 2: TARJETAS ÓRDENES PENDIENTES (10 seg)

```
┌──────────────────────────────────────────────────────────────┐
│         ÓRDENES PENDIENTES - Esperando Asignación           │
│                    [12 órdenes sin asignar]                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │ OT-4501        │  │ OT-4502        │  │ OT-4503        │ │
│  │ CNC Línea A    │  │ Robot B        │  │ Compresor      │ │
│  │ Cambiar rodillo│  │ Revisar sensors│  │ Mantenimiento  │ │
│  │ 🔴 CRÍTICA     │  │ 🟠 ALTA        │  │ 🔴 CRÍTICA     │ │
│  │ 2h estimado    │  │ 1h 30min       │  │ 3h estimado    │ │
│  │ Hace 2 horas   │  │ Hace 45 min    │  │ Hace 30 min    │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │ OT-4504        │  │ OT-4505        │  │ OT-4506        │ │
│  │ Línea C        │  │ Válvula agua   │  │ Filtro prensa  │ │
│  │ Alineación     │  │ Fuga detectada │  │ Limpieza       │ │
│  │ 🟡 MEDIA       │  │ 🟠 ALTA        │  │ 🟢 BAJA        │ │
│  │ 1h estimado    │  │ 2h estimado    │  │ 30min estimado │ │
│  │ Hace 1 hora    │  │ Hace 15 min    │  │ Hace 5 min     │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
│                                                              │
│  Total: 12 órdenes  |  3 CRÍTICAS  |  3 ALTAS  |  2 MEDIAS │
│  ⚠️ CRÍTICAS VENCIDAS (hace >2h): 2 órdenes                │
│                                                              │
│  ⏭️ Siguiente: KPIs secundarios  [■■□□]                  │
└──────────────────────────────────────────────────────────────┘
```

### CARACTERÍSTICAS:
```
- Tarjetas grandes, legibles desde lejos
- Colores por prioridad
- Tiempo desde creación
- Ordenadas por antigüedad (más viejas arriba)
- Alerta si pasan X horas sin asignar
- Scroll automático si hay más de 6 órdenes
- Resumen total al pie
```

---

## 📈 PANTALLA 3: KPIs SECUNDARIOS (5 seg)

```
┌──────────────────────────────────────────────────────────────┐
│                  ANÁLISIS DETALLADO - KPIs                  │
│                    [Actualizado hace 1 min]                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  MANTENIMIENTO                   COSTOS                     │
│  ──────────────────────────────   ──────────────────────    │
│  Preventivo vs Correctivo:       Total mes actual:         │
│  ┌─────────────┐                 $45,230                   │
│  │█████░░░░░  │ 62% Preventivo  ↓ -8% vs mes anterior      │
│  │    38% Correctivo              ✓ Bajo control           │
│  └─────────────┘                                            │
│                                                              │
│  Repuestos más consumidos:      Costo por tipo:            │
│  1. Aceite ISO 32 → 180L        - Correctivo: $28,500      │
│  2. Filtros prensa → 45 un      - Preventivo: $16,730      │
│  3. Rodamientos → 23 un                                     │
│  4. Sellos → 89 un              Stock crítico:             │
│  5. Correas → 12 un             ⚠️ Empaque sello (0)       │
│                                  ⚠️ Rodamiento (1)         │
│                                                              │
│  Operarios más productivos:      Equipos problemáticos:    │
│  1. Juan → 23 OT completadas    1. CNC Línea A (8 fallos)  │
│  2. Pedro → 21 OT completadas   2. Robot B (5 fallos)      │
│  3. María → 19 OT completadas   3. Compresor (4 fallos)    │
│                                                              │
│  ⏭️ Siguiente: Tarjetas en progreso  [■■■□]             │
└──────────────────────────────────────────────────────────────┘
```

### DATOS MOSTRADOS:
```
Sección Mantenimiento:
├─ Ratio Preventivo vs Correctivo
├─ Top 5 repuestos consumidos
└─ Operarios más productivos

Sección Costos:
├─ Total invertido este mes
├─ Comparativa vs mes anterior
├─ Desglose por tipo
└─ Stock crítico actual

OBJETIVO: Visión estratégica rápida
```

---

## ⚡ PANTALLA 4: TARJETAS EN PROGRESO (10 seg)

```
┌──────────────────────────────────────────────────────────────┐
│           ÓRDENES EN EJECUCIÓN - Progreso Actual           │
│                      [5 órdenes activas]                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Operario: JUAN                  Operario: PEDRO            │
│  ┌────────────────────────────┐  ┌────────────────────────┐ │
│  │ OT-4510                    │  │ OT-4512                │ │
│  │ CNC Línea A - Rodamiento   │  │ Robot B - Velocidad    │ │
│  │                            │  │                        │ │
│  │ Progreso:                  │  │ Progreso:              │ │
│  │ ████████░░ 80%             │  │ ██████░░░░ 60%         │ │
│  │                            │  │                        │ │
│  │ ⏱️ 48 min / 60 min est.     │  │ ⏱️ 1h 20min / 2h 30est │ │
│  │ Status: En horario         │  │ Status: ⚠️ +50% tiempo │ │
│  │ 🟢 Juan (experto)          │  │ 🟠 Pedro (necesita ayuda)
│  └────────────────────────────┘  └────────────────────────┘ │
│                                                              │
│  Operario: MARÍA                 Operario: CARLOS           │
│  ┌────────────────────────────┐  ┌────────────────────────┐ │
│  │ OT-4513                    │  │ OT-4514                │ │
│  │ Compresor - Limpieza       │  │ Válvula - Calibración  │ │
│  │                            │  │                        │ │
│  │ Progreso:                  │  │ Progreso:              │ │
│  │ ████████████░ 92%          │  │ ████░░░░░░ 40%         │ │
│  │                            │  │                        │ │
│  │ ⏱️ 28 min / 30 min est.     │  │ ⏱️ 45 min / 1h 45 est  │ │
│  │ Status: Casi listo         │  │ Status: En horario     │ │
│  │ 🟢 María (muy bueno)       │  │ 🟢 Carlos (bien)       │ │
│  └────────────────────────────┘  └────────────────────────┘ │
│                                                              │
│  + 1 más en progreso               Total: 5 OT activas     │
│                                                              │
│  ⏭️ Siguiente: KPIs principales  [■■■■]                 │
└──────────────────────────────────────────────────────────────┘
```

### CARACTERÍSTICAS:
```
- Barra de progreso visual
- Tiempo invertido vs estimado
- Alertas si se pasa estimado
- Operario asignado con evaluación
- Status visual (verde/amarillo/rojo)
- Máximo 4 tarjetas visibles
- Scroll si hay más
```

---

## 🎮 TOGGLE - CONECTAR TV

```
UBICACIÓN: Arriba a la izquierda de CUALQUIER pantalla

┌──────────────────────────────────┐
│ 🖥️  PANTALLA TV                  │
│                                  │
│ Estado: [Switch ON/OFF] 🟢       │
│                                  │
│ ├─ IP TV: 192.168.1.105          │
│ ├─ Resolución: 1920x1080         │
│ ├─ Última actividad: hace 30 seg │
│ ├─ Modo actual: Rotación (KPIs)  │
│ ├─ Pantalla visible: 2/4         │
│ └─ Latencia: 120ms               │
│                                  │
│ [Testear conexión]  [Reiniciar]  │
└──────────────────────────────────┘

COMPORTAMIENTO:
☑ ON = TV conectada y recibiendo datos en tiempo real
☐ OFF = TV desconectada

DISPONIBLE EN:
├─ Dashboard Supervisor (visible)
├─ Panel Admin (editable)
├─ Panel Operario (solo lectura)
└─ Todas las pantallas del sistema
```

---

## 📱 FUNCIONALIDAD DEL TOGGLE

```
AL ACTIVAR (☑ ON):

1. Sistema intenta conectar con TV
   ├─ Verifica IP configurada
   ├─ Establece conexión WebSocket
   └─ Durée: 2-3 segundos

2. Si éxito → Toggle muestra:
   ├─ 🟢 CONECTADO
   ├─ IP TV visible
   ├─ Latencia en ms
   └─ Modo actual (Rotación/Reunión)

3. TV comienza a recibir datos:
   ├─ Inicia rotación automática
   ├─ Recibe KPIs actualizados
   ├─ Recibe lista de tarjetas
   └─ Está lista para cambios en tiempo real

4. Desde este momento:
   ├─ TODO cambio en el sistema se envía a TV
   ├─ OT nueva → aparece en TV
   ├─ Estado cambiado → tarjeta se mueve
   ├─ Prioridad modificada → color actualiza
   └─ Sin intervención manual


AL DESACTIVAR (☐ OFF):

1. Sistema cierra conexión WebSocket
2. TV recibe: "Desconectar"
3. TV muestra: "Conexión perdida" o pantalla negra
4. Toggle muestra:
   ├─ 🔴 DESCONECTADA
   ├─ Sin datos adicionales
   └─ Botón para reconectar

5. TV retiene última imagen 15 segundos
6. Si se activa de nuevo: sincronización automática


SI TV SE DESCONECTA SOLA (fallo de red):

1. Sistema detecta pérdida de conexión
2. Toggle pasa automáticamente a OFF
3. Notificación en navegador: "TV desconectada"
4. Reintentos automáticos cada 5 segundos
5. Si se reconecta: Toggle auto ON
6. Sincronización instantánea del estado actual
```

---

## 🎮 CONTROLES TV EN MODO REUNIÓN

```
ENTRADA AL MODO REUNIÓN:

Opción 1 - Desde laptop:
├─ [MODO REUNIÓN] botón en Dashboard
└─ TV cambia de "Rotación" → "Kanban"

Opción 2 - Desde TV (si tiene control remoto):
├─ [MODO REUNIÓN] botón en TV
└─ Comunica con servidor

Opción 3 - Pantalla táctil:
├─ Gesto / Click en área especial
└─ Despierta control

DURANTE ROTACIÓN:
├─ Auto-scroll si hay más tarjetas (invisible)
├─ Actualización de datos cada 30 segundos
├─ Indicador al pie muestra: [■■□□] (1 de 4)
└─ Progreso de tiempo hasta siguiente pantalla

SALIR DEL MODO REUNIÓN:
├─ Presionar [ESC] en laptop
├─ O [SALIR] en control remoto
├─ O automático si pasa X minutos sin interacción
└─ Vuelve a rotación automática
```

---

## 🔄 SINCRONIZACIÓN COMPLETA

```
CUANDO TOGGLE ESTÁ ON, SE SINCRONIZA:

1. Cambios de OT:
   ├─ Nueva OT creada → aparece en TV
   ├─ Estado actualizado → tarjeta se mueve
   ├─ Asignación → operario actualizado
   └─ Prioridad cambiada → color actualizado

2. Stock/Repuestos:
   ├─ Nuevo repuesto agregado
   ├─ Stock reducido
   ├─ Stock crítico detectado
   └─ Alerta activada

3. KPIs (en tiempo real):
   ├─ Disponibilidad recalculada
   ├─ MTTR actualizado
   ├─ OT completadas (contador)
   └─ Tasa éxito cambia

4. Componentes (Taller):
   ├─ Cambio de estado
   ├─ Envío a proveedor
   ├─ Recepción
   └─ Nuevas instancias

5. Máquinas:
   ├─ Estado operativo
   ├─ Alertas
   ├─ Parada de emergencia
   └─ Fin de mantenimiento
```

---

## ⏰ TIMING DE ROTACIÓN

```
CICLO COMPLETO: 30 segundos

Pantalla 1: KPIs principales
├─ Mostrar: 5 segundos
└─ Transición: 1 segundo

Pantalla 2: Tarjetas pendientes
├─ Mostrar: 10 segundos
└─ Transición: 1 segundo

Pantalla 3: KPIs secundarios
├─ Mostrar: 5 segundos
└─ Transición: 1 segundo

Pantalla 4: Tarjetas en progreso
├─ Mostrar: 10 segundos
└─ Transición: 1 segundo
└─ VUELVE A PANTALLA 1

TOTAL: 30 segundos por ciclo completo
Por hora: 120 ciclos
Por jornada: 960 ciclos
```

### CONFIGURABLE:
```
⚙️ Opciones:
├─ Cambiar tiempo por pantalla
├─ Quitar/agregar pantallas
├─ Cambiar orden de rotación
├─ Pausar automática a ciertas horas
├─ Volumen de notificaciones
└─ Brillo/contraste adaptativo
```

---

## 📊 ACTUALIZACIONES EN TIEMPO REAL

```
DATOS VIVOS:
├─ KPIs se recalculan cada 30 seg
├─ Tarjetas se actualizan al cambiar estado
├─ WebSocket notifica cambios
├─ No necesita refrescar manual (F5)
├─ Mostrará alertas de cambios críticos
└─ Si hay crítico: alerta sonora + parpadeo

EJEMPLO:
- A las 14:35: Se rechaza una OT
- Pantalla TV es PLANIFICADA (pantalla 1 KPI)
- Recibe notificación de cambio
- Si está en pantalla 4 (en progreso): actualiza esa tarjeta
- Si está en pantalla 1: continúa con datos actualizados

CRÍTICOS QUE ALERTAN:
├─ 🔴 OT CRÍTICA hace >2 horas sin asignar
├─ 🔴 Stock crítico agotado
├─ 🔴 Parada no planificada de equipo
├─ 🔴 MTTR muy alto (ej: >3 horas)
└─ 🔴 Tasa de rechazo >20%
```

---

## 🎨 TRANSICIONES VISUALES

```
ENTRE PANTALLAS:
- Fade out (0.5s) pantalla actual
- Fade in (0.5s) nueva pantalla
- Suave, sin parpadeos
- Música/sonido ambiental bajo (opcional)

DENTRO DE UNA PANTALLA:
- Auto-scroll suave (si hay más tarjetas)
- Actualizaciones en vivo sin interrumpir
- Cambios de valores animados (números)

ANIMACIONES:
- Tarjetas con hover (al pasar mouse si es touchscreen)
- Pulse suave en números que cambian
- Indicador de progreso en barra
- Colores que respiran (animación sutil)
```

---

## 📺 RESOLUCIONES SOPORTADAS

```
Optimizado para:
├─ 4K (3840x2160) - Zoom 100%
├─ Full HD (1920x1080) - Zoom normal
├─ HD (1280x720) - Zoom 120%
└─ Tablets / Proyectores (variable)

Responsive:
├─ Letras grandes, legibles desde 3+ metros
├─ Colores con alto contraste
├─ Espaciado generoso
├─ Iconos grandes y claros
```

---

## 📋 CHECKLIST MODO TV

- [ ] Rotación automática 4 pantallas
- [ ] KPIs principales en tiempo real
- [ ] Tarjetas pendientes ordenadas
- [ ] KPIs secundarios análisis
- [ ] Tarjetas en progreso con barras
- [ ] Transiciones suaves
- [ ] Entrada a MODO REUNIÓN
- [ ] Actualizaciones live (WebSocket)
- [ ] Alertas críticas con sonido
- [ ] Responsive para TV
- [ ] Control remoto funcional
- [ ] Pantalla completa (fullscreen)

---

## 💾 DATOS NECESARIOS

```
Para cada pantalla, consultar en BD:
1. KPIs: Tablas historial + órdenes_trabajo
2. Tarjetas pendientes: ordenes_trabajo WHERE estado='ABIERTA'
3. KPIs secundarios: Análisis de historial
4. Tarjetas en progreso: ordenes_trabajo WHERE estado IN ('EN_EJECUCIÓN', 'EN_PROCESO')

WebSocket escucha:
├─ Cambios de estado de OT
├─ Nuevas OT creadas
├─ Asignaciones
├─ Cambios de prioridad
└─ Actualizaciones de stock
```

---

## 🎯 USO PRÁCTICO

```
ESCENARIO TÍPICO:

Lunes 08:00 AM - Reunión de inicio de turno:
├─ Supervisor accede a TV
├─ Presiona [MODO REUNIÓN]
├─ Equipo se reúne alrededor de TV
├─ Supervisor asigna OT arrastrando en Kanban
├─ Cambios se ven inmediatamente en TV
├─ Operarios reciben notificaciones en tablets
├─ Finalizada reunión: presionar [ESC]
├─ TV vuelve a rotación automática

Durante el turno:
├─ TV muestra KPIs continuamente
├─ Supervisores ven tarjetas pendientes
├─ Identifican retrasos/alertas
├─ Pueden entrar a MODO REUNIÓN si hay emergencia
├─ Operarios ven su progreso en Pantalla 4
└─ Motivación visual del equipo
```

---

EOF
cat /mnt/user-data/outputs/MODO_TV_ROTACION.md
