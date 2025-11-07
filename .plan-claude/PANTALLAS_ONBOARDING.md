# 📋 PANTALLAS DE ONBOARDING - EQUIPOS Y COMPONENTES

## CONCEPTO

```
Cuando se inicia el sistema por PRIMERA VEZ:
├─ No hay máquinas registradas
├─ No hay repuestos
├─ No hay componentes
└─ Sistema guía al Admin para crear datos iniciales

Pantallas de onboarding (5 pasos):
├─ Pantalla 1: Crear primera máquina
├─ Pantalla 2: Agregar componentes reemplazables
├─ Pantalla 3: Agregar repuestos
├─ Pantalla 4: Crear usuarios (operarios)
└─ Pantalla 5: Confirmación y listo para usar
```

---

## 🏭 PANTALLA 1: CREAR PRIMERA MÁQUINA

```
┌────────────────────────────────────────────────────────────┐
│  BIENVENIDO AL SISTEMA DE MANTENIMIENTO                   │
│  Configuración Inicial - Paso 1 de 5                       │
├────────────────────────────────────────────────────────────┤
│  Crearemos tu primera máquina                             │
│                                                            │
│  Nombre: [CNC Línea A            ]                        │
│  Código: [CNC-LIN-A              ]                        │
│  Área:   [Producción ▼]                                  │
│  Tipo:   [CNC ▼]                                          │
│  Fabricante: [MORI SEIKI         ]                        │
│  Modelo: [NX2000                 ]                        │
│  Año: [2020                      ]                        │
│  Descripción: [Máquina CNC 5 ejes...]                    │
│                                                            │
│  [Atrás] [Siguiente] [Saltar]                             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🔧 PANTALLA 2: COMPONENTES REEMPLAZABLES

```
┌────────────────────────────────────────────────────────────┐
│  CONFIGURACIÓN INICIAL - Paso 2 de 5                       │
│  Agregar Componentes Reemplazables                        │
├────────────────────────────────────────────────────────────┤
│  Un componente reemplazable se reemplaza completo         │
│  (motor, bomba, etc) y puede repararse internamente      │
│                                                            │
│  Nombre: [Motor principal       ]                         │
│  Código: [MTR-CNC-001           ]                         │
│  Fabricante: [Siemens           ]                         │
│  Modelo: [S200-D                ]                         │
│  Costo unitario: [$5000         ]                         │
│  Proveedor: [Siemens            ]                         │
│  ¿Stock disponible? ○ Sí ⦿ No                             │
│  Si sí, ¿cuántos? [2            ]                         │
│                                                            │
│  COMPONENTES AGREGADOS:                                    │
│  1. Motor principal (MTR-CNC-001)                         │
│     └─ Stock: 2 unidades                                  │
│     [Editar] [Eliminar]                                   │
│                                                            │
│  [+ Agregar otro] [Atrás] [Siguiente]                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 📦 PANTALLA 3: AGREGAR REPUESTOS

```
┌────────────────────────────────────────────────────────────┐
│  CONFIGURACIÓN INICIAL - Paso 3 de 5                       │
│  Agregar Repuestos                                         │
├────────────────────────────────────────────────────────────┤
│  Los repuestos son piezas para mantener máquinas          │
│  (aceite, filtros, sellos, etc)                           │
│                                                            │
│  Nombre: [Aceite ISO 32         ]                         │
│  Código: [ACE-ISO-32            ]                         │
│  Unidad: [Litros ▼]                                       │
│  Costo: [$12.50                 ]                         │
│  Stock actual: [180             ]                         │
│  Stock mínimo: [50              ]                         │
│  Proveedor: [Shell              ]                         │
│  Máquinas que usan:                                        │
│  ☑ CNC Línea A  ☐ Robot B  ☐ Compresor                   │
│                                                            │
│  REPUESTOS AGREGADOS:                                      │
│  1. Aceite ISO 32 - Stock: 180L, Min: 50L                │
│     [Editar] [Eliminar]                                   │
│  2. Filtro prensa - Stock: 15 un, Min: 5                 │
│     [Editar] [Eliminar]                                   │
│                                                            │
│  [+ Agregar otro] [Atrás] [Siguiente]                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 👥 PANTALLA 4: CREAR USUARIOS

```
┌────────────────────────────────────────────────────────────┐
│  CONFIGURACIÓN INICIAL - Paso 4 de 5                       │
│  Crear Usuarios (Operarios)                                │
├────────────────────────────────────────────────────────────┤
│  Nombre: [Juan García           ]                         │
│  Email: [juan@empresa.com       ]                         │
│  Rol: [Operario ▼]                                        │
│       ├─ Admin                                             │
│       ├─ Supervisor                                        │
│       ├─ Operario                                          │
│       └─ Técnico Especialista                             │
│  Área: [Producción ▼]                                     │
│  Máquinas:                                                 │
│  ☑ CNC Línea A  ☑ Robot B  ☐ Compresor                   │
│  Teléfono: [+34 655 123 456     ]                         │
│  Contraseña: [Generar] o [Ingresar]                      │
│                                                            │
│  USUARIOS AGREGADOS:                                       │
│  1. Juan García - Operario - juan@empresa.com            │
│     [Editar] [Desactivar] [Reset contraseña]             │
│  2. Pedro López - Supervisor - pedro@empresa.com         │
│     [Editar] [Desactivar] [Reset contraseña]             │
│                                                            │
│  Total: 2 usuarios + 1 Admin = 3 usuarios                │
│                                                            │
│  [+ Agregar otro] [Atrás] [Siguiente]                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## ✅ PANTALLA 5: CONFIRMACIÓN Y LISTO

