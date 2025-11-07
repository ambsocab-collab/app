# GMAOapp Design Integration Guide
## From HTML Designs to React Components

### Overview

This guide explains how to convert HTML designs generated from Google Stitch, Figma Make, or other AI design tools into fully functional React components that integrate with your GMAOapp architecture.

### Integration Strategy

**Phase 1: Design to Component Mapping**
- Analyze HTML structure and identify reusable components
- Extract design tokens (colors, spacing, typography)
- Create component specifications based on design system

**Phase 2: Component Development**
- Build React components following established design system
- Implement responsive behavior and accessibility features
- Add state management and interaction logic

**Phase 3: Integration & Testing**
- Connect components to data layer and API
- Implement user flows and navigation
- Test functionality across devices and user scenarios

---

## Step 1: Design Analysis & Planning

### Extract Design Tokens

Create a mapping from design HTML to your design system:

```typescript
// tokens/design-tokens.ts
export const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#0EA5E9', // GMAOapp primary
    700: '#1E40AF',
    900: '#1E3A8A'
  },
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#10B981', // GMAOapp success
    700: '#15803D'
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#EAB308',
    600: '#F59E0B', // GMAOapp warning
    700: '#CA8A04'
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626', // GMAOapp error
    700: '#B91C1C'
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace']
  },
  fontSize: {
    xs: ['11px', { lineHeight: '14px' }],     // Mobile
    sm: ['13px', { lineHeight: '18px' }],     // Mobile
    base: ['15px', { lineHeight: '22px' }],   // Mobile
    lg: ['17px', { lineHeight: '25px' }],     // Mobile
    xl: ['18px', { lineHeight: '25px' }],     // Mobile
    '2xl': ['20px', { lineHeight: '26px' }],  // Mobile
    '3xl': ['24px', { lineHeight: '29px' }],  // Mobile
    '4xl': ['28px', { lineHeight: '34px' }]   // Mobile
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px'
};
```

### Component Identification Map

Create a mapping of design elements to React components:

```typescript
// Component mapping for mobile dashboard design
const componentMapping = {
  'mobile-header': 'components/layout/MobileHeader',
  'kpi-card': 'components/dashboard/KPICard',
  'work-order-list': 'components/work-orders/WorkOrderList',
  'work-order-card': 'components/work-orders/WorkOrderCard',
  'bottom-navigation': 'components/navigation/BottomNavigation',
  'floating-action-button': 'components/ui/FloatingActionButton',
  'status-badge': 'components/ui/StatusBadge',
  'priority-indicator': 'components/ui/PriorityIndicator'
};
```

---

## Step 2: Component Development

### Base UI Components

Start with fundamental components extracted from designs:

```tsx
// components/ui/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  // Base styles for work gloves (56x56px minimum)
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 min-h-[56px] px-6",
        secondary: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 min-h-[48px] px-4",
        emergency: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 min-h-[64px] px-8 animate-pulse",
        ghost: "hover:bg-accent hover:text-accent-foreground min-h-[48px] px-4",
        link: "underline-offset-4 hover:underline text-blue-600 min-h-[48px]"
      },
      size: {
        sm: "h-12 px-4 text-sm",
        md: "h-14 px-6 text-base",
        lg: "h-16 px-8 text-lg",
        xl: "h-20 px-10 text-xl"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, leftIcon, rightIcon, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="animate-spin h-5 w-5 mr-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/>
            </svg>
          </div>
        ) : leftIcon}
        {children}
        {rightIcon}
      </Comp>
    );
  }
);

Button.displayName = "Button";
export default Button;
```

```tsx
// components/ui/Card.tsx
import React from 'react';
import { cn } from '@/utils/cn';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

### Status and Badge Components

```tsx
// components/ui/StatusBadge.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset",
  {
    variants: {
      status: {
        open: "bg-blue-50 text-blue-700 ring-blue-600/20",
        'in-progress': "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
        completed: "bg-green-50 text-green-700 ring-green-600/20",
        rejected: "bg-red-50 text-red-700 ring-red-600/20",
        closed: "bg-gray-50 text-gray-700 ring-gray-600/20",
        draft: "bg-gray-50 text-gray-700 ring-gray-600/20"
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base"
      }
    },
    defaultVariants: {
      status: "open",
      size: "md"
    }
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: React.ReactNode;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, size, icon, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(statusBadgeVariants({ status, size, className }))}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </div>
  )
);

StatusBadge.displayName = "StatusBadge";
export default StatusBadge;
```

### Work Order Components

```tsx
// components/work-orders/WorkOrderCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { WorkOrder } from '@/types/work-order';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onStartWork?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

