# 🎯 GMAO MVP - DEFINICIÓN FINAL COMPLETA

## ✅ TODAS LAS DECISIONES TOMADAS

### **Estructura Jerárquica**
```
PLANTA → ÁREA → LÍNEA → MÁQUINA → COMPONENTE
```

### **P1: ALCANCE**
✅ BÁSICO FUNCIONAL + KPIs + Introducción escalonada

### **P2: OPERARIOS**
✅ 4-8 operarios (MEDIO)

### **P3: EQUIPOS**
✅ 50-100 equipos (GRANDE)

### **P4: TECNOLOGÍA**
✅ React + Node.js + Supabase

### **P5: PLATAFORMAS**
✅ Responsive (PC/Tablet/Mobile) + Modo reunión en TV

### **P6: INTEGRACIONES**
✅ Supabase + Email (reportes diarios)

### **P7: TIMELINE**
✅ URGENTE: 2-4 semanas

### **P8: EQUIPO**
✅ UN SOLO DESARROLLADOR (full-stack)

### **P9: PROBLEMAS A RESOLVER**
✅ Preventivo + Desorganización + Costos + Registro + Diagnosis + Stock

### **P10: CARACTERÍSTICAS CRÍTICAS**
✅ TODAS (A+B+C+D+E+F)

---

## 🎨 ESTADOS DE ÓRDENES DE TRABAJO

```
1. Abierta (recién creada)
2. Planificada (asignada, esperando ejecución)
3. En Ejecución (operario trabajando - AUTOMÁTICO al abrir)
4. En proceso (estado intermedio)
5. Completada (operario terminó, esperando verificación)
6. Cerrada (supervisor verificó y aceptó)
7. Rechazada (supervisor dice que no está bien)
8. En Espera (pendiente de disponibilidad)
9. Pendiente de stock (falta repuesto)
10. Necesidad de parada (máquina debe parar)
11. Cancelada (se decide no hacerla)
```

---

## 🔐 ESTRUCTURA DE PERMISOS

✅ **FLEXIBLES (personalizables por usuario)**
- Cada usuario puede tener permisos diferentes
- Admin puede dar permisos específicos
- NO limitado a roles rígidos

---

## 📱 BÚSQUEDA JERÁRQUICA

✅ **AMBAS OPCIONES:**
- Árbol expandible (explorar)
- Dropdowns en cascada (seleccionar rápido)

---

## 🔔 NOTIFICACIONES

✅ Cuando asignan OT nueva
✅ FIN DE TURNO:
   - Opción A: Traspasar OT a otro usuario
   - Opción B: Dejar en pausa para mañana
✅ Cuando OT es rechazada
✅ Recordatorio de OT viejas sin completar
✅ Alertas de repuestos agotados
✅ Alertas de preventivos próximos

---

## 💾 TECNOLOGÍA

```
Frontend:   React.js
Backend:    Node.js + Express
Database:   Supabase (PostgreSQL)
Auth:       Supabase Auth
Email:      Sendgrid / Nodemailer
Hosting:    Vercel (frontend) + Railway/Render (backend)
```

---

## 📋 FUNCIONALIDADES MVP IMPRESCINDIBLES

### **1. GESTIÓN DE EQUIPOS**
- [ ] Crear estructura jerárquica (Área → Línea → Máquina → Componente)
- [ ] Árbol expandible + Dropdowns
- [ ] Datos técnicos de equipos
- [ ] Manuales/documentación adjunta
- [ ] Repuestos disponibles por componente
- [ ] Historial de reparaciones

### **2. GESTIÓN DE USUARIOS**
- [ ] Crear/Editar usuarios
- [ ] Permisos personalizables por usuario
- [ ] Asignar a áreas
- [ ] Autenticación (Supabase Auth)

### **3. ÓRDENES DE TRABAJO - CREAR**
- [ ] Selector jerárquico de equipo
- [ ] Tipo (Correctivo/Preventivo)
- [ ] Prioridad (Baja/Media/Alta/Crítica)
- [ ] Descripción
- [ ] Duración estimada
- [ ] Asignar a operario

### **4. ÓRDENES DE TRABAJO - ASIGNACIÓN**
- [ ] Ver órdenes disponibles
- [ ] Asignar a operario
- [ ] Cambiar asignación
- [ ] Notificación al asignado

### **5. ÓRDENES DE TRABAJO - EJECUCIÓN (OPERARIO)**
- [ ] Ver mis órdenes
- [ ] Iniciar OT (cambio automático a "En Ejecución")
- [ ] Registro de trabajo
- [ ] Seleccionar repuestos usados
- [ ] Notas técnicas
- [ ] Marcar completada

### **6. ÓRDENES DE TRABAJO - VERIFICACIÓN**
- [ ] Ver órdenes completadas
- [ ] Revisar detalles
- [ ] Aceptar/Rechazar
- [ ] Comentarios si rechaza

### **7. MODO DIAGNOSIS (CORRECTIVO INTELIGENTE)**
- [ ] Operario selecciona EFECTO (síntoma)
- [ ] Sistema busca en histórico
- [ ] Propone CAUSAS por repetitividad
- [ ] Propone SOLUCIONES
- [ ] Operario elige causa probable
- [ ] Sistema guía pasos a seguir
- [ ] APRENDE: cada corrección se registra

### **8. GESTIÓN DE REPUESTOS**
- [ ] Inventario: nombre, cantidad, ubicación, stock mín/máx
- [ ] Costo unitario
- [ ] Asignar repuestos a componentes
- [ ] Ver disponibles por equipo
- [ ] Alertas de bajo stock
- [ ] Tracking: qué se usó en qué OT
- [ ] Historial de consumo

### **9. MANTENIMIENTO PREVENTIVO**
- [ ] Crear planes preventivos (frecuencia)
- [ ] Asociar a equipo/componente
- [ ] Generar OT automáticas según calendario
- [ ] Ver próximos preventivos
- [ ] Basar frecuencia en MTBF histórico

### **10. KPIs Y ANÁLISIS**
- [ ] MTTR (Mean Time To Repair)
- [ ] MTBF (Mean Time Between Failures)
- [ ] Disponibilidad (%)
- [ ] Órdenes completadas (count)
- [ ] Costo total mantenimiento
- [ ] Costo por equipo
- [ ] Eficiencia operarios
- [ ] Tasa de éxito (no rechazos)
- [ ] Preventivo vs Correctivo (ratio)
- [ ] Repuestos más consumidos

### **11. FIN DE TURNO - GESTIÓN DE OT**
- [ ] Operario indica fin de turno
- [ ] Si hay OT en progreso:
  - [ ] Opción A: Traspasar a otro usuario
  - [ ] Opción B: Dejar en pausa
- [ ] Notificación a supervisor

### **12. REPORTES BÁSICOS**
- [ ] Por estado (cuántas abiertas, cerradas, etc)
- [ ] Por operario
- [ ] Por equipo
- [ ] Por período
- [ ] Repuestos consumidos
- [ ] Tiempo promedio ejecución
- [ ] Efectividad
- [ ] Exportar (CSV/PDF)

### **13. REPORTE DIARIO AUTOMÁTICO (EMAIL)**
- [ ] Operaciones del día
- [ ] KPIs resumen
- [ ] Envío automático diario

### **14. DASHBOARD POR ROL**
- [ ] ADMIN: Resumen general, alertas
- [ ] SUPERVISOR: OT por estado, asignaciones, KPIs
- [ ] OPERARIO: Mis órdenes del día

