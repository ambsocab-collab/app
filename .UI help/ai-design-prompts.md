# GMAOapp AI Design Prompts
## Prompts para Generación de Diseños con IA (Figma, Google Stitch, Figma Make)

### 🎨 Design System Configuration

**Antes de comenzar, especifica estos parámetros globales:**
- **Primary Color:** #0EA5E9 (Azul industrial)
- **Typography:** Inter font family
- **Design Philosophy:** Industrial, clean, high contrast, mobile-first
- **Touch Targets:** 56x56px minimum for work gloves
- **Contrast Ratio:** 7:1 for factory visibility

---

## 📱 MOBILE SCREENS (375x812px)

### 1. Login Screen
```
Industrial maintenance app login screen with:
- Simple, professional design with "GMAOapp" branding
- Large input fields for email and password (56px height) with clear labels
- "Forgot password" and "Remember me" options
- Prominent login button with industrial blue color (#0EA5E9)
- Role selection提示: Operator, Supervisor, Admin
- High contrast text for readability in various lighting conditions
- Error message area for invalid credentials
- Clean, trustworthy design emphasizing security and reliability
- Loading state indicator during authentication
```

### 2. Mobile Dashboard
```
Industrial maintenance mobile app dashboard for factory workers. Mobile screen featuring:

- Top header with app name "GMAOapp", notifications bell, and user profile icon
- Large KPI cards in 2x2 grid showing: Active Orders (3), Critical Alerts (2), Equipment Uptime (89%), Team Status
- Color-coded status indicators: green (good), yellow (warning), red (critical)
- Recent work orders list with priority badges and quick action buttons
- Floating action button (+) for creating new work orders
- Bottom tab navigation with icons: Home, Work Orders, Parts, Reports, Profile
- Blue (#0EA5E9) and gray color scheme with high contrast
- Large buttons and text suitable for work gloves
- Pull-to-refresh indicator for manual sync
```

### 3. Work Orders List
```
Mobile work orders list screen for maintenance operators showing:

- Header with search bar and filter options (Priority, Status, Equipment)
- Work order cards with large touch areas (56px minimum height)
- Each card displaying: Priority badge (color+icon+text), Equipment name, Brief description, Assignment status
- Status indicators: Open (blue), In Progress (yellow), Completed (green), Critical (red)
- Quick action buttons on each card: "Start", "View Details", "Report Issue"
- Swipe gestures for quick actions (left to start, right to view)
- Bottom filter chips: "All", "My Orders", "High Priority", "Overdue"
- Empty state with helpful illustration and "Create First Work Order" CTA
```

### 4. Work Order Detail
```
Detailed work order screen for operator performing maintenance work:

- Header with equipment name, priority badge, and status indicator
- Large timer display showing elapsed time "00:23:45"
- Equipment information panel with QR code scanner button
- Work instructions section with clear, readable text
- Parts checklist with current stock levels
- Large action buttons: "START WORK" (56x56px blue), "PAUSE", "COMPLETE"
- Photo attachment area with camera button
- Notes section for operator comments
- Safety warnings prominently displayed
- Emergency stop button (red) always accessible
- Progress indicator showing current workflow stage
```

### 5. Parts Inventory
```
Mobile spare parts inventory management screen for maintenance operators:

- Search bar with barcode scanner icon and voice search option
- Parts list with large touch-friendly rows (56px height)
- Each part showing: Part name, Current stock/Minimum stock, Location, Status icon
- Color-coded stock levels: Green (20+), Yellow (5-19), Red (1-4), Critical (0)
- Quick action buttons: "Use Part", "View Details", "Find Location"
- Filter chips: "All Parts", "Low Stock", "Frequently Used", "By Category"
- Floating action button for adding new parts
- Stock alert banner for critical items
- Parts usage history button
```

### 6. Parts Usage Form
```
Parts logging form for work order completion:

- Header showing work order number and equipment name
- Searchable parts list with autocomplete
- Parts selection showing: Part name, Available stock, Unit cost
- Quantity input with large +/- buttons and stepper (+1, +5, +10)
- Real-time stock validation with warnings for insufficient inventory
- Running cost calculation and parts summary
- Alternative part suggestions if selected part unavailable
- "Add Another Part" button for multiple items
- Save and continue button with confirmation dialog
- Offline indicator showing queued changes
```