```
┌────────────────────────────────────────────────────────────┐
│  CONFIGURACIÓN INICIAL - Paso 5 de 5 (FINAL)              │
│  ¡Configuración Completada!                               │
├────────────────────────────────────────────────────────────┤
│  ✅ RESUMEN DE LO AGREGADO                                │
│                                                            │
│  MÁQUINAS                                                  │
│  ├─ 1 máquina: CNC Línea A                               │
│  └─ Área: Producción                                      │
│                                                            │
│  COMPONENTES REEMPLAZABLES                                │
│  ├─ 1 componente: Motor principal (MTR-CNC-001)          │
│  └─ Stock: 2 unidades                                    │
│                                                            │
│  REPUESTOS                                                │
│  ├─ 2 repuestos agregados                                │
│  ├─ Aceite ISO 32 (180 litros)                           │
│  └─ Filtro prensa (15 unidades)                          │
│                                                            │
│  USUARIOS                                                  │
│  ├─ Admin: Tú (actual)                                   │
│  ├─ Supervisor: Pedro López                              │
│  └─ Operario: Juan García                                │
│                                                            │
│  PRÓXIMOS PASOS:                                           │
│  1. Usuarios recibirán email con contraseña               │
│  2. Cambiarla en primer acceso                            │
│  3. Seguir agregando máquinas/repuestos                   │
│  4. Crear órdenes de trabajo                              │
│                                                            │
│  [Atrás] [Ir a Dashboard] [Agregar más datos]            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO COMPLETO

```
INICIO
  ↓
¿Primera vez? → SÍ → Pantalla 1
                ↓
           CREAR MÁQUINA
                ↓
           Pantalla 2
                ↓
         COMPONENTES
                ↓
           Pantalla 3
                ↓
            REPUESTOS
                ↓
           Pantalla 4
                ↓
             USUARIOS
                ↓
           Pantalla 5
                ↓
            RESUMEN
                ↓
        ¿Ir a Dashboard?
             ↙     ↘
           Sí       No → Agregar más datos → Vuelve a Pantalla 1
            ↓
         LISTO PARA USAR
```

---

## 📱 PANTALLA 1: DETALLES

### Campos requeridos (*)
```
✓ Nombre - 3-100 caracteres, sin duplicados
✓ Código - único, alfanuméricos + guiones, máx 50 car
✓ Área - dropdown (Producción, Contra Incendios, etc)
✓ Tipo - dropdown (CNC, Robot, Compresor, etc)

Opcionales:
✓ Fabricante
✓ Modelo
✓ Año
✓ Descripción
✓ Número serie
✓ Ubicación
✓ Responsable
✓ Documentación (archivo)
```

### Validaciones tiempo real
```
- Código único (consulta BD)
- Formato válido
- Mensajes de error claros
```

---

## 📦 PANTALLA 2: DETALLES

### Componentes reemplazables
```
Qué es:
- Pieza que se reemplaza completamente
- Puede repararse internamente
- Puede enviarse a proveedor externo
- Tiene múltiples instancias (MTR-001-01, MTR-001-02, etc)

Campos:
✓ Nombre (obligatorio)
✓ Código (único, obligatorio)
✓ Fabricante
✓ Modelo
✓ Costo unitario (obligatorio)
✓ Proveedor reposición
✓ Tiempo reposición (días)
✓ ¿Stock disponible? (Sí/No)
✓ Si sí, cuántas unidades