### **15. MODO REUNIÓN**
- [ ] Vista de todas las OT en TARJETAS
- [ ] Agrupadas por ESTADO
- [ ] Total trabajo pendiente
- [ ] KPIs visibles
- [ ] Accesible desde cualquier dispositivo → TV

### **16. BÚSQUEDA Y FILTROS**
- [ ] Buscar equipo por nombre/código
- [ ] Filtrar OT por estado
- [ ] Filtrar por operario
- [ ] Filtrar por área/línea
- [ ] Filtrar por tipo (correctivo/preventivo)
- [ ] Filtrar por período

### **17. AUDITORÍA BÁSICA**
- [ ] Quién creó cada OT
- [ ] Quién asignó
- [ ] Quién completó
- [ ] Fechas y horas
- [ ] Historial de cambios de estado

---

## 🎯 PRIORIDAD MVP (Debe tener vs Nice to have)

### **DEBE TENER (Fase 1 - Semanas 1-2):**
1. Login/Autenticación
2. Estructura equipos (Área → Línea → Máquina → Componente)
3. Crear/Asignar/Ejecutar OT
4. Estados básicos (Abierta, Planificada, En Ejecución, Completada, Cerrada)
5. Dashboard Supervisor (órdenes por estado)
6. Dashboard Operario (mis órdenes)
7. Histórico (registro de cambios)

### **IMPORTANTE (Fase 2 - Semanas 2-3):**
1. Modo Diagnosis
2. Gestión de repuestos básica
3. KPIs (MTTR, MTBF)
4. Notificaciones
5. Modo reunión

### **NICE TO HAVE (Post-MVP):**
1. Análisis predictivo avanzado
2. Mobile app nativa
3. Reportes avanzados
4. SCADA integration
5. Generador de preventivos automático

---

## 📅 ROADMAP 2-4 SEMANAS

```
SEMANA 1:
├─ Lunes: Setup proyecto + BD Supabase + Auth
├─ Martes-Miércoles: Crear estructura equipos (backend + frontend)
├─ Jueves: CRUD básico OT
└─ Viernes: Dashboards iniciales (Supervisor + Operario)

SEMANA 2:
├─ Lunes: Estados de OT + cambios automáticos
├─ Martes: Ejecución de OT (operario)
├─ Miércoles: Verificación (supervisor)
├─ Jueves: Histórico + auditoría
└─ Viernes: Testing + bugs críticos

SEMANA 3 (si tiempo permite):
├─ Lunes: Modo Diagnosis MVP
├─ Martes: Gestión repuestos básica
├─ Miércoles: KPIs iniciales
├─ Jueves: Notificaciones
└─ Viernes: Refinamientos

SEMANA 4 (si hay extra):
├─ Modo reunión
├─ Email reports
├─ Optimizaciones
└─ Deploy final
```

---

## 🚀 SIGUIENTE PASO

Una vez confirmes esto, haremos:

1. **Wireframes de cada pantalla**
2. **Flujo de usuario completo**
3. **Especificación técnica detallada**
4. **Empezar desarrollo**

¿Vamos con los wireframes? 👇

---

## ✅ ACTUALIZACIÓN - GESTIÓN DE REPUESTOS MEJORADA

### **8. GESTIÓN DE REPUESTOS - VERSIÓN FINAL**

```
FLUJO DE CREACIÓN/EDICIÓN DE REPUESTO:

1. CREAR NUEVO REPUESTO
   ├─ Nombre del repuesto
   ├─ Código/SKU
   ├─ Descripción
   ├─ Costo unitario
   ├─ Stock actual (cantidad en almacén)
   ├─ Stock mínimo (alerta si baja de esto)
   ├─ Stock máximo (recomendación de compra)
   ├─ Ubicación en almacén
   └─ Proveedor (nombre + contacto)

2. ASIGNAR A COMPONENTES
   El sistema PREGUNTA AUTOMÁTICAMENTE:
   ├─ "¿A qué componente(s) asignas este repuesto?"
   ├─ Búsqueda: Área → Línea → Máquina → Componente
   ├─ MÚLTIPLE SELECCIÓN (un repuesto → varios componentes)
   │  Ejemplo: "Aceite ISO 32" → [Bomba hidráulica, Compresor, Transmisión]
   └─ Guardar asignación

3. VER DISPONIBLES POR EQUIPO
   ├─ Al abrir equipo/componente:
   │  └─ Lista de repuestos disponibles
   │  └─ Stock actual
   │  └─ Stock mínimo
   │  └─ Si está bajo stock → ALERTA ROJA
   │
   └─ Poder desasignar repuesto si es error

ALERTAS DE BAJO STOCK:
├─ Cuando stock < stock mínimo
├─ Notificación a admin/supervisor
├─ En dashboard: indicador visual
├─ Sugerencia: "Comprar X más de este repuesto"

TRACKING - CADA OT REGISTRA:
├─ Qué repuestos se usaron
├─ Cuántos (cantidad consumida)
├─ Fecha de uso
├─ En qué OT
├─ Quién lo usó (operario)
├─ El stock se actualiza automáticamente
└─ Se puede ver historial de consumo

HISTORIAL DE CONSUMO:
├─ Por repuesto: últimas 30 OT donde se usó
├─ Tendencia: "Este mes se consumieron X unidades"
├─ Por equipo: "¿Cuánto aceite gasta el compresor?"
├─ Predictivo: "Si sigue así, stock se acabará en 10 días"
└─ Exportable (CSV/PDF)
```

---

### **TABLA: RELACIÓN REPUESTO ↔ COMPONENTE**

```
REPUESTO          | COMPONENTE(S) ASIGNADO(S)
─────────────────────────────────────────────────────
Aceite ISO 32     | Bomba hidráulica
                  | Compresor
                  | Transmisión

Filtro prensa     | Bomba hidráulica
                  | Compresor

Correa transmisión| Robot B - Eje principal
                  | CNC - Motor

Motor eléctrico   | Ventilador planta
                  | Compresor
```

---

### **INTERFAZ - CREAR REPUESTO**

```
┌─────────────────────────────────────────────────┐
│  NUEVO REPUESTO                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  Nombre: [Aceite ISO 32____________]            │
│  Código: [ACE-ISO-32________]                   │
│  Descripción: [Aceite hidráulico industrial]    │
│                                                  │
│  PRECIOS:                                        │
│  Costo unitario: [$12.50]                       │
│                                                  │
│  STOCK:                                          │
│  Stock actual: [45 unidades]                    │
│  Stock mínimo: [10] ⚠️ ALERTA si baja           │
│  Stock máximo: [100]                           │
│                                                  │
│  Ubicación almacén: [Estantería A-3]            │
│                                                  │
│  Proveedor: [Brenntag España]                   │
│  Contacto: [info@brenntag.es]                   │
│                                                  │
├─────────────────────────────────────────────────┤
│  ¿A QUÉ COMPONENTES ASIGNAS ESTE REPUESTO?     │
├─────────────────────────────────────────────────┤
│                                                  │
│  Búsqueda: [_________]  [🔍]                    │
│                                                  │
│  ☑ Producción > Línea A > CNC > Bomba hidráulica
│  ☑ Producción > Línea B > Robot > Compresor     
│  ☐ Utilidades > Horno > Motor eléctrico         
│  ☑ Utilidades > Compresor > Cilindro principal  
│                                                  │
│  Asignados: 3 componentes                       │
│                                                  │
├─────────────────────────────────────────────────┤
│  [CANCELAR]  [GUARDAR]                          │
└─────────────────────────────────────────────────┘
```

---

### **VISTA: COMPONENTE CON REPUESTOS DISPONIBLES**