const priorityColors = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-blue-100 text-blue-800 border-blue-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  workOrder,
  onStartWork,
  onViewDetails,
  className
}) => {
  const {
    id,
    title,
    equipment,
    priority,
    status,
    description,
    createdAt,
    assignedOperator,
    estimatedDuration
  } = workOrder;

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium",
                priorityColors[priority]
              )}>
                {priority.toUpperCase()}
              </span>
              <StatusBadge status={status} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {equipment.name} • {equipment.location}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>
            Creado {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: es
            })}
          </span>
          {estimatedDuration && (
            <span>Est. {estimatedDuration}h</span>
          )}
        </div>

        {assignedOperator && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {assignedOperator.name.charAt(0)}
            </div>
            <span className="text-sm text-gray-700">{assignedOperator.name}</span>
          </div>
        )}

        <div className="flex gap-2">
          {status === 'open' && onStartWork && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onStartWork(id)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              Iniciar Trabajo
            </Button>
          )}

          {onViewDetails && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetails(id)}
            >
              Detalles
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkOrderCard;
```

---

## Step 3: Layout Components

### Mobile Layout

```tsx
// components/layout/MobileLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileHeader } from './MobileHeader';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';

interface MobileLayoutProps {
  title?: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  title,
  showBackButton = false,
  rightAction
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <MobileHeader
        title={title}
        showBackButton={showBackButton}
        rightAction={rightAction}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6 max-w-md mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MobileLayout;
```

### Responsive Dashboard

```tsx
// components/dashboard/DashboardLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* Mobile Dashboard */}
      <div className="lg:hidden">
        <div className="px-4 py-6 space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {children}
          </div>

          {/* Recent Work Orders */}
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>

      {/* Tablet Dashboard */}
      <div className="hidden lg:block xl:hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {children}
          </div>
        </div>
      </div>

      {/* Desktop Dashboard */}
      <div className="hidden xl:block">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-4 gap-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
```

---

## Step 4: Data Integration

### Types and Interfaces

```typescript
// types/work-order.ts
export interface WorkOrder {
  id: string;
  title: string;
  description?: string;
  equipment: Equipment;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'draft' | 'open' | 'planned' | 'in-progress' | 'completed' | 'closed' | 'rejected';
  assignedOperator?: Operator;
  createdAt: string;
  updatedAt: string;
  estimatedDuration?: number;
  actualDuration?: number;
  partsUsed?: PartUsage[];
  notes?: string;
  photos?: string[];
}

export interface Equipment {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'operational' | 'maintenance' | 'out-of-service';
  category: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

export interface Operator {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'supervisor' | 'admin';
  avatar?: string;
  skills: string[];
  isAvailable: boolean;
  currentWorkOrderId?: string;
}

export interface PartUsage {
  partId: string;
  part: Part;
  quantity: number;
  unitCost: number;
}

export interface Part {
  id: string;
  name: string;
  code: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  location: string;
  unitCost: number;
  supplier?: string;
}
```

### Hooks for Data Management

```typescript
// hooks/useWorkOrders.ts
import { useState, useEffect } from 'react';
import { WorkOrder } from '@/types/work-order';

interface UseWorkOrdersOptions {
  status?: WorkOrder['status'];
  assignedTo?: string;
  priority?: WorkOrder['priority'];
  limit?: number;
}

export const useWorkOrders = (options: UseWorkOrdersOptions = {}) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (options.status) params.append('status', options.status);
        if (options.assignedTo) params.append('assignedTo', options.assignedTo);
        if (options.priority) params.append('priority', options.priority);
        if (options.limit) params.append('limit', options.limit.toString());

        const response = await fetch(`/api/work-orders?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch work orders');
        }

        const data = await response.json();
        setWorkOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, [options.status, options.assignedTo, options.priority, options.limit]);

  const createWorkOrder = async (workOrderData: Partial<WorkOrder>) => {
    try {
      const response = await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workOrderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create work order');
      }

      const newWorkOrder = await response.json();
      setWorkOrders(prev => [newWorkOrder, ...prev]);
      return newWorkOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updateWorkOrderStatus = async (id: string, status: WorkOrder['status']) => {
    try {
      const response = await fetch(`/api/work-orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update work order status');
      }

      setWorkOrders(prev =>
        prev.map(wo => wo.id === id ? { ...wo, status } : wo)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    workOrders,
    loading,
    error,
    createWorkOrder,
    updateWorkOrderStatus,
    refetch: () => setLoading(true)
  };
};
```

---

## Step 5: Page Implementation

### Mobile Dashboard

```tsx
// pages/MobileDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { WorkOrderCard } from '@/components/work-orders/WorkOrderCard';
import { KPICard } from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/Button';
import { MobileLayout } from '@/components/layout/MobileLayout';

const MobileDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { workOrders, loading, error, updateWorkOrderStatus } = useWorkOrders({
    limit: 5
  });

