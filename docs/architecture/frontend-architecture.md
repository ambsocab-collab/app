# Frontend Architecture

## Component Architecture

### Component Organization
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Headless UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── forms/           # Form components
│   │   ├── WorkOrderForm.tsx
│   │   ├── EquipmentForm.tsx
│   │   └── SparePartForm.tsx
│   └── layout/          # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── TabBar.tsx
├── pages/               # Route-level components
│   ├── Home.tsx
│   ├── WorkOrders/
│   ├── Equipment/
│   ├── SpareParts/
│   └── KPI/
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useWorkOrders.ts
│   ├── useEquipment.ts
│   └── useSpareParts.ts
├── services/            # API client services
│   ├── api.ts
│   ├── auth.ts
│   ├── workOrders.ts
│   └── equipment.ts
├── stores/              # State management
│   ├── authStore.ts
│   ├── workOrderStore.ts
│   └── syncStore.ts
├── utils/               # Utility functions
│   ├── constants.ts
│   ├── validators.ts
│   └── formatters.ts
└── types/               # TypeScript definitions
    ├── api.ts
    ├── models.ts
    └── permissions.ts
```

### Component Template
```typescript
import React from 'react';
import { useWorkOrder } from '@/hooks/useWorkOrder';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface WorkOrderCardProps {
  id: string;
  onStatusChange: (id: string, status: string) => void;
}

export const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  id,
  onStatusChange
}) => {
  const { data: workOrder, isLoading, error } = useWorkOrder(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!workOrder) return <div>Work order not found</div>;

  return (
    <Card className="work-order-card">
      <h3>{workOrder.title}</h3>
      <p>{workOrder.description}</p>
      <Button onClick={() => onStatusChange(id, 'in_execution')}>
        Start Work
      </Button>
    </Card>
  );
};
```

## State Management Architecture

### State Structure
```typescript
interface AppState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    permissions: string[];
  };
  workOrders: {
    myOrders: WorkOrder[];
    allOrders: WorkOrder[];
    currentOrder: WorkOrder | null;
    loading: boolean;
    error: string | null;
  };
  equipment: {
    hierarchy: Equipment[];
    selectedEquipment: Equipment | null;
    loading: boolean;
  };
  sync: {
    lastSync: string | null;
    isOnline: boolean;
    pendingChanges: PendingChange[];
  };
  ui: {
    theme: 'light' | 'dark';
    notifications: Notification[];
    sidebarOpen: boolean;
  };
}
```

### State Management Patterns
- **Zustand stores** for each major domain (auth, workOrders, equipment)
- **Optimistic updates** for immediate UI feedback
- **Rollback mechanisms** for failed operations
- **Local storage persistence** for offline capability
- **Real-time subscriptions** for automatic updates

## Routing Architecture

### Route Organization
```
/                           # Home dashboard
/login                      # Authentication
/work-orders               # Work order management
  /my-orders               # Operator's assigned orders
  /all                     # Supervisor view (role-protected)
  /new                     # Create new order
  /[id]                    # Work order details
/equipment                 # Equipment hierarchy
  /hierarchy               # Tree view
  /[id]                    # Equipment details
  /import                  # Bulk import (admin only)
/spare-parts               # Inventory management
  /inventory               # Stock levels
  /low-stock               # Below threshold
  /new                     # Add new part
/kpi                       # Analytics dashboard
  /dashboard               # Main KPI view
  /reports                 # Detailed reports
/admin                     # Administration (admin only)
  /users                   # User management
  /settings                # System configuration
```

### Protected Route Pattern
```typescript
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/models';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback = <div>Access denied</div>
}) => {
  const { user, isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback;
  }

  return <>{children}</>;
};
```

## Frontend Services Layer

### API Client Setup
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const api = {
  // Generic API wrapper with error handling
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`/api/v1${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await supabase.auth.getSession().then(s => s.data.session?.access_token)}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
};
```

### Service Example
```typescript
import { api } from './api';
import { WorkOrder, CreateWorkOrderRequest } from '@/types/models';

export const workOrderService = {
  async getMyWorkOrders(): Promise<WorkOrder[]> {
    return api.request<WorkOrder[]>('/work-orders?assignedTo=me');
  },

  async getAllWorkOrders(filters?: WorkOrderFilters): Promise<WorkOrder[]> {
    const params = new URLSearchParams(filters).toString();
    return api.request<WorkOrder[]>(`/work-orders?${params}`);
  },

  async createWorkOrder(data: CreateWorkOrderRequest): Promise<WorkOrder> {
    return api.request<WorkOrder>('/work-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateWorkOrderStatus(id: string, status: string, reason?: string): Promise<WorkOrder> {
    return api.request<WorkOrder>(`/work-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }
};
```

---