```
┌─────────────────────────────────────────────────┐
│  BOMBA HIDRÁULICA (Línea A, CNC)               │
├─────────────────────────────────────────────────┤
│                                                  │
│  📋 DATOS TÉCNICOS                               │
│  Modelo: XYZ-2000                               │
│  Año: 2020                                       │
│  Última revisión: 15 Oct 2024                   │
│                                                  │
│  🛠️ REPUESTOS DISPONIBLES PARA ESTE COMPONENTE  │
│                                                  │
│  1. Aceite ISO 32                               │
│     Stock: 45 unidades ✅                       │
│     Stock mín: 10                               │
│     Ubicación: Estantería A-3                   │
│     Costo: $12.50/unidad                        │
│     Última compra: 5 unidades (15/11/2024)      │
│     [DETALLES]                                  │
│                                                  │
│  2. Filtro prensa                               │
│     Stock: 3 unidades ⚠️ BAJO                  │
│     Stock mín: 5                                │
│     Ubicación: Estantería B-1                   │
│     Costo: $45.00/unidad                        │
│     [COMPRAR AHORA]                             │
│                                                  │
│  3. Empaque sello                               │
│     Stock: 0 unidades ❌ AGOTADO                │
│     Stock mín: 2                                │
│     [ORDENAR URGENTE]                           │
│                                                  │
│  [DESASIGNAR REPUESTO]                          │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

### **TRACKING - HISTORIAL DE CONSUMO**

```
┌─────────────────────────────────────────────────┐
│  HISTORIAL CONSUMO: ACEITE ISO 32              │
├─────────────────────────────────────────────────┤
│                                                  │
│  ÚLTIMAS 30 OT DONDE SE USÓ:                   │
│                                                  │
│  Fecha       │ OT      │ Máquina     │ Unidades │
│  ────────────┼─────────┼─────────────┼──────────│
│  15/11/2024  │ OT-4521 │ CNC Línea A │    2    │
│  14/11/2024  │ OT-4515 │ Compresor   │    3    │
│  13/11/2024  │ OT-4510 │ Bomba hid.  │    1    │
│  ...         │ ...     │ ...         │   ...   │
│                                                  │
│  RESUMEN:                                       │
│  Total consumido este mes: 45 unidades         │
│  Promedio semanal: 11 unidades                  │
│  Tendencia: ESTABLE ↔️                         │
│  Predicción: Stock se acabará en ~4 semanas     │
│                                                  │
│  [EXPORTAR CSV]  [EXPORTAR PDF]                │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

### **ALERTAS DE BAJO STOCK (EN DASHBOARD)**

```
┌──────────────────────────────────────────┐
│  ⚠️ ALERTAS DE STOCK                     │
├──────────────────────────────────────────┤
│                                          │
│  🔴 CRÍTICO (stock = 0):                │
│  • Empaque sello → 0 unidades            │
│    [COMPRAR URGENTE]                     │
│                                          │
│  🟠 BAJO (stock < mín):                 │
│  • Filtro prensa → 3 unidades (mín: 5)  │
│    [HACER PEDIDO]                        │
│                                          │
│  • Rodillo transporte → 2 un (mín: 3)   │
│    [HACER PEDIDO]                        │
│                                          │
│  🟡 PRÓXIMO A AGOTARSE (7 días):        │
│  • Aceite ISO 32 → 45 un (consumo: 11/sem)
│    [REVISAR]                             │
│                                          │
└──────────────────────────────────────────┘
```

---

## 📋 CHECKLIST FUNCIONALIDAD REPUESTOS

- [ ] CRUD repuestos (crear, editar, eliminar)
- [ ] Pregunta automática al crear: "¿A qué componentes?"
- [ ] Múltiple selección (1 repuesto → N componentes)
- [ ] Búsqueda jerárquica de componentes
- [ ] Ver repuestos por componente
- [ ] Alertas de bajo stock
- [ ] Tracking en cada OT (qué repuestos se usaron)
- [ ] Stock se actualiza automáticamente
- [ ] Historial de consumo (últimas 30 OT)
- [ ] Análisis: consumo promedio, tendencias
- [ ] Predicción: cuándo se acabará el stock
- [ ] Exportable (CSV/PDF)

---


---

## ✅ NUEVO MÓDULO - GESTIÓN DE TALLER (COMPONENTES REEMPLAZABLES)

### **CONCEPTO GENERAL:**

```
COMPONENTE REEMPLAZABLE (diferente a REPUESTO):
- Componente entero (motor, bomba, válvula, etc.)
- Se extrae y reemplaza completamente
- Puede repararse internamente en taller
- O enviarse a proveedor externo
- Mientras está fuera, máquina tiene uno de respuesto/temporal
- Tiene stock propio (diferentes unidades físicas)

EJEMPLO:
Máquina: CNC Línea A
├─ Componente: Motor principal (código: MTR-CNC-001)
│  ├─ Stock físico: 2 unidades
│  │  ├─ MTR-CNC-001-01: EN USO (en CNC)
│  │  └─ MTR-CNC-001-02: DISPONIBLE (en almacén)
│  │
│  └─ Estado de cada unidad:
│     ├─ Disponible (listo para usar)
│     ├─ En uso (montado en máquina)
│     ├─ En mantenimiento interno (en taller)
│     ├─ En reparación externa (con proveedor A)
│     ├─ En cuarentena (defecto encontrado)
│     └─ Descartado (fin de vida)
```

---

## 📋 FUNCIONALIDADES GESTIÓN DE TALLER

### **1. CREAR COMPONENTE REEMPLAZABLE**

```
FLUJO:
1. Admin accede a: Equipos → [Máquina] → Componentes → [Crear componente reemplazable]

2. Formulario:
   ├─ Nombre: [Motor principal]
   ├─ Código: [MTR-CNC-001]
   ├─ Tipo: [Reemplazable] (diferente a "repuesto")
   ├─ Descripción técnica
   ├─ Costo unitario: [$5,000]
   ├─ Proveedor de reposición: [Siemens]
   ├─ Tiempo de reposición: [2 semanas]
   ├─ ¿Hay stock disponible en almacén?
   │  └─ Sí → [Crear instancias]
   │  └─ No → [Crear solo definición]
   └─ Repuestos internos necesarios para reparar:
      ├─ ☑ Bobina principal (repuesto MTR-BOBINA-01)
      ├─ ☑ Rodamiento (repuesto MTR-ROD-05)
      └─ ☑ Aceite ISO 32

3. Si hay stock: ¿Cuántas unidades?
   └─ [2 unidades]
   
4. Sistema crea registro:
   ├─ MTR-CNC-001-01 → DISPONIBLE
   ├─ MTR-CNC-001-02 → DISPONIBLE
   └─ Ambas pueden ser asignadas a máquinas
```

---

### **2. ASIGNAR COMPONENTE A MÁQUINA**

```
FLUJO:
1. Supervisor crea OT: "Cambiar motor CNC"

2. En OT: "Usar componente de respuesto"
   ├─ Máquina: CNC Línea A
   ├─ Componente a cambiar: Motor principal (MTR-CNC-001)
   └─ ¿Qué unidad hay disponible?
      └─ Sistema muestra: MTR-CNC-001-02 → DISPONIBLE
      
3. Operario realiza cambio físico:
   ├─ Extrae: MTR-CNC-001-01 (la que estaba en uso)
   ├─ Guarda: MTR-CNC-001-01 (ahora sin usar)
   └─ Instala: MTR-CNC-001-02 (nuevo en uso)

4. Sistema registra cambio:
   ├─ MTR-CNC-001-01:
   │  ├─ Estado: EN MANTENIMIENTO INTERNO
   │  ├─ Destino: Taller
   │  └─ OT asociada: OT-5234
   │
   └─ MTR-CNC-001-02:
      ├─ Estado: EN USO
      ├─ Ubicación: CNC Línea A
      └─ OT asociada: OT-5234
```