### 7. Equipment Hierarchy
```
Equipment hierarchy navigation screen for maintenance planning:

- Search bar with equipment code and name search
- Expandable tree structure: Plant > Area > Functional Unit > Equipment > Components
- Visual hierarchy with indentation and icons for each level
- Equipment cards showing: Name, Status, Location, Associated parts count
- Quick actions: "Create Work Order", "View Details", "View History"
- Breadcrumb navigation showing current location in hierarchy
- Recently used equipment section for quick access
- Filter options by equipment type and status
- QR code scanner button for quick equipment identification
```

### 8. Reports Dashboard
```
Mobile reports screen showing maintenance analytics:

- Date range selector with quick options (Today, Week, Month)
- Key metrics cards: Work completed, Average repair time, Parts used, Team productivity
- Simple charts showing: Work order trends by day, Priority distribution, Equipment performance
- Team performance summary with completion rates
- Equipment reliability metrics
- Export button for PDF reports
- Filter options by team member, equipment, time period
- Comparison to previous period indicators
- Share report button for email distribution
```

### 9. User Profile & Settings
```
User profile management screen for all user roles:

- Profile header with user photo, name, role, and department
- Settings sections: Account, Notifications, Preferences, About
- Account settings: Email, phone number, password change
- Notification preferences: Work assignments, Stock alerts, System updates
- App preferences: Language, Theme (light/dark), Units (metric/imperial)
- Accessibility settings: Text size, High contrast mode
- Sign out button with confirmation
- Support section with help documentation and contact info
- App version and build information
- Data usage and storage information
```

---

## 📱 TABLET SCREENS (1024x768px)

### 10. Supervisor Tablet Dashboard
```
Tablet dashboard for maintenance supervisors with team oversight:

- Top toolbar with user info, notifications, and date/time
- KPI summary row: Active orders, Team status, Critical alerts, Performance metrics
- Team workload section showing each operator's current assignments
- Work order priority matrix (Urgent vs Important)
- Equipment status overview with health indicators
- Quick action buttons: "Create Work Order", "Assign Team", "Generate Report"
- Real-time status updates with visual indicators
- Meeting mode toggle to activate TV display
- Team availability and skills matrix
- Drag-and-drop area for quick work order reassignment
```

### 11. Supervisor Kanban Board
```
Kanban board interface for maintenance supervisors with drag-and-drop functionality:

- Three main columns: "To Do", "In Progress", "Completed"
- Work order cards with priority color coding and operator avatars
- Card details showing: Equipment name, Priority, Time tracking, Parts needed
- Drag-and-drop capability between columns
- Filter panel by team member, priority, equipment type, date range
- Bulk selection mode for multiple work order operations
- Column statistics showing work distribution
- Quick actions menu on each card: Reassign, Change priority, Add notes
- Real-time updates showing other supervisors' changes
- Zoom controls for better visibility in meeting rooms
```

---

## 💻 DESKTOP SCREENS (1920x1080px)

### 12. Equipment Management Desktop
```
Desktop equipment management interface for system administrators:

- Complex multi-column layout with resizable panels
- Equipment hierarchy tree on the left with drag-and-drop reorganization
- Main content area showing equipment details and associated work orders
- Bulk import/export toolbar with CSV/Excel upload buttons
- Advanced filtering and search capabilities
- Equipment health monitoring dashboard
- Maintenance scheduling calendar
- Parts association matrix showing commonly used parts per equipment
- Audit log of equipment changes and history
- Performance analytics with charts and trends
- Multi-select for bulk operations
```

### 13. Admin User Management
```
Desktop user administration interface for system administrators:

- User table with advanced filtering and search capabilities
- Columns: Name, Email, Role, Department, Status, Last login, Actions
- Bulk operations: Activate/Deactivate, Role changes, Password reset
- User creation form with role assignment and permissions
- Activity logs showing user actions and system changes
- Export user list functionality
- Permission matrix showing role-based access rights
- User statistics: Active users, Login frequency, Role distribution
- Import users from CSV functionality
- Audit trail for compliance and security
```

### 14. TV Display Dashboard
```
Large screen display for factory meeting rooms showing maintenance overview:

- Auto-rotating dashboard switching between views every 30 seconds
- View 1: KPI Dashboard - MTTR, MTBF, Equipment availability, Team productivity
- View 2: Work Order Status - Active orders by priority and assignment
- View 3: Team Performance - Individual metrics and achievements
- View 4: Equipment Health - Overall equipment status and alerts
- Large, readable fonts visible from across meeting room
- High contrast design with clear visual hierarchy
- Current time and last update timestamp
- Company branding in subtle header
- Progress indicators for team goals
- Emergency alerts displayed prominently at top
```

