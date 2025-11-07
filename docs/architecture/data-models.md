# Data Models

These core data models represent the business entities that flow through the entire system, from React components to database tables. Each model includes TypeScript interfaces that can be shared across the fullstack application.

## Work Order

**Purpose:** Central entity representing maintenance tasks from creation through completion, tracking all aspects of repair work including assignment, status changes, parts usage, and time tracking.

**Key Attributes:**
- id: UUID - Unique identifier across all work orders
- title: string - Brief description of the maintenance task
- description: text - Detailed work instructions and observations
- priority: PriorityLevel - Critical/High/Medium/Low priority classification
- status: WorkOrderStatus - Current state in the workflow lifecycle
- equipmentId: UUID - Reference to equipment being maintained
- assignedOperatorId: UUID - Operator assigned to perform the work
- createdById: UUID - Supervisor who created the work order
- estimatedDuration: number - Planned work time in minutes
- actualDuration: number - Actual time spent (tracked via start/stop)
- createdAt: timestamp - Work order creation timestamp
- startedAt: timestamp - When work actually began
- completedAt: timestamp - When work was completed
- completedById: UUID - Operator who marked work complete

### TypeScript Interface
```typescript
interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'planned' | 'in_execution' | 'completed' | 'closed' | 'rejected' | 'waiting' | 'pending_stock';
  equipmentId: string;
  assignedOperatorId?: string;
  createdById: string;
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  completedById?: string;
  auditTrail: WorkOrderAuditEntry[];
  sparePartsUsage: SparePartUsage[];
  attachments: WorkOrderAttachment[];
}
```

### Relationships
- **Equipment**: Many-to-One (multiple work orders per equipment)
- **User**: Many-to-One (created by supervisor, assigned to operator, completed by operator)
- **Spare Parts**: Many-to-Many through SparePartUsage
- **Audit Trail**: One-to-Many (track all state changes)

## Equipment

**Purpose:** Hierarchical equipment structure representing the plant's physical assets, from the highest level (Plant) down to individual Components, enabling flexible organization and location-based maintenance tracking.

**Key Attributes:**
- id: UUID - Unique equipment identifier
- name: string - Human-readable equipment name
- code: string - Unique equipment code/number
- type: EquipmentType - Classification (Plant/Area/FunctionalUnit/Equipment/Component)
- parentId: UUID - Reference to parent equipment in hierarchy
- level: number - Hierarchy depth for performance optimization
- location: string - Physical location description
- manufacturer?: string - Equipment manufacturer
- model?: string - Equipment model number
- serialNumber?: string - Unique serial identifier
- installationDate?: date - When equipment was installed
- status: EquipmentStatus - Current operational state
- maintenanceNotes: text - Important maintenance information
- associatedSpareParts: UUID[] - Parts commonly used for this equipment

### TypeScript Interface
```typescript
interface Equipment {
  id: string;
  name: string;
  code: string;
  type: 'plant' | 'area' | 'functional_unit' | 'equipment' | 'component';
  parentId?: string;
  level: number; // 0=root plant level
  location: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installationDate?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'decommissioned';
  maintenanceNotes?: string;
  associatedSpareParts: string[]; // spare part IDs
  children?: Equipment[]; // for hierarchy navigation
  parent?: Equipment; // for upward navigation
}
```

### Relationships
- **Self-referential**: Many-to-One (children to parent, parent to children)
- **Work Orders**: One-to-Many (equipment can have many work orders)
- **Spare Parts**: Many-to-Many through equipment associations

## User

**Purpose:** System users with role-based permissions determining their access to features and data, supporting the three primary roles in the maintenance workflow.

**Key Attributes:**
- id: UUID - Unique user identifier
- email: string - Login email (must be unique)
- name: string - Full name for display purposes
- role: UserRole - System permission level (Admin/Supervisor/Operator)
- isActive: boolean - Whether user can access the system
- lastLoginAt: timestamp - Last successful login
- createdAt: timestamp - When user account was created
- phoneNumber?: string - Optional contact number
- department?: string - Organizational department
- preferences: UserPreferences - UI and notification preferences

### TypeScript Interface
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'supervisor' | 'operator';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  phoneNumber?: string;
  department?: string;
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      workOrderAssignment: boolean;
      lowStockAlert: boolean;
    };
  };
}
```

### Relationships
- **Work Orders**: One-to-Many (created, assigned, completed)
- **Audit Trail**: One-to-Many (state changes made by user)

## Spare Part

**Purpose:** Inventory management for replacement parts used in maintenance operations, including stock tracking, reorder points, and multi-equipment associations.

**Key Attributes:**
- id: UUID - Unique part identifier
- name: string - Human-readable part name
- partNumber: string - Manufacturer or internal part number
- description: text - Detailed part specifications
- category: string - Part category for organization
- currentStock: number - Current quantity on hand
- minimumStock: number - Alert threshold for reordering
- maximumStock: number - Maximum quantity to keep in stock
- unit: string - Unit of measure (each, box, meter, etc.)
- unitCost: number - Cost per unit
- location: string - Storage location in facility
- supplier?: string - Primary supplier information
- isActive: boolean - Whether part is currently used

### TypeScript Interface
```typescript
interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  description?: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unit: string; // 'each', 'box', 'meter', 'kg', etc.
  unitCost: number;
  location: string;
  supplier?: string;
  isActive: boolean;
  associatedEquipment: string[]; // equipment IDs
  usage: SparePartUsage[]; // historical usage
}
```

### Relationships
- **Equipment**: Many-to-Many through associations
- **Spare Part Usage**: One-to-Many (consumption tracking)

## Supporting Models

### Work Order Audit Entry
```typescript
interface WorkOrderAuditEntry {
  id: string;
  workOrderId: string;
  userId: string;
  previousStatus?: string;
  newStatus: string;
  reason?: string;
  timestamp: string;
}
```

### Spare Part Usage
```typescript
interface SparePartUsage {
  id: string;
  workOrderId: string;
  sparePartId: string;
  quantity: number;
  unitCost: number; // snapshot of cost at time of usage
  timestamp: string;
  usedById: string;
}
```

### Work Order Attachment
```typescript
interface WorkOrderAttachment {
  id: string;
  workOrderId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedById: string;
  uploadedAt: string;
}
```

---