---

### **3. ESTADOS DE COMPONENTES REEMPLAZABLES**

```
🟢 DISPONIBLE
   └─ Listo para usar, en almacén

🔵 EN USO
   └─ Montado en máquina
   └─ Identifica qué máquina
   └─ Desde cuándo

🟠 EN MANTENIMIENTO INTERNO
   └─ En taller siendo reparado
   └─ Qué se está reparando
   └─ Operario asignado
   └─ Fecha de inicio
   └─ OT asociada
   └─ Repuestos que necesita

🟣 EN REPARACIÓN EXTERNA
   └─ Con proveedor externo
   └─ Cuál proveedor
   └─ Fecha envío
   └─ Contacto proveedor
   └─ Referencia de envío
   └─ Costo estimado reparación
   └─ ETA de retorno

🟡 EN CUARENTENA
   └─ Defecto encontrado
   └─ Descripción del defecto
   └─ Pendiente de decisión (reparar/descartar)

⚫ DESCARTADO
   └─ Fin de vida
   └─ Razón (rotura, corrosión, etc.)
   └─ Fecha de baja
```

---

### **4. MANTENIMIENTO INTERNO (EN TALLER)**

```
FLUJO:

1. Componente llega al taller (MTR-CNC-001-01)
   ├─ Estado: EN MANTENIMIENTO INTERNO
   ├─ Sistema sugiere: "Repuestos necesarios para reparar motor:"
   │  ├─ ☑ Bobina principal (stock: 3)
   │  ├─ ☑ Rodamiento (stock: 1)
   │  └─ ☑ Aceite ISO 32 (stock: 45)
   └─ Sistema verifica disponibilidad

2. Si algún repuesto no está disponible:
   └─ Alerta: "Esperar disponibilidad de [repuesto]"
   └─ Componente pasa a "EN ESPERA - STOCK"

3. Supervisor/Operario crea OT INTERNA: "Reparar motor MTR-CNC-001-01"
   ├─ Tipo: Mantenimiento preventivo interno
   ├─ Componente: MTR-CNC-001-01
   ├─ Repuestos necesarios (pre-llenados):
   │  ├─ Bobina principal x1
   │  ├─ Rodamiento x1
   │  └─ Aceite ISO 32 x0.5L
   ├─ Duración estimada: 8 horas
   └─ Asignar a operario especialista

4. Operario ejecuta reparación:
   ├─ Marca OT como "En ejecución"
   ├─ Retira repuestos del stock
   ├─ Realiza reparación
   ├─ Documenta con fotos
   ├─ Marca como "Completada"
   └─ Stock se actualiza automáticamente

5. Supervisor verifica:
   ├─ Revisa calidad de reparación
   ├─ Aprueba: "✓ REPARADO - LISTO PARA USO"
   └─ Componente pasa a: DISPONIBLE
```

---

### **5. REPARACIÓN EXTERNA (CON PROVEEDOR)**

```
FLUJO:

1. Componente en taller, necesita reparación externa
   └─ Razón: "Requiere especialista de fabricante"

2. Supervisor marca: "Enviar a reparación externa"
   ├─ Componente: MTR-CNC-001-01
   ├─ Proveedor: [Dropdown - Siemens]
   ├─ Contacto proveedor: [info@siemens.es]
   ├─ Teléfono: [+34 91 234 5678]
   ├─ Costo estimado reparación: [$2,500]
   ├─ Tiempo estimado: [2 semanas]
   ├─ Condiciones especiales: [...]
   ├─ Responsable envío: [Nombre operario]
   └─ Adjuntar documentación:
      ├─ Fotos del componente
      ├─ Reporte del problema
      └─ Especificaciones técnicas

3. Sistema registra:
   ├─ Estado: EN REPARACIÓN EXTERNA - [PROVEEDOR A]
   ├─ Fecha envío: [hoy]
   ├─ Referencia de envío: [Albarán XXX]
   ├─ ETA retorno: [fecha calculada]
   └─ OT interna de seguimiento

4. Proveedor envía componente de vuelta:
   ├─ Recibe referencia: [ALBARÁN XXX]
   └─ Adjunta factura + reporte de reparación

5. Entrada de componente:
   ├─ Admin registra: "Recibir componente reparado"
   ├─ Verifica:
   │  ├─ Estado físico
   │  ├─ Referencia coincide
   │  ├─ Documentación completa
   │  └─ Factura correcta
   ├─ Cambia estado: EN REPARACIÓN EXTERNA → DISPONIBLE
   └─ Stock se actualiza
   
6. Sistema registra:
   ├─ Costo real reparación (de factura)
   ├─ Proveedor que realizó
   ├─ Tiempo total reparación
   ├─ Reporte de qué se arregló
   └─ Todo en histórico del componente
```

---

### **6. VISTA DE COMPONENTE REEMPLAZABLE - DETALLE COMPLETO**

```
┌──────────────────────────────────────────────────────┐
│  COMPONENTE: Motor principal (MTR-CNC-001)          │
│  Máquina: CNC Línea A - Producción                  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  INFORMACIÓN TÉCNICA:                                │
│  ├─ Fabricante: Siemens                             │
│  ├─ Modelo: S200-D                                  │
│  ├─ Año compra: 2020                                │
│  ├─ Costo unitario: $5,000                          │
│  ├─ Vida útil estimada: 10 años                     │
│  └─ Garantía: Sin (vencida)                         │
│                                                      │
│  STOCK DE UNIDADES:                                  │
│  ┌────────────────────────────────────────────────┐ │
│  │ MTR-CNC-001-01:                                │ │
│  │ Estado: EN MANTENIMIENTO INTERNO               │ │
│  │ Desde: 10/11/2024                              │ │
│  │ Ubicación: Taller                              │ │
│  │ Operario: Juan García                          │ │
│  │ OT asociada: OT-5234                           │ │
│  │ Repuestos usados: Bobina, Rodamiento           │ │
│  │ Progreso: 60% completada                       │ │
│  │ ETA finalización: 18/11/2024                   │ │
│  │ [VER DETALLE OT]                               │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ MTR-CNC-001-02:                                │ │
│  │ Estado: EN USO                                 │ │
│  │ Desde: 10/11/2024                              │ │
│  │ Ubicación: CNC Línea A                         │ │
│  │ Horas en uso: 156 horas                        │ │
│  │ Próximo mantenimiento: 18/12/2024              │ │
│  │ [PLAN. MANTENIMIENTO]                          │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ACCIONES:                                           │
│  [CAMBIAR A MANTENIMIENTO]  [ENVIAR EXTERNO]        │
│  [VER HISTÓRICO]  [VER COSTOS]                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### **7. HISTÓRICO COMPLETO DE COMPONENTE**

```
┌──────────────────────────────────────────────────────┐
│  HISTÓRICO: MTR-CNC-001-01                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  EVENTO                    │ FECHA       │ ESTADO   │
│  ───────────────────────────┼─────────────┼──────────│
│  Compra a Siemens           │ 15/05/2020  │ NUEVO   │
│  Instalación en CNC         │20/05/2020   │ EN USO  │
│  Mantenimiento preventivo    │ 10/05/2021  │ INT.    │
│  Cambio a respuesto temp     │ 05/11/2024  │ MANUTENCIÓN │
│ (se instaló MTR-CNC-001-02)  │             │         │
│  Envío a reparación Siemens  │ 08/11/2024  │ EXT.    │
│  Recibido de Siemens         │ 12/11/2024  │ DISP.   │
│  Instalación en CNC          │ 13/11/2024  │ EN USO  │
│  ... (continúa)              │ ...         │ ...     │
│                                                      │
│  COSTOS ACUMULADOS:                                  │
│  Compra: $5,000                                      │
│  Reparación 1 (2021): $250                          │
│  Reparación 2 (2024): $2,500                        │
│  Total invertido: $7,750                            │
│                                                      │
│  RECOMENDACIONES DEL SISTEMA:                        │
│  ⚠️ Componente ha sido reparado 2 veces en 4 años   │
│  💡 Si próxima reparación supera $3,000 → Evaluar  │
│     reemplazo (costo total + 4 años más de uso)    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### **8. VISTA DASHBOARD - COMPONENTES REEMPLAZABLES**