---

## 🎯 COMPONENT DESIGN PROMPTS

### Button System
```
Design a button system for industrial maintenance app with three types:

Primary Button (Main actions):
- Size: 56x56px minimum for work gloves
- Background: #0EA5E9 (Safety blue)
- Text: White, 16px, Inter Medium font
- Border radius: 8px
- Touch feedback: Scale animation + haptic vibration
- States: Default (100% opacity), Pressed (80%), Disabled (40%)

Secondary Button:
- Size: 48x48px minimum
- Background: Transparent, 2px blue border
- Text: #0EA5E9, 16px, Inter Regular
- Hover: Light blue background

Emergency Button:
- Size: 64x64px (larger for emergencies)
- Background: #DC2626 (Safety red)
- Text: White, 18px, Inter Bold
- Animation: Pulse effect for attention
- 3px white border for emphasis
```

### Input Field System
```
Design input field system for industrial maintenance:

Standard Text Input:
- Height: 56px for touch accessibility
- Border: 2px, #E5E7EB with focus state blue
- Background: White for high contrast
- Text: 16px, Inter Regular, #1F2937
- Label: 14px, Inter Medium, #374151
- Error state: Red border with error message below

Number Input (Parts Quantity):
- Large increment/decrement buttons: 24x24px
- Step options: +1, +5, +10 for bulk adjustments
- Real-time validation against available stock
- Clear display of current stock level

Search Input:
- Icon on left for visual clarity
- Clear button on right when text entered
- Auto-complete suggestions dropdown
- Voice search option for hands-free operation
```

### Status Indicators
```
Design status indicator system for work orders and equipment:

Priority Indicators:
- Critical: Red background, white icon + text, pulse animation
- High: Orange background, white icon + text
- Medium: Blue background, white icon + text
- Low: Green background, white icon + text

Work Status Indicators:
- Open: Blue circle with white center
- In Progress: Yellow circle with animated progress
- Completed: Green circle with checkmark
- Rejected: Red circle with X mark

Stock Level Indicators:
- Good Stock (20+): Green bar
- Low Stock (5-19): Yellow bar with warning icon
- Critical Stock (1-4): Red bar with alert icon
- Out of Stock (0): Red bar with critical alert icon
```

---

## 🔧 CONFIGURACIÓN DE HERRAMIENTAS

### Para Figma/Figma Make:
- Usa el tamaño exacto en pixels (ej: 375x812px)
- Especifica colores hexadecimales (#0EA5E9)
- Menciona la fuente "Inter" explícitamente
- Solicita alta visibilidad y contraste
- Pide componentes reutilizables

### Para Google Stitch:
- Enfócate en descripciones visuales claras
- Usa términos como "clean", "industrial", "professional"
- Especifica layout y organización de elementos
- Menciona comportamiento interactivo

### Para cualquier herramienta AI:
- Sé específico sobre tamaños y colores
- Describe el contexto de uso industrial
- Pide consistencia entre pantallas
- Especifica requisitos de accesibilidad

---

## 📋 CHECKLIST DE DISEÑO

Para cada pantalla generada, verifica:
- [ ] Tamaño de pantalla correcto
- [ ] Colores del branding aplicados
- [ ] Tipografía Inter utilizada
- [ ] Touch targets de 56px mínimo
- [ ] Alto contraste (7:1 ratio)
- [ ] Indicadores de estado claros
- [ ] Navegación consistente
- [ ] Mensajes de error incluidos
- [ ] Estados de carga considerados
- [ ] Responsive behavior definido

---

## 🚀 PRÓXIMOS PASOS

1. **Generar pantallas mobile primero** (Login, Dashboard, Work Orders)
2. **Crear sistema de componentes** (Buttons, Inputs, Status indicators)
3. **Diseñar pantallas tablet** (Supervisor dashboard, Kanban)
4. **Desarrollar interfaces desktop** (Admin, Equipment management)
5. **Validar consistencia visual** entre todas las pantallas
6. **Preparar assets para desarrollo** con especificaciones técnicas

---

**Notas adicionales:**
- Siempre especifica el contexto industrial (fábrica, guantes, ruido)
- Pide diseños que funcionen offline cuando sea relevante
- Incluye consideraciones de accesibilidad WCAG AA
- Solicita micro-interacciones para feedback visual
- Menciona animaciones sutiles para transiciones importantes