  const myWorkOrders = workOrders.filter(wo => wo.status === 'open');
  const inProgressWorkOrders = workOrders.filter(wo => wo.status === 'in-progress');

  const handleStartWork = async (workOrderId: string) => {
    try {
      await updateWorkOrderStatus(workOrderId, 'in-progress');
      navigate(`/work-orders/${workOrderId}`);
    } catch (error) {
      console.error('Failed to start work:', error);
    }
  };

  const handleViewDetails = (workOrderId: string) => {
    navigate(`/work-orders/${workOrderId}`);
  };

  if (loading) {
    return (
      <MobileLayout title="GMAOapp">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout title="GMAOapp">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Error loading dashboard</div>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      title="GMAOapp"
      rightAction={
        <Button variant="ghost" size="sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <KPICard
            title="Órdenes Activas"
            value={myWorkOrders.length}
            trend={null}
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <KPICard
            title="En Progreso"
            value={inProgressWorkOrders.length}
            trend={null}
            icon={
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <KPICard
            title="Alertas"
            value={2}
            trend="up"
            icon={
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          <KPICard
            title="Disponibilidad"
            value="89%"
            trend="up"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Recent Work Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Mis Órdenes
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/work-orders')}>
              Ver todas
            </Button>
          </div>

          {myWorkOrders.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border">
              <div className="text-gray-500 mb-4">No tienes órdenes asignadas</div>
              <Button onClick={() => navigate('/work-orders/create')}>
                Crear Orden
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myWorkOrders.map(workOrder => (
                <WorkOrderCard
                  key={workOrder.id}
                  workOrder={workOrder}
                  onStartWork={handleStartWork}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default MobileDashboard;
```

---

## Step 6: Testing & Validation

### Component Testing

```tsx
// __tests__/components/WorkOrderCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkOrderCard } from '@/components/work-orders/WorkOrderCard';
import { WorkOrder } from '@/types/work-order';

const mockWorkOrder: WorkOrder = {
  id: '1',
  title: 'Reparar Cinta Transportadora A3',
  description: 'Reemplazar sección dañada de la cinta principal',
  equipment: {
    id: 'eq1',
    name: 'Cinta Transportadora A3',
    code: 'CTA-003',
    location: 'Planta Principal - Área de Producción',
    status: 'maintenance',
    category: 'Transporte'
  },
  priority: 'high',
  status: 'open',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  estimatedDuration: 2,
  assignedOperator: {
    id: 'op1',
    name: 'María González',
    email: 'maria@company.com',
    role: 'operator',
    skills: ['Mecánica', 'Electricidad'],
    isAvailable: true
  }
};

describe('WorkOrderCard', () => {
  it('renders work order information correctly', () => {
    render(<WorkOrderCard workOrder={mockWorkOrder} />);

    expect(screen.getByText('Reparar Cinta Transportadora A3')).toBeInTheDocument();
    expect(screen.getByText('Cinta Transportadora A3 • Planta Principal - Área de Producción')).toBeInTheDocument();
    expect(screen.getByText('María González')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('OPEN')).toBeInTheDocument();
  });

  it('calls onStartWork when Iniciar Trabajo button is clicked', () => {
    const mockOnStartWork = jest.fn();
    render(<WorkOrderCard workOrder={mockWorkOrder} onStartWork={mockOnStartWork} />);

    const startButton = screen.getByText('Iniciar Trabajo');
    fireEvent.click(startButton);

    expect(mockOnStartWork).toHaveBeenCalledWith('1');
  });

  it('shows loading state when loading prop is true', () => {
    render(<WorkOrderCard workOrder={mockWorkOrder} loading={true} />);

    // Should show loading spinner and disable button
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });
});
```

### Accessibility Testing

```tsx
// __tests__/accessibility/WorkOrderCard.a11y.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { WorkOrderCard } from '@/components/work-orders/WorkOrderCard';
import { mockWorkOrder } from '@/test/mocks/work-order';

expect.extend(toHaveNoViolations);

describe('WorkOrderCard Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<WorkOrderCard workOrder={mockWorkOrder} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard navigable', () => {
    render(<WorkOrderCard workOrder={mockWorkOrder} />);

    const startButton = screen.getByText('Iniciar Trabajo');
    startButton.focus();
    expect(startButton).toHaveFocus();

    // Test Tab navigation
    fireEvent.tab();
    const detailsButton = screen.getByText('Detalles');
    expect(detailsButton).toHaveFocus();
  });

  it('should have proper ARIA labels', () => {
    render(<WorkOrderCard workOrder={mockWorkOrder} />);

    const statusBadge = screen.getByText('OPEN');
    expect(statusBadge).toHaveAttribute('role', 'status');

    const priorityBadge = screen.getByText('HIGH');
    expect(priorityBadge).toHaveAttribute('aria-label', 'High priority');
  });
});
```

---

## Step 7: Deployment & Optimization

### Build Optimization

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Image optimization for industrial photos
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Service worker for offline functionality
  async rewrites() {
    return [
      {
        source: '/service-worker.js',
        destination: '/_next/static/chunks/service-worker.js',
      },
    ];
  },
};

module.exports = nextConfig;
```

### Progressive Web App Configuration

```typescript
// public/manifest.json
{
  "name": "GMAOapp - Sistema de Mantenimiento Industrial",
  "short_name": "GMAOapp",
  "description": "Aplicación de gestión de mantenimiento de órdenes de trabajo para entornos industriales",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0EA5E9",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "es",
  "categories": ["business", "productivity", "utilities"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "splash_pages": null
}
```

---

## Integration Checklist

### Pre-Integration Checklist
- [ ] HTML designs reviewed and approved
- [ ] Design tokens extracted and mapped to design system
- [ ] Component hierarchy planned
- [ ] Data models and types defined
- [ ] API endpoints designed and documented
- [ ] Testing strategy defined

### Development Checklist
- [ ] Base UI components created (Button, Card, Input, etc.)
- [ ] Layout components implemented (Mobile, Tablet, Desktop)
- [ ] Business logic components built (WorkOrderCard, KPICard, etc.)
- [ ] Data hooks and services implemented
- [ ] Pages and routes created
- [ ] Responsive design tested across breakpoints
- [ ] Accessibility testing completed
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Form validation implemented

### Post-Integration Checklist
- [ ] Cross-browser compatibility tested
- [ ] Performance optimization completed
- [ ] PWA functionality verified
- [ ] Offline capability tested
- [ ] Security review completed
- [ ] User acceptance testing with industrial users
- [ ] Documentation updated
- [ ] Deployment pipeline configured
- [ ] Monitoring and analytics implemented
- [ ] Training materials created

---

## Troubleshooting Common Issues

### HTML to React Conversion Issues

**Issue:** Inline styles not working with Tailwind CSS
```css
/* Convert this: */
<div style="background-color: #0EA5E9; padding: 16px;">

/* To this: */
<div className="bg-blue-600 p-4">
```

**Issue:** Static HTML classes conflicting with dynamic state
```tsx
// Instead of this:
<div className="bg-blue-600 bg-red-600">

// Use conditional classes:
<div className={cn(
  "rounded-lg p-4",
  isActive ? "bg-blue-600" : "bg-gray-100"
)}>
```

**Issue:** Images not optimized
```tsx
// Use Next.js Image component instead of img tag
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority // For above-the-fold images
/>
```

### Performance Issues

**Issue:** Large bundle size
```javascript
// Use dynamic imports for large components
const WorkOrderDetails = dynamic(() => import('./WorkOrderDetails'), {
  loading: () => <div>Loading...</div>
});
```

**Issue:** Slow initial load
```javascript
// Implement code splitting and lazy loading
const Dashboard = lazy(() => import('./Dashboard'));
const WorkOrders = lazy(() => import('./WorkOrders'));
```

### Accessibility Issues

**Issue:** Missing ARIA labels
```tsx
// Add proper ARIA labels
<button
  aria-label="Start work order for conveyor belt repair"
  aria-describedby="work-order-description"
>
  Start Work
</button>
```

**Issue:** Keyboard navigation not working
```tsx
// Ensure all interactive elements are keyboard accessible
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  role="button"
  aria-label="Action description"
>
  Content
</div>
```

---

## Best Practices

### Component Design
- Follow atomic design principles
- Make components reusable and composable
- Use TypeScript for type safety
- Implement proper error boundaries
- Add loading and error states

### Performance
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Optimize images and assets
- Use code splitting and lazy loading
- Monitor bundle size regularly

### Accessibility
- Test with screen readers regularly
- Ensure keyboard navigation works
- Use semantic HTML elements
- Provide alternative text for images
- Test with high contrast mode

### Industrial Considerations
- Design for work gloves (large touch targets)
- Ensure offline functionality
- Optimize for low-light conditions
- Test with various device orientations
- Consider noisy environments (visual feedback)

---

This integration guide provides a comprehensive approach to converting your HTML designs into functional, accessible, and performant React components that integrate seamlessly with your GMAOapp architecture.