```
┌──────────────────────────────────────────────────────┐
│  📦 GESTIÓN DE COMPONENTES REEMPLAZABLES           │
├──────────────────────────────────────────────────────┤
│                                                      │
│  RESUMEN GENERAL:                                    │
│  ├─ Total componentes tipos: 12                      │
│  ├─ Total unidades en stock: 18                      │
│  ├─ En uso: 12                                       │
│  ├─ En mantenimiento interno: 2                      │
│  ├─ En reparación externa: 1                         │
│  └─ Disponibles: 3                                   │
│                                                      │
│  🔴 CRÍTICO - ACCIONES NECESARIAS:                 │
│  1. MTR-CNC-001-01 en ext. desde 8/11 (4 días)     │
│     Proveedor: Siemens | ETA: 15/11                │
│     [CONTACTAR PROVEEDOR]                           │
│                                                      │
│  🟡 EN PROCESO - REVISAR:                          │
│  1. BOM-LIN-A-01 en taller (60% reparación)        │
│     Operario: Juan García | ETA: 18/11             │
│     [VER PROGRESO]                                  │
│                                                      │
│  🟢 PRÓXIMOS A MANTENER:                           │
│  1. MTR-CNC-001-02 en uso: 156h (próx 18/12)       │
│  2. ROB-B-01 en uso: 234h (próx 25/11)             │
│                                                      │
│  [VER TODOS]  [CREAR COMPONENTE]                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### **9. FLUJO DE OT PARA CAMBIO DE COMPONENTE**

```
NUEVA OPCIÓN EN CREAR OT:

┌─────────────────────────────────────────────┐
│ CREAR ORDEN DE TRABAJO                      │
├─────────────────────────────────────────────┤
│                                             │
│ Tipo de OT:                                 │
│ ☑ Mantenimiento correctivo                 │
│ ☐ Mantenimiento preventivo                 │
│                                             │
│ ¿Requiere cambio de componente?             │
│ ☐ No, solo ajustes/reparación              │
│ ☑ Sí, cambiar componente completo          │
│                                             │
│ Si "Sí":                                    │
│   Componente a cambiar: [MTR-CNC-001 ▼]    │
│                                             │
│   ¿Con qué lo cambias?:                     │
│   ☑ Componente de respuesto                │
│     └─ Disponible: MTR-CNC-001-02          │
│   ☐ Componente nuevo                       │
│   ☐ Enviar a reparación externa            │
│                                             │
│   Si respuesto:                             │
│   ├─ ¿Qué pasa con el componente usado?    │
│   │  ☑ Mantenimiento interno (taller)      │
│   │  ☐ Reparación externa                  │
│   │  ☐ Descarte                            │
│   │                                         │
│   └─ Si mantenimiento interno:             │
│      [Crear OT interna automáticamente]    │
│      └─ Para reparar MTR-CNC-001-01        │
│                                             │
│ [CREAR OT]                                  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📋 CHECKLIST - GESTIÓN DE TALLER

### **CREAR/GESTIONAR COMPONENTES REEMPLAZABLES**
- [ ] Crear tipo de componente reemplazable
- [ ] Definir repuestos internos necesarios
- [ ] Crear instancias (unidades físicas)
- [ ] Asignar código único a cada unidad
- [ ] Definir proveedor de reposición

### **ESTADO Y SEGUIMIENTO**
- [ ] 6+ estados de componentes
- [ ] Cambios automáticos según OT
- [ ] Histórico completo de cambios
- [ ] Auditoría (quién, cuándo, qué)

### **MANTENIMIENTO INTERNO**
- [ ] Crear OT interna automáticamente
- [ ] Sugerir repuestos necesarios
- [ ] Verificar disponibilidad
- [ ] Registrar progreso
- [ ] Documentar con fotos
- [ ] Marcar como reparado
- [ ] Cambiar a DISPONIBLE

### **REPARACIÓN EXTERNA**
- [ ] Seleccionar proveedor
- [ ] Registrar datos envío
- [ ] Calcular ETA retorno
- [ ] Registrar costo estimado
- [ ] Recepcionar cuando retorna
- [ ] Registrar costo real
- [ ] Cambiar a DISPONIBLE

### **REPORTES Y ANÁLISIS**
- [ ] Histórico completo por componente
- [ ] Costo total invertido
- [ ] Recomendaciones (reparar vs reemplazar)
- [ ] Tendencias de fallos
- [ ] ROI por componente

---

## 💾 TABLAS BD NECESARIAS

```sql
-- Componentes reemplazables (definición)
CREATE TABLE componentes_reemplazables (
    id UUID PRIMARY KEY,
    nombre VARCHAR(100),
    codigo VARCHAR(50) UNIQUE,
    maquina_id UUID REFERENCES maquinas(id),
    fabricante VARCHAR(100),
    modelo VARCHAR(100),
    costo_unitario DECIMAL(10,2),
    proveedor_reposicion VARCHAR(100),
    tiempo_reposicion INT, -- días
    descripcion TEXT,
    created_at TIMESTAMP
);

-- Instancias (unidades físicas de componentes)
CREATE TABLE instancias_componentes (
    id UUID PRIMARY KEY,
    componente_id UUID REFERENCES componentes_reemplazables(id),
    numero_serie VARCHAR(100) UNIQUE,
    codigo_unico VARCHAR(100), -- MTR-CNC-001-01
    estado ENUM('DISPONIBLE', 'EN_USO', 'MANTENIMIENTO_INTERNO', 
                'REPARACION_EXTERNA', 'CUARENTENA', 'DESCARTADO'),
    ubicacion VARCHAR(100),
    fecha_creacion TIMESTAMP,
    created_at TIMESTAMP
);

-- Historial de cambios de estado
CREATE TABLE historial_componentes (
    id UUID PRIMARY KEY,
    instancia_id UUID REFERENCES instancias_componentes(id),
    estado_anterior ENUM(...),
    estado_nuevo ENUM(...),
    razon TEXT,
    ot_id UUID REFERENCES ordenes_trabajo(id),
    usuario_id UUID REFERENCES usuarios(id),
    fecha TIMESTAMP
);

-- Reparaciones externas
CREATE TABLE reparaciones_externas (
    id UUID PRIMARY KEY,
    instancia_id UUID REFERENCES instancias_componentes(id),
    proveedor VARCHAR(100),
    fecha_envio DATE,
    referencia_envio VARCHAR(100),
    costo_estimado DECIMAL(10,2),
    costo_real DECIMAL(10,2),
    eta_retorno DATE,
    fecha_recepcion DATE,
    reporte_proveedor TEXT,
    created_at TIMESTAMP
);
```