Funciones:
- Agregar múltiples componentes
- Editar antes de continuar
- Eliminar de la lista
- Opción de continuar sin agregar
```

---

## 🔧 PANTALLA 3: DETALLES

### Repuestos
```
Qué son:
- Piezas que se consumen (aceite, filtros, sellos)
- Stock continuo
- Alertas cuando baja del mínimo

Campos:
✓ Nombre (obligatorio)
✓ Código (único, obligatorio)
✓ Unidad medida (obligatorio)
✓ Costo unitario (obligatorio)
✓ Stock actual (obligatorio)
✓ Stock mínimo (obligatorio)
✓ Ubicación almacén
✓ Proveedor (obligatorio)
✓ Máquinas que usan (checkboxes)

Unidades soportadas:
- Unidades (piezas)
- Litros
- Kilos
- Metros
- Metros cuadrados
- Otro

Funciones:
- Agregar múltiples repuestos
- Asociar a máquinas
- Editar antes de continuar
- Eliminar de la lista
```

---

## 👥 PANTALLA 4: DETALLES

### Usuarios
```
Roles disponibles:
✓ Admin - Control total
✓ Supervisor - Crear/asignar OT, verificar
✓ Operario - Ver asignadas, completar
✓ Técnico - Reparaciones especializadas

Campos requeridos:
✓ Nombre completo
✓ Email (único)
✓ Rol
✓ Área
✓ Contraseña (generar o ingresar)

Campos opcionales:
✓ Máquinas que maneja
✓ Teléfono
✓ Foto de perfil

Validaciones:
- Email único, formato válido
- Contraseña: mín 8 car, 1 mayús, 1 número, 1 especial
- Mensajes claros

Acción:
- Email se envía automáticamente
- Usuario debe cambiar contraseña en primer login
- Puedes resetear contraseña después
```

---

## ✅ PANTALLA 5: RESUMEN

```
Muestra:
├─ Máquinas agregadas
├─ Componentes agregados
├─ Repuestos agregados
├─ Usuarios agregados
└─ Instrucciones finales

Opciones:
├─ [Atrás] → Vuelve a Pantalla 4
├─ [Ir a Dashboard] → Termina onboarding
└─ [Agregar más datos] → Vuelve a Pantalla 1

Después:
- Sistema redirige a Dashboard
- Todo se puede editar en Panel Admin
- Listo para crear órdenes de trabajo
```

---

## 🎯 CARACTERÍSTICAS GENERALES

### Flujo
```
✓ Pasos lineales (1→2→3→4→5)
✓ Opción de saltar algunos pasos (excepto usuarios)
✓ Validación en cada paso
✓ Posibilidad de volver atrás
✓ Resumen antes de finalizar
```

### Usabilidad
```
✓ Progreso visual (Paso X de 5)
✓ Botones grandes y claros
✓ Errores con color rojo + mensaje
✓ Confirmaciones amigables
✓ Indicadores de campos requeridos (*)
✓ Ayuda con ejemplos (ℹ️)
```

### Responsive
```
✓ PC: Formularios en 2 columnas
✓ Tablet: Formularios en 1 columna
✓ Móvil: Vertical, botones grandes
✓ Sin scroll horizontal
```

### Validaciones
```
✓ Formato de datos
✓ Campos requeridos
✓ Unicidad de códigos
✓ Email válido
✓ Contraseña fuerte
✓ Tiempo real (feedback inmediato)
```

---

## 📊 DESPUÉS DEL ONBOARDING

```
Si completa todo:
└─ Va a Dashboard
└─ Ve resumen del sistema
└─ Puede crear primera OT
└─ O agregar más datos

Si presiona [Agregar más datos]:
└─ Vuelve a Pantalla 1
└─ Puede seguir agregando máquinas
└─ Sistema recuerda lo anterior
└─ Puede terminar cuando quiera

Volver al onboarding después:
└─ Panel Admin
└─ Configuración → Resetear onboarding
```

---

## ✅ CHECKLIST PANTALLAS

- [x] Pantalla 1: Crear máquina
- [x] Pantalla 2: Componentes reemplazables
- [x] Pantalla 3: Repuestos
- [x] Pantalla 4: Usuarios
- [x] Pantalla 5: Resumen
- [x] Validaciones completas
- [x] Skip opcional
- [x] Responsive
- [x] Accesible
- [x] Mensajes claros