---


---

## ✅ NUEVO MÓDULO - MODO REUNIÓN (KANBAN INTERACTIVO)

### **CONCEPTO GENERAL:**

```
MODO REUNIÓN = Vista colaborativa tipo Kanban/Canvas
├─ Tarjetas de órdenes de trabajo
├─ Columnas por ESTADO
├─ Drag-and-drop interactivo
├─ Cambios en TIEMPO REAL
├─ Se refleja automáticamente en todas las pantallas
├─ Ideal para proyector/TV en planta
└─ Accesible desde cualquier dispositivo
```

---

## 🎨 INTERFAZ MODO REUNIÓN - KANBAN BOARD

### **VISTA GENERAL:**

```
┌────────────────────────────────────────────────────────────────────────┐
│  MODO REUNIÓN - TABLERO DE ÓRDENES DE TRABAJO                         │
│  [← Volver] [Actualizar] [Filtrar ▼] [Zoom ▼] [⚙️ Opciones]           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ 📋        │ 🔵       │ ▶️       │ ✅      │ ⏳       │ ❌      │ 🚫   │
│ ABIERTA   │PLANIFICADA│EN EJECUCIÓN│COMPLETADA│EN ESPERA│RECHAZADA│CANCELADA
│ (5)       │ (8)      │ (3)     │ (4)    │ (2)     │ (1)    │ (0)   │
│           │          │         │        │         │        │       │
│ ┌────┐    │ ┌────┐   │┌────┐   │┌────┐  │┌────┐   │┌────┐  │       │
│ │OT- │    │ │OT- │   ││OT- │   ││OT- │  ││OT- │   ││OT- │  │       │
│ │4501│    │ │4502│   ││4503│   ││4504│  ││4505│   ││4510│  │       │
│ │    │    │ │    │   ││    │   ││    │  ││    │   ││    │  │       │
│ │CNC │    │ │BOB │   ││COM │   ││FIL │  ││ECT │   ││MAQ │  │       │
│ │    │    │ │    │   ││    │   ││    │  ││    │   ││    │  │       │
│ │P:MA│    │ │P:AL│   ││P:CR│   ││P:BA│  ││P:ME│   ││P:AL│  │       │
│ │    │    │ │    │   ││    │   ││    │  ││    │   ││    │  │       │
│ └────┘    │ └────┘   │└────┘   │└────┘  │└────┘   │└────┘  │       │
│           │          │         │        │         │        │       │
│ ┌────┐    │ ┌────┐   │        │┌────┐  │        │        │       │
│ │OT- │    │ │OT- │   │        ││OT- │  │        │        │       │
│ │4511│    │ │4512│   │        ││4505│  │        │        │       │
│ │    │    │ │    │   │        ││    │  │        │        │       │
│ │LIN │    │ │ROB │   │        ││VAL │  │        │        │       │
│ │    │    │ │    │   │        ││    │  │        │        │       │
│ │P:BA│    │ │P:AL│   │        ││P:AL│  │        │        │       │
│ │    │    │ │    │   │        ││    │  │        │        │       │
│ └────┘    │ └────┘   │        │└────┘  │        │        │       │
│           │          │         │        │         │        │       │
│ ┌────┐    │ ┌────┐   │        │        │        │        │       │
│ │OT- │    │ │OT- │   │        │        │        │        │       │
│ │4513│    │ │4514│   │        │        │        │        │       │
│ │    │    │ │    │   │        │        │        │        │       │
│ │TRB │    │ │COM │   │        │        │        │        │       │
│ │    │    │ │    │   │        │        │        │        │       │
│ │P:ME│    │ │P:CR│   │        │        │        │        │       │
│ │    │    │ │    │   │        │        │        │        │       │
│ └────┘    │ └────┘   │        │        │        │        │       │
│           │          │         │        │         │        │       │
│           │ ┌────┐   │        │        │        │        │       │
│           │ │OT- │   │        │        │        │        │       │
│           │ │4515│   │        │        │        │        │       │
│           │ │    │   │        │        │        │        │       │
│           │ │CON │   │        │        │        │        │       │
│           │ │    │   │        │        │        │        │       │
│           │ │P:BA│   │        │        │        │        │       │
│           │ │    │   │        │        │        │        │       │
│           │ └────┘   │        │        │        │        │       │
│           │          │         │        │         │        │       │
└────────────────────────────────────────────────────────────────────────┘

LEYENDA TARJETA:
OT-XXXX = Número de orden
MÁQUINA = Primera 3 letras de máquina (CNC, BOB, COM, etc)
P:XX = Prioridad (CR=Crítica, AL=Alta, ME=Media, BA=Baja)
```

---

### **DETALLES TARJETA KANBAN:**

```
┌─────────────────────────────────────┐
│ OT-4503                    🔧 ▼    │ ← Título + menú
│─────────────────────────────────────│
│ CNC Línea A - Motor                 │ ← Máquina
│─────────────────────────────────────│
│ Cambiar rodamiento                  │ ← Descripción breve
│─────────────────────────────────────│
│ 🎯 ALTA  |  ⏱️ 2h  |  👤 Juan     │ ← Prioridad, duración, asignado
│─────────────────────────────────────│
│ [Hace 45 min]  ↴ [Desasignar]      │ ← Tiempo desde creación + acciones
└─────────────────────────────────────┘

INTERACTIVIDAD:
- Hover: Mostrar más detalles
- Click: Abrir detalle completo
- Drag: Mover a otro estado
- Menú ▼: Opciones rápidas (editar, asignar, etc)
```

---

### **ACCIONES CON DRAG-AND-DROP:**

```
1. CAMBIAR DE COLUMNA (estado):
   Arrastrar tarjeta de "ABIERTA" → "PLANIFICADA"
   └─ Sistema actualiza estado automáticamente
   └─ Notificación al operario asignado (si la hay)
   └─ Se refleja en tiempo real en todas las pantallas

2. ASIGNAR OPERARIO:
   Arrastrar tarjeta a columna con nombre de operario
   └─ "ABIERTA" → Zona de "JUAN"
   └─ Sistema asigna la OT a Juan
   └─ Juan recibe notificación inmediata
   └─ OT aparece en su panel de "Mis órdenes"

3. CAMBIAR PRIORIDAD:
   Right-click en tarjeta → "Cambiar prioridad"
   └─ Tarjeta cambia de color según prioridad
   └─ Se reordena en columna (críticas arriba)

4. CAMBIAR OPERARIO:
   Seleccionar OT y cambiar asignado
   └─ Si pasaba de JUAN → PEDRO
   └─ Notificación a ambos
   └─ Desaparece de panel de JUAN
   └─ Aparece en panel de PEDRO
```

---

### **SINCRONIZACIÓN EN TIEMPO REAL:**

```
CUANDO OCURRE UN CAMBIO EN MODO REUNIÓN:

Ejemplo: Admin arrastra OT-4503 a columna "PLANIFICADA" y la asigna a "JUAN"

1. EN MODO REUNIÓN (donde está Admin):
   ├─ Tarjeta se mueve de ABIERTA a PLANIFICADA
   ├─ Tarjeta ahora tiene icono con nombre "JUAN"
   ├─ Cambio visual inmediato
   └─ Se envía actualización al servidor

2. EN PANEL DE JUAN (si está conectado):
   ├─ OT-4503 aparece en su lista "Mis órdenes"
   ├─ Color de prioridad visible
   ├─ NOTIFICACIÓN: "Nueva orden asignada: OT-4503"
   ├─ Puede verlo en su tablet/PC
   └─ Si está en otra pantalla, no se interrumpe

3. EN DASHBOARD SUPERVISOR:
   ├─ OT-4503 aparece asignada a JUAN
   ├─ Cambio de columna reflejado
   ├─ Estadísticas actualizadas
   └─ Si está viendo ese panel, ve el cambio en tiempo real

4. EN BD (Supabase):
   ├─ Estado actualizado: "PLANIFICADA"
   ├─ Asignado_a: "juan_id"
   ├─ Timestamp registrado
   ├─ Histórico guardado
   └─ Todo auditable

TECNOLOGÍA: WebSocket (Socket.io) para sincronización real-time
```

---

### **FILTROS EN MODO REUNIÓN:**

```
[Filtrar ▼] → Opciones:

☑ Mostrar todas las OT
☐ Solo CRÍTICA
☐ Solo ALTA
☐ Solo MEDIA
☐ Solo BAJA

☑ Mostrar todos los operarios
☐ Solo asignadas
☐ Solo sin asignar

☑ Mostrar todas las áreas
☐ Solo Producción
☐ Solo Contra Incendios
☐ Solo Utilidades
☐ Solo Seguridad

☑ Mostrar todos los tipos
☐ Solo Preventivas
☐ Solo Correctivas

Resultado: Tablero se actualiza dinámicamente (filtra tarjetas)
```

---

### **ZOOM Y VISUALIZACIÓN:**

```
[Zoom ▼] → Opciones:

📊 Pequeño (100%)
   └─ Ver más tarjetas simultáneamente
   └─ Ideal para TV/Proyector grande
   └─ Menos detalles por tarjeta

📋 Normal (150%)
   └─ Equilibrio
   └─ Buen contraste
   └─ Detalles legibles

🔍 Grande (200%)
   └─ Pocos detalles, tarjetas grandes
   └─ Para TV pequeña
   └─ Scrollable horizontal
```

---

### **OPCIONES AVANZADAS (⚙️):**

```
⚙️ Opciones:

Display:
  ☑ Mostrar tiempo desde creación
  ☑ Mostrar prioridad (color)
  ☑ Mostrar asignado (nombre/avatar)
  ☑ Mostrar duración estimada
  ☐ Mostrar fecha de vencimiento

Actualizaciones:
  ☑ Actualizar automáticamente cada 5 seg
  ☐ Actualizaciones manuales
  ☑ Sonido en cambios
  ☐ Sin notificaciones de cambios

Historial:
  ☐ Mostrar OT completadas
  ☑ Solo mostrar pendientes

Exportar:
  [Exportar como PDF]
  [Exportar como imagen PNG]
  [Imprimir vista actual]
```

---

### **TARJETAS ESPECIALES - ESTADOS COMPLEJOS:**

```
TARJETA CON MÚLTIPLES NOTIFICACIONES:

┌─────────────────────────────────────┐
│ OT-4512                    🔧 ▼    │
│─────────────────────────────────────│
│ Robot B - Mantenimiento             │
│─────────────────────────────────────│
│ Revisar velocidad                   │
│─────────────────────────────────────│
│ 🎯 ALTA  |  ⏱️ 1h30m  |  👤 Pedro  │
│─────────────────────────────────────│
│ ⏳ En proceso 2h 15min              │ ← Ya pasó tiempo estimado
│ ⚠️  STOCK BAJO: Aceite ISO 32      │ ← Alerta de repuesto
│ 📌 PAUSADA por falta stock          │ ← Estado especial
│─────────────────────────────────────│
│ [Reponer stock] [Reanudar] [Más]   │ ← Acciones contextuales
└─────────────────────────────────────┘

TARJETA CON CAMBIO DE COMPONENTE:

┌─────────────────────────────────────┐
│ OT-4503                    🔧 ▼    │
│─────────────────────────────────────│
│ CNC Línea A - Motor                 │
│─────────────────────────────────────│
│ Cambiar motor (reparación ext)      │
│─────────────────────────────────────│
│ 🎯 CRÍTICA  |  ⏱️ 4h  |  👤 Juan   │
│─────────────────────────────────────│
│ 📦 Componente: MTR-CNC-001-01       │ ← Componente reemplazable
│ 🔧 Estado: REPARACIÓN EXTERNA      │ ← En taller externo
│ 🏢 Proveedor: Siemens              │ ← Con quién
│ 📅 Retorno est: 18/11 (3 días)     │ ← ETA
│─────────────────────────────────────│
│ [Ver historial] [Contactar prov.]   │
└─────────────────────────────────────┘
```

---

### **VISTA OPERARIO - REFLEJAR CAMBIOS:**

```
Si en MODO REUNIÓN se asigna OT a JUAN:

TABLET/PC DE JUAN (antes):
┌──────────────────────────┐
│ MIS ÓRDENES              │
├──────────────────────────┤
│ Total: 0 órdenes         │
│                          │
│ [Esperando asignación]   │
└──────────────────────────┘

DESPUÉS (en tiempo real):
┌──────────────────────────┐
│ MIS ÓRDENES              │
├──────────────────────────┤
│ Total: 1 orden           │
│                          │
│ 🆕 OT-4503               │
│ CNC Línea A              │
│ Cambiar rodamiento       │
│ 🎯 ALTA | ⏱️ 2h          │
│ [INICIAR]                │
│                          │
│ 🔔 NOTIFICACIÓN:         │
│ "Nueva orden asignada"   │
└──────────────────────────┘
```

---

### **VISTA SUPERVISOR - REFLEJAR CAMBIOS:**

```
Si en MODO REUNIÓN se cambia estado OT-4503 de ABIERTA → PLANIFICADA:

DASHBOARD SUPERVISOR (antes):
ABIERTA: 5 órdenes
PLANIFICADA: 8 órdenes

DESPUÉS (instantáneo):
ABIERTA: 4 órdenes (se redujo)
PLANIFICADA: 9 órdenes (aumentó)

La tarjeta desaparece de una columna y aparece en otra
```

---

## 📋 CHECKLIST - MODO REUNIÓN

### **INTERFAZ KANBAN**
- [ ] Columnas por estado (11 estados)
- [ ] Tarjetas con información esencial
- [ ] Diseño limpio y legible
- [ ] Colores por prioridad
- [ ] Iconos por tipo (correctivo/preventivo)

### **DRAG-AND-DROP**
- [ ] Mover tarjeta entre columnas
- [ ] Actualizar estado automáticamente
- [ ] Visual feedback durante arrastre
- [ ] Validación (no permitir estados imposibles)
- [ ] Deshacer último movimiento (Ctrl+Z)

### **ASIGNACIÓN**
- [ ] Asignar operario directamente en tablero
- [ ] Zona visual para cada operario
- [ ] Notificación inmediata
- [ ] Aparece en panel operario

### **SINCRONIZACIÓN REAL-TIME**
- [ ] WebSocket conectado
- [ ] Cambios reflejados en <500ms
- [ ] Múltiples usuarios simultáneamente
- [ ] Sin pérdida de datos
- [ ] Reconexión automática si cae conexión

### **FILTROS**
- [ ] Por prioridad
- [ ] Por operario
- [ ] Por área
- [ ] Por tipo (preventivo/correctivo)
- [ ] Combinaciones múltiples

### **REPORTES**
- [ ] Exportar como PDF
- [ ] Exportar como PNG
- [ ] Imprimir vista actual
- [ ] Incluir timestamp

### **RENDIMIENTO**
- [ ] Carga <2 segundos
- [ ] Scroll suave
- [ ] Sin lag en arrastres
- [ ] Optimizado para TV (60fps)

---

## 💾 TECNOLOGÍA REQUERIDA

```
Frontend (React):
├─ react-beautiful-dnd (drag-and-drop)
├─ socket.io-client (tiempo real)
├─ zustand (state management)
└─ tailwindcss (estilos)

Backend (Node.js):
├─ express
├─ socket.io (WebSocket)
├─ supabase-js
└─ cors

Base de datos:
├─ Tablas ya definidas
└─ Triggers para auditoría
```

---

�� │ Correctivo   │ │ │ Preventivo   │
│  │ ⭐⭐⭐     ││ │ ⭐⭐       │  │ │ ⭐           │ │ │ ⭐⭐⭐      │
│  │ Sin asignar  ││ │ → Juan      │  │ │ → María     │ │ │ Espera verif.│
│  │              ││ │ 🕐 25%      │  │ │ 🕐 80%      │ │ │              │
│  │ [⋯][👥][📋] ││ │ [⋯][👥][📋] │  │ │ [⋯][👥][📋] │ │ │ [⋯][👥][📋] │
│  │ Drag aquí    ││ │             │  │ │ 2h/4h est  │ │ │              │
│  └──────────────┘│ └──────────────┘  │ └──────────────┘ │ └──────────────┘
│                  │                   │                │
│  ┌──────────────┐│ ┌──────────────┐  │ ┌──────────────┐ │ ┌──────────────┐
│  │ OT-5005      ││ │ OT-5006      │  │ │ OT-5007      │ │ │ OT-5008      │
│  │ Sensor temp  ││ │ Válvula      │  │ │ Robot        │ │ │ Mantenimiento│
│  │ Correctivo   ││ │ Preventivo   │  │ │ Preventivo   │ │ │              │
│  │ ⭐⭐       ││ │ ⭐⭐⭐     │  │ │ ⭐⭐        │ │ │ Esperando... │
│  │ Sin asignar  ││ │ → Pedro     │  │ │ → Juan      │ │ │              │
│  │              ││ │ 🕐 5%       │  │ │ 🕐 30%      │ │ │              │
│  │ [⋯][👥][📋] ││ │ [⋯][👥][📋] │  │ │ [⋯][👥][📋] │ │ │ [⋯][👥][📋] │
│  └──────────────┘│ └──────────────┘  │ └──────────────┘ │ └──────────────┘
│                  │                   │                │
│  ┌──────────────┐│ ┌──────────────┐  │ ┌──────────────┐ │
│  │ OT-5009      ││ │ OT-5010      │  │ │ OT-5011      │ │
│  │ Inspección   ││ │ Testeo       │  │ │ Calibración  │ │
│  │ Preventivo   ││ │ Preventivo   │  │ │ Preventivo   │ │
│  │ ⭐         ││ │ ⭐⭐⭐     │  │ │ ⭐⭐⭐      │ │
│  │ Sin asignar  ││ │ → María     │  │ │ → Pedro     │ │
│  │              ││ │ 🕐 10%      │  │ │ 🕐 60%      │ │
│  │ [⋯][👥][📋] ││ │ [⋯][👥][📋] │  │ │ [⋯][👥][📋] │ │
│  └──────────────┘│ └──────────────┘  │ └──────────────┘ │
│                  │                   │                │
├───────────────────┴───────────────────┴─────────────────┴──────────────────
│                                                                       │
│ 📊 RESUMEN:                                                          │
│ • Total OT: 14  │ • Pendientes: 7  │ • En progreso: 5  │ • Completadas: 2
│ • Disponibles: 5 operarios  │ • Capacidad: 80% utilizada            │
│ • Tiempo pendiente: 23 horas  │ • Tiempo promedio/OT: 2.5 horas     │
│                                                                       │
│ [Refrescar] [Exportar] [Imprimir] [Pantalla completa] [Sincronizar] │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

### **5. RESPONSIVE - MODO REUNIÓN EN TV**

```
En pantalla grande (TV 55"):

┌─────────────────────────────────────────────────────────┐
│                   MODO REUNIÓN - FULL SCREEN           │
│                                                         │
│  ABIERTA (3)    │ PLAN. (4)    │ EJECUCIÓN (5) │ COMP. (2)
│  ────────────────┼──────────────┼───────────────┼──────────────
│                 │              │               │
│   ┏━━━━━━━━━┓   │  ┏━━━━━━━━━┓ │  ┏━━━━━━━━━┓ │ ┏━━━━━━━━━┓
│   ┃OT-5001  ┃   │  ┃OT-5002  ┃ │  ┃OT-5004  ┃ │ ┃OT-5003  ┃
│   ┃Motor    ┃   │  ┃Bomba    ┃ │  ┃Limpieza ┃ │ ┃Calibr.  ┃
│   ┃Correct. ┃   │  ┃Prevent. ┃ │  ┃Correct. ┃ │ ┃Prevent. ┃
│   ┃ ⭐⭐⭐  ┃   │  ┃ ⭐⭐   ┃ │  ┃ ⭐     ┃ │ ┃ ⭐⭐⭐  ┃
│   ┃ Sin    ┃   │  ┃→Juan   ┃ │  ┃→María  ┃ │ ┃ Verif.  ┃
│   ┃        ┃   │  ┃ 25%    ┃ │  ┃ 80%    ┃ │ ┃        ┃
│   ┗━━━━━━━━━┛   │  ┗━━━━━━━━━┛ │  ┗━━━━━━━━━┛ │ ┗━━━━━━━━━┛
│                 │              │               │
│   ┏━━━━━━━━━┓   │  ┏━━━━━━━━━┓ │  ┏━━━━━━━━━┓ │
│   ┃OT-5005  ┃   │  ┃OT-5006  ┃ │  ┃OT-5007  ┃ │
│   ┃Sensor   ┃   │  ┃Válvula  ┃ │  ┃Robot    ┃ │
│   ┃Correct. ┃   │  ┃Prevent. ┃ │  ┃Prevent. ┃ │
│   ┃ ⭐⭐   ┃   │  ┃ ⭐⭐⭐  ┃ │  ┃ ⭐⭐   ┃ │
│   ┃ Sin    ┃   │  ┃→Pedro  ┃ │  ┃→Juan   ┃ │
│   ┃        ┃   │  ┃ 5%     ┃ │  ┃ 30%    ┃ │
│   ┗━━━━━━━━━┛   │  ┗━━━━━━━━━┛ │  ┗━━━━━━━━━┛ │
│                 │              │               │
└─────────────────┴──────────────┴───────────────┴──────────────

Características TV:
- Fuente grande (visible desde 3m)
- Colores vibrantes
- Animaciones suaves
- Auto-refresh cada 30 segundos
- Modo oscuro opcional
- Sonido de notificación (opcional)
```

---

## 📋 CHECKLIST - MODO REUNIÓN KANBAN

- [ ] Columnas por estado (6+ estados)
- [ ] Tarjetas con información completa
- [ ] Drag & Drop entre columnas
- [ ] Arrastrar entre operarios (reasignación)
- [ ] Preguntas de confirmación al soltar
- [ ] Socket.io para sincronización real-time
- [ ] Cambios se reflejan en BD
- [ ] Notificaciones a operarios
- [ ] Filtros múltiples
- [ ] Agrupación flexible
- [ ] Búsqueda rápida
- [ ] Acciones rápidas (⋯ menú, 👥 asignar, 📋 detalles)
- [ ] Vista responsive (PC/Tablet/TV)
- [ ] Exportar/Imprimir
- [ ] Auto-refresh opcional
- [ ] Historial de cambios

---

