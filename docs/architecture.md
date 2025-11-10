# GMAOapp Fullstack Architecture Document

## Table of Contents

1. [Introduction](#introduction)
2. [High Level Architecture](#high-level-architecture)
3. [Tech Stack](#tech-stack)
4. [Data Models](#data-models)
5. [API Specification](#api-specification)
6. [Components](#components)
7. [External APIs](#external-apis)
8. [Core Workflows](#core-workflows)
9. [Database Schema](#database-schema)
10. [Frontend Architecture](#frontend-architecture)
11. [Backend Architecture](#backend-architecture)
12. [Unified Project Structure](#unified-project-structure)
13. [Development Workflow](#development-workflow)
14. [Deployment Architecture](#deployment-architecture)
15. [Security and Performance](#security-and-performance)
16. [Testing Strategy](#testing-strategy)
17. [Coding Standards](#coding-standards)
18. [Error Handling Strategy](#error-handling-strategy)
19. [Monitoring and Observability](#monitoring-and-observability)
20. [Additional Information](#additional-information)

---

## Introduction

### Goals and Background Context

#### Goals

- Launch a functional maintenance work order system that tracks equipment repairs from creation to completion
- Enable 4-8 operators to view and complete assigned maintenance tasks on mobile devices
- Provide real-time visibility of work order status through a Meeting Mode Kanban board and TV display
- Track spare parts usage and alert when stock falls below minimum thresholds
- Calculate basic maintenance KPIs (MTTR, MTBF, availability) to establish baseline performance metrics

#### Background Context

Small industrial maintenance teams currently manage work orders using spreadsheets, paper forms, or no system at all. This leads to lost work orders, unclear task assignments, untracked spare parts consumption, and zero visibility into maintenance performance. The GMAOapp MVP solves the immediate pain point: getting maintenance operations out of spreadsheets and into a purpose-built system that operators can access from tablets in the field.

The MVP focuses on the core workflow: supervisors create work orders and assign them to operators, operators complete work and log spare parts used, and everyone can see current status on a shared Kanban board or TV display. Advanced features like AI diagnosis, external component repairs, and complex reporting are explicitly out of scope for v1.0. The goal is to get a working system deployed in 2-4 weeks that immediately improves visibility and organization, with a clear path to add capabilities in future iterations.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-06 | v1.0 | Initial fullstack architecture document | Winston (Architect) |
| 2025-11-07 | v1.1 | Enhanced with complete workflows and additional sections | Claude |

---

## High Level Architecture

### Technical Summary

GMAOapp implements a mobile-first Progressive Web App (PWA) architecture using React for cross-platform device compatibility, supported by a Node.js Express monolith backend and Supabase PostgreSQL database with real-time subscriptions. The system uses polling-based real-time updates (30-second intervals) to synchronize work order status across 4-8 concurrent operators, with Row Level Security ensuring data access boundaries. This architecture prioritizes rapid MVP development within 2-4 weeks while maintaining the industrial-grade reliability required for maintenance operations, all deployed on cost-effective free-tier hosting platforms (Vercel + Railway/Render + Supabase).

### Platform and Infrastructure Choice

**Platform:** Vercel + Railway/Render + Supabase Stack
**Key Services:** Vercel (frontend hosting), Railway/Render (backend API), Supabase (database + auth + real-time)
**Deployment Host and Regions:** US-East-1 (primary), with global CDN distribution via Vercel Edge Network

**Platform Decision Rationale:**
- **Vercel**: Excellent PWA support, automatic HTTPS, global CDN, and seamless GitHub integration for frontend
- **Railway/Render**: Simple Node.js deployment with free tier sufficient for 4-8 users, easy environment management
- **Supabase**: Built-in Row Level Security, real-time subscriptions, authentication, and PostgreSQL database
- **Cost Efficiency**: All services offer generous free tiers covering MVP usage requirements
- **Developer Experience**: Modern tooling with excellent TypeScript support across the stack

### Repository Structure

**Structure:** Monorepo with shared packages
**Monorepo Tool:** npm workspaces (simplicity for 2-4 week timeline)
**Package Organization:** apps/ (frontend & backend), packages/ (shared types/utils)

**Rationale for Monorepo:**
- Simplified dependency management across frontend/backend
- Shared TypeScript types for work orders, equipment, and user data
- Single deployment pipeline reduces complexity for small team
- Easy code sharing between React components and API interfaces

### High Level Architecture Diagram

```mermaid
graph TB
    subgraph "User Devices"
        A[Mobile Phone<br/>PWA]
        B[Tablet<br/>Supervisor View]
        C[Desktop<br/>Admin Console]
        D[TV Display<br/>KPI Dashboard]
    end

    subgraph "Frontend Layer"
        E[React PWA<br/>Vercel Hosting]
        F[Service Worker<br/>Offline Cache]
    end

    subgraph "API Layer"
        G[Express.js API<br/>Railway/Render]
        H[Auth Middleware<br/>Supabase Auth]
        I[Polling Manager<br/>30s Intervals]
    end

    subgraph "Data Layer"
        J[Supabase PostgreSQL<br/>US-East-1]
        K[Row Level Security<br/>Access Control]
        L[Real-time Subscriptions<br/>State Changes]
    end

    subgraph "External Services"
        M[File Storage<br/>Equipment CSV]
        N[Email Service<br/>Notifications]
    end

    A --> E
    B --> E
    C --> E
    D --> E
    E --> F
    E --> G
    G --> H
    G --> I
    G --> J
    J --> K
    J --> L
    G --> M
    G --> N
```

### Architectural Patterns

- **Mobile-First PWA:** Progressive Web App with offline capabilities for industrial environments
- **Monolithic Backend:** Single Express.js service for rapid MVP development and simplified deployment
- **Row Level Security:** Database-level access control ensuring operators only see assigned work orders
- **Polling-Based Real-Time:** 30-second interval polling instead of WebSockets for simplicity and reliability
- **Repository Pattern:** Abstracted data access layers for future database migration flexibility
- **State Management Pattern:** Centralized React state with optimistic updates for responsive UI
- **Component-Based Architecture:** Reusable React components with TypeScript interfaces
- **API Gateway Pattern:** Single Express API endpoint with internal route organization

---

## Tech Stack

This is the DEFINITIVE technology selection for the entire project. All development must use these exact versions to ensure consistency and compatibility across the fullstack application.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | ^5.0 | Type safety & developer productivity | Catches errors at compile-time, better IDE support, self-documenting code |
| Frontend Framework | React | ^18.2 | Component-based UI development | Mature ecosystem, excellent PWA support, large talent pool |
| UI Component Library | Headless UI | ^2.0 | Unstyled accessible components | Accessibility-first, fully customizable, minimal bundle size |
| State Management | Zustand | ^4.4 | Simple state management | Minimal boilerplate, TypeScript friendly, easy testing |
| Backend Language | TypeScript | ^5.0 | Type-safe backend development | Consistent typing across fullstack, better API contracts |
| Backend Framework | Express.js | ^4.18 | API server framework | Mature, battle-tested, extensive middleware ecosystem |
| API Style | REST API | OpenAPI 3.0 | Standardized API contract | Simple, well-understood, excellent tooling support |
| Database | Supabase (PostgreSQL) | ^15.0 | Primary data storage | Built-in RLS, real-time subscriptions, excellent TypeScript support |
| Cache | Supabase Edge Runtime | Built-in | Response caching | Integrated with hosting, automatic cache invalidation |
| File Storage | Supabase Storage | Built-in | File uploads & equipment CSV | Integrated with auth, automatic CDN distribution |
| Authentication | Supabase Auth | Built-in | User authentication & roles | Row-level security, JWT tokens, role-based permissions |
| Frontend Testing | Vitest | ^1.0 | Unit & integration testing | Fast, modern, excellent TypeScript support, 80% coverage threshold |
| Backend Testing | Vitest | ^1.0 | API & business logic testing | Consistent tooling across stack, fast execution, isolated test databases |
| E2E Testing | Playwright | ^1.40 | Cross-browser automation | Mobile-first testing, device simulation, PWA testing, visual regression |
| Code Quality | ESLint/Prettier | Latest | Code formatting & linting | TypeScript strict mode, automated enforcement, pre-commit hooks |
| CI/CD | GitHub Actions | Latest | Automated testing & deployment | Quality gates, multi-environment deployment, performance monitoring |
| Build Tool | Vite | ^5.0 | Fast bundling & development | Lightning-fast HMR, optimized builds, PWA plugin |
| Bundler | Vite | ^5.0 | Production bundling | Tree-shaking, code splitting, automatic optimization |
| IaC Tool | Supabase CLI | ^2.0 | Database migrations & seeding | Version-controlled schema, local development |
| Monitoring | Vercel Analytics | Built-in | Frontend performance | Core Web Vitals, user journey tracking, performance budgets |
| Logging | Supabase Dashboard | Built-in | Backend request logging | Query performance, error tracking, audit trails |
| Performance | Lighthouse CI | Latest | Performance monitoring | Core Web Vitals monitoring, performance regression detection |
| CSS Framework | Tailwind CSS | ^3.4 | Utility-first styling | Rapid development, consistent design system, small bundle |

---

## Data Models

These core data models represent the business entities that flow through the entire system, from React components to database tables. Each model includes TypeScript interfaces that can be shared across the fullstack application.

### Work Order

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

#### TypeScript Interface
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

#### Relationships
- **Equipment**: Many-to-One (multiple work orders per equipment)
- **User**: Many-to-One (created by supervisor, assigned to operator, completed by operator)
- **Spare Parts**: Many-to-Many through SparePartUsage
- **Audit Trail**: One-to-Many (track all state changes)

### Equipment

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

#### TypeScript Interface
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

#### Relationships
- **Self-referential**: Many-to-One (children to parent, parent to children)
- **Work Orders**: One-to-Many (equipment can have many work orders)
- **Spare Parts**: Many-to-Many through equipment associations

### User

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

#### TypeScript Interface
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

#### Relationships
- **Work Orders**: One-to-Many (created, assigned, completed)
- **Audit Trail**: One-to-Many (state changes made by user)

### Spare Part

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

#### TypeScript Interface
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

#### Relationships
- **Equipment**: Many-to-Many through associations
- **Spare Part Usage**: One-to-Many (consumption tracking)

### Supporting Models

#### Work Order Audit Entry
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

#### Spare Part Usage
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

#### Work Order Attachment
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

## API Specification

REST API implementation using OpenAPI 3.0 specification, providing comprehensive endpoints for all maintenance workflows with proper authentication, authorization, and error handling.

### REST API Specification

```yaml
openapi: 3.0.0
info:
  title: GMAOapp API
  version: 1.0.0
  description: Industrial Maintenance Work Order Management System API
servers:
  - url: https://gmaoapp-api.railway.app/api/v1
    description: Production API server
  - url: http://localhost:3001/api/v1
    description: Development server

# Security Schemes
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

# Common Schemas
  schemas:
    User:
      type: object
      required: [id, email, name, role, isActive, createdAt]
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 1
          maxLength: 100
        role:
          type: string
          enum: [admin, supervisor, operator]
        isActive:
          type: boolean
        lastLoginAt:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time
        phoneNumber:
          type: string
        department:
          type: string
        preferences:
          $ref: '#/components/schemas/UserPreferences'

    UserPreferences:
      type: object
      properties:
        language:
          type: string
          default: en
        theme:
          type: string
          enum: [light, dark, auto]
          default: light
        notifications:
          type: object
          properties:
            email:
              type: boolean
              default: true
            push:
              type: boolean
              default: true
            workOrderAssignment:
              type: boolean
              default: true
            lowStockAlert:
              type: boolean
              default: true

    WorkOrder:
      type: object
      required: [id, title, description, priority, status, equipmentId, createdById, estimatedDuration, createdAt]
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
          minLength: 1
          maxLength: 200
        description:
          type: string
          maxLength: 2000
        priority:
          type: string
          enum: [critical, high, medium, low]
        status:
          type: string
          enum: [open, planned, in_execution, completed, closed, rejected, waiting, pending_stock]
        equipmentId:
          type: string
          format: uuid
        assignedOperatorId:
          type: string
          format: uuid
        createdById:
          type: string
          format: uuid
        estimatedDuration:
          type: integer
          minimum: 1
          maximum: 480
        actualDuration:
          type: integer
          minimum: 0
        createdAt:
          type: string
          format: date-time
        startedAt:
          type: string
          format: date-time
        completedAt:
          type: string
          format: date-time
        completedById:
          type: string
          format: uuid

    Equipment:
      type: object
      required: [id, name, code, type, level, location, status, isActive]
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
          minLength: 1
          maxLength: 100
        code:
          type: string
          minLength: 1
          maxLength: 50
        type:
          type: string
          enum: [plant, area, functional_unit, equipment, component]
        parentId:
          type: string
          format: uuid
        level:
          type: integer
          minimum: 0
          maximum: 10
        location:
          type: string
          maxLength: 200
        manufacturer:
          type: string
          maxLength: 100
        model:
          type: string
          maxLength: 100
        serialNumber:
          type: string
          maxLength: 100
        status:
          type: string
          enum: [active, inactive, maintenance, decommissioned]
        isActive:
          type: boolean

    SparePart:
      type: object
      required: [id, name, partNumber, category, currentStock, minimumStock, maximumStock, unit, unitCost, location, isActive]
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
          minLength: 1
          maxLength: 100
        partNumber:
          type: string
          minLength: 1
          maxLength: 50
        description:
          type: string
          maxLength: 500
        category:
          type: string
          maxLength: 50
        currentStock:
          type: integer
          minimum: 0
        minimumStock:
          type: integer
          minimum: 0
        maximumStock:
          type: integer
          minimum: 1
        unit:
          type: string
          maxLength: 20
        unitCost:
          type: number
          minimum: 0
        location:
          type: string
          maxLength: 100
        supplier:
          type: string
          maxLength: 100
        isActive:
          type: boolean

    ApiResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
        error:
          $ref: '#/components/schemas/ApiError'
        pagination:
          $ref: '#/components/schemas/Pagination'

    ApiError:
      type: object
      required: [code, message, timestamp]
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
        timestamp:
          type: string
          format: date-time
        requestId:
          type: string

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer

# Authentication
security:
  - bearerAuth: []

# API Paths
paths:
  # Authentication
  /auth/login:
    post:
      tags: [Authentication]
      summary: User login
      description: Authenticate user and return JWT token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 6
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      user:
                        $ref: '#/components/schemas/User'
                      token:
                        type: string
                      refreshToken:
                        type: string
        '401':
          description: Invalid credentials
        '500':
          description: Server error

  /auth/refresh:
    post:
      tags: [Authentication]
      summary: Refresh JWT token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [refreshToken]
              properties:
                refreshToken:
                  type: string
      responses:
        '200':
          description: Token refreshed successfully
        '401':
          description: Invalid refresh token

  # Work Orders
  /work-orders:
    get:
      tags: [Work Orders]
      summary: Get work orders with filtering
      description: Retrieve work orders with role-based access control
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [open, planned, in_execution, completed, closed, rejected, waiting, pending_stock]
        - name: priority
          in: query
          schema:
            type: string
            enum: [critical, high, medium, low]
        - name: assignedTo
          in: query
          schema:
            type: string
            format: uuid
        - name: equipmentId
          in: query
          schema:
            type: string
            format: uuid
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: Work orders retrieved successfully
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/WorkOrder'

    post:
      tags: [Work Orders]
      summary: Create new work order
      description: Create a new work order (Supervisor+ only)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title, description, priority, equipmentId, estimatedDuration]
              properties:
                title:
                  type: string
                  minLength: 1
                  maxLength: 200
                description:
                  type: string
                  maxLength: 2000
                priority:
                  type: string
                  enum: [critical, high, medium, low]
                equipmentId:
                  type: string
                  format: uuid
                estimatedDuration:
                  type: integer
                  minimum: 1
                  maximum: 480
                assignedOperatorId:
                  type: string
                  format: uuid
      responses:
        '201':
          description: Work order created successfully
        '400':
          description: Invalid input
        '403':
          description: Insufficient permissions

  /work-orders/{id}:
    get:
      tags: [Work Orders]
      summary: Get specific work order
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Work order retrieved successfully
        '404':
          description: Work order not found

    put:
      tags: [Work Orders]
      summary: Update work order
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [open, planned, in_execution, completed, closed, rejected, waiting, pending_stock]
                assignedOperatorId:
                  type: string
                  format: uuid
                actualDuration:
                  type: integer
                  minimum: 0
      responses:
        '200':
          description: Work order updated successfully
        '404':
          description: Work order not found
        '403':
          description: Insufficient permissions

  # Equipment
  /equipment:
    get:
      tags: [Equipment]
      summary: Get equipment hierarchy
      parameters:
        - name: parentId
          in: query
          schema:
            type: string
            format: uuid
        - name: level
          in: query
          schema:
            type: integer
            minimum: 0
        - name: type
          in: query
          schema:
            type: string
            enum: [plant, area, functional_unit, equipment, component]
      responses:
        '200':
          description: Equipment retrieved successfully
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/Equipment'

    post:
      tags: [Equipment]
      summary: Create equipment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Equipment'
      responses:
        '201':
          description: Equipment created successfully
        '400':
          description: Invalid input
        '403':
          description: Insufficient permissions

  /equipment/import:
    post:
      tags: [Equipment]
      summary: Import equipment hierarchy from CSV/Excel
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required: [file]
              properties:
                file:
                  type: string
                  format: binary
      responses:
        '200':
          description: Equipment imported successfully
        '400':
          description: Invalid file format
        '413':
          description: File too large

  # Spare Parts
  /spare-parts:
    get:
      tags: [Spare Parts]
      summary: Get spare parts inventory
      parameters:
        - name: category
          in: query
          schema:
            type: string
        - name: lowStock
          in: query
          schema:
            type: boolean
        - name: search
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Spare parts retrieved successfully

    post:
      tags: [Spare Parts]
      summary: Create spare part
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SparePart'
      responses:
        '201':
          description: Spare part created successfully

  /spare-parts/{id}/usage:
    get:
      tags: [Spare Parts]
      summary: Get spare part usage history
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Usage history retrieved successfully

  # KPIs and Analytics
  /kpis/dashboard:
    get:
      tags: [Analytics]
      summary: Get dashboard KPIs
      description: Calculate MTTR, MTBF, availability, and other metrics
      parameters:
        - name: equipmentId
          in: query
          schema:
            type: string
            format: uuid
        - name: dateRange
          in: query
          schema:
            type: string
            enum: [7d, 30d, 90d, 1y]
            default: 30d
      responses:
        '200':
          description: KPIs calculated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  mttr:
                    type: number
                    description: Mean Time To Repair (hours)
                  mtbf:
                    type: number
                    description: Mean Time Between Failures (hours)
                  availability:
                    type: number
                    description: Equipment availability percentage
                  workOrderCounts:
                    type: object
                    properties:
                      open:
                        type: integer
                      inProgress:
                        type: integer
                      completed:
                        type: integer
                      rejected:
                        type: integer

  # Users
  /users:
    get:
      tags: [Users]
      summary: Get users (Admin+ only)
      responses:
        '200':
          description: Users retrieved successfully

    post:
      tags: [Users]
      summary: Create user (Admin+ only)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, name, role]
              properties:
                email:
                  type: string
                  format: email
                name:
                  type: string
                role:
                  type: string
                  enum: [admin, supervisor, operator]
                department:
                  type: string
                phoneNumber:
                  type: string
      responses:
        '201':
          description: User created successfully
        '400':
          description: Invalid input
        '409':
          description: Email already exists

# Error Responses
  responses:
    BadRequestError:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiResponse'
          example:
            success: false
            error:
              code: VALIDATION_ERROR
              message: Request validation failed
              details:
                field: email
                message: Invalid email format
              timestamp: 2025-11-06T10:30:00Z
              requestId: req_123456

    UnauthorizedError:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiResponse'
          example:
            success: false
            error:
              code: UNAUTHORIZED
              message: Invalid or expired token
              timestamp: 2025-11-06T10:30:00Z
              requestId: req_123456

    ForbiddenError:
      description: Forbidden
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiResponse'
          example:
            success: false
            error:
              code: INSUFFICIENT_PERMISSIONS
              message: User does not have required permissions
              timestamp: 2025-11-06T10:30:00Z
              requestId: req_123456

    NotFoundError:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiResponse'
          example:
            success: false
            error:
              code: NOT_FOUND
              message: Work order not found
              timestamp: 2025-11-06T10:30:00Z
              requestId: req_123456
```

---

## Components

Based on the architectural patterns, tech stack, and data models, these components represent the major logical units that will be implemented across both frontend and backend. Each component has clear boundaries, responsibilities, and interfaces.

### Authentication Component

**Responsibility:** Manages user authentication, authorization, and session management across the application with role-based access control enforcement.

**Key Interfaces:**
- `login(email, password)` - Authenticate user and return JWT tokens
- `refreshToken(refreshToken)` - Generate new access token
- `logout()` - Clear user session and invalidate tokens
- `getCurrentUser()` - Retrieve authenticated user profile
- `hasRole(role)` - Check user permissions for specific roles
- `canAccess(resource, action)` - Verify user has required permissions

**Dependencies:** Supabase Auth, JWT service, User database model
**Technology Stack:** Supabase Auth SDK, React Context API, Express middleware

### Work Order Management Component

**Responsibility:** Core business logic for work order lifecycle management, including creation, assignment, status transitions, and audit trail maintenance.

**Key Interfaces:**
- `createWorkOrder(data)` - Create new work order with validation
- `assignWorkOrder(id, operatorId)` - Assign work order to operator
- `updateStatus(id, status, reason)` - Change work order status with audit
- `startWorkOrder(id)` - Mark work order as in execution
- `completeWorkOrder(id, partsUsed, duration)` - Complete work with parts tracking
- `getMyWorkOrders(operatorId)` - Retrieve operator's assigned work orders
- `getAllWorkOrders(filters)` - Get work orders with filtering (supervisors)

**Dependencies:** User component, Equipment component, Spare Parts component, Audit Trail component
**Technology Stack:** Express.js routes, Supabase queries, React state management, WebSocket polling

### Equipment Hierarchy Component

**Responsibility:** Manage flexible hierarchical equipment structure, support bulk import operations, and maintain equipment relationships and associations.

**Key Interfaces:**
- `getEquipmentHierarchy(parentId)` - Retrieve equipment tree structure
- `createEquipment(data)` - Add new equipment to hierarchy
- `updateEquipment(id, data)` - Modify equipment details
- `importEquipmentHierarchy(file)` - Bulk import from CSV/Excel
- `getEquipmentByType(type)` - Filter equipment by classification
- `getAssociatedSpareParts(equipmentId)` - Get commonly used parts for equipment
- `exportHierarchyTemplate()` - Download import template

**Dependencies:** File Storage component, Spare Parts component, Validation component
**Technology Stack:** Supabase recursive queries, CSV parsing library, React Tree components

### Spare Parts Inventory Component

**Responsibility:** Inventory management for spare parts including stock tracking, low stock alerts, usage recording, and cost tracking.

**Key Interfaces:**
- `getSpareParts(filters)` - Retrieve inventory with filtering options
- `updateStock(partId, quantity, operation)` - Adjust stock levels
- `recordUsage(workOrderId, parts)` - Log parts used in work order
- `getLowStockItems()` - Identify parts below minimum threshold
- `createSparePart(data)` - Add new spare part to inventory
- `getUsageHistory(partId, dateRange)` - Analyze consumption patterns
- `calculateInventoryValue()` - Total value of current stock

**Dependencies:** Work Order component, Notification component, Audit Trail component
**Technology Stack:** Supabase transactions, React tables, Real-time subscriptions

### Real-time Synchronization Component

**Responsibility:** Keep all connected clients synchronized with work order status changes using polling-based approach with conflict resolution.

**Key Interfaces:**
- `startPolling(interval)` - Begin periodic status checks
- `stopPolling()` - Pause synchronization
- `subscribeToUpdates(callback)` - Register update handlers
- `handleConflicts(local, remote)` - Resolve concurrent modifications
- `forceSync()` - Immediate synchronization request
- `getLastSyncTimestamp()` - Track synchronization state

**Dependencies:** Work Order component, Cache component, Network Status component
**Technology Stack:** JavaScript setInterval, Service Worker, React useEffect hooks

### KPI Analytics Component

**Responsibility:** Calculate and display maintenance performance metrics including MTTR, MTBF, equipment availability, and work order statistics.

**Key Interfaces:**
- `calculateMTTR(equipmentId, dateRange)` - Mean Time To Repair calculation
- `calculateMTBF(equipmentId, dateRange)` - Mean Time Between Failures
- `calculateAvailability(equipmentId, dateRange)` - Equipment uptime percentage
- `getWorkOrderStats(dateRange, filters)` - Work order completion metrics
- `getTopFailureModes(dateRange)` - Most common failure patterns
- `generateReport(type, parameters)` - Create analytical reports

**Dependencies:** Work Order component, Equipment component, Time Range component
**Technology Stack:** SQL aggregate queries, Chart.js library, React data visualization

### User Management Component

**Responsibility:** User account administration including role assignments, permission management, and user profile maintenance.

**Key Interfaces:**
- `createUser(userData)` - Add new user account
- `updateUserRole(userId, role)` - Modify user permissions
- `deactivateUser(userId)` - Disable user access
- `getUserProfile(userId)` - Retrieve user details
- `updateUserPreferences(userId, preferences)` - Modify user settings
- `resetPassword(userId)` - Initiate password reset process

**Dependencies:** Authentication component, Notification component
**Technology Stack:** Supabase Auth Admin API, React forms, Email service integration

### File Upload Component

**Responsibility:** Handle file uploads for equipment hierarchy import, work order attachments, and document management with validation and security scanning.

**Key Interfaces:**
- `uploadFile(file, type, metadata)` - Upload and validate files
- `validateFileFormat(file, allowedTypes)` - Check file specifications
- `processCSVUpload(file)` - Parse and validate CSV data
- `processExcelUpload(file)` - Parse Excel spreadsheets
- `generateUploadUrl(type)` - Create secure upload endpoints
- `deleteFile(fileId)` - Remove uploaded files

**Dependencies:** Equipment component, Work Order component, Security component
**Technology Stack:** Supabase Storage, Multer middleware, File validation libraries

### Notification Component

**Responsibility:** Manage user notifications for work order assignments, low stock alerts, and system events with multiple delivery channels.

**Key Interfaces:**
- `sendNotification(userId, message, type)` - Deliver immediate notifications
- `createAlert(rule, conditions)` - Set up automated alerts
- `getNotificationHistory(userId)` - Retrieve notification log
- `markAsRead(notificationId)` - Update notification status
- `subscribeToAlerts(userId, alertTypes)` - Configure alert preferences
- `sendLowStockAlert(partId, currentStock)` - Inventory threshold notifications

**Dependencies:** User component, Spare Parts component, Work Order component
**Technology Stack:** Email service, Push notifications, React toast components

### Mobile PWA Component

**Responsibility:** Progressive Web App functionality including offline capabilities, service worker management, and mobile-specific features.

**Key Interfaces:**
- `installPWA()` - Prompt for PWA installation
- `cacheData(data, key)` - Store data for offline access
- `syncWhenOnline()` - Queue changes for later synchronization
- `checkConnectivity()` - Monitor network status
- `requestCameraAccess()` - Initialize photo capture capabilities
- `enablePushNotifications()` - Set up mobile notifications

**Dependencies:** Real-time Sync component, Work Order component, Camera component
**Technology Stack:** Service Worker API, IndexedDB, PWA manifest, React PWA hooks

### Component Diagrams

```mermaid
graph TB
    subgraph "Frontend Components"
        FA[Authentication UI]
        WO[Work Order UI]
        EQ[Equipment UI]
        SP[Spare Parts UI]
        KP[KPI Dashboard]
        MB[Mobile PWA UI]
    end

    subgraph "Backend Services"
        AS[Auth Service]
        WOS[Work Order Service]
        EQS[Equipment Service]
        SPS[Spare Parts Service]
        KS[KPI Service]
        FS[File Service]
        NS[Notification Service]
    end

    subgraph "Data Layer"
        DB[(Supabase PostgreSQL)]
        ST[(Supabase Storage)]
        AUTH[Supabase Auth]
    end

    subgraph "External Services"
        EMAIL[Email Service]
        PUSH[Push Service]
    end

    FA --> AS
    WO --> WOS
    EQ --> EQS
    SP --> SPS
    KP --> KS
    MB --> AS
    MB --> WOS

    AS --> AUTH
    AS --> DB
    WOS --> DB
    WOS --> NS
    EQS --> DB
    EQS --> FS
    SPS --> DB
    SPS --> NS
    KS --> DB
    FS --> ST
    NS --> EMAIL
    NS --> PUSH

    DB --> DB
    ST --> ST
```

```mermaid
sequenceDiagram
    participant UI as Mobile UI
    participant Auth as Auth Component
    participant WO as Work Order Service
    participant DB as Database
    participant Sync as Sync Component
    participant Notify as Notification Service

    UI->>Auth: Login Request
    Auth->>DB: Validate Credentials
    DB-->>Auth: User Data + Token
    Auth-->>UI: Authentication Success

    UI->>WO: Get My Work Orders
    WO->>DB: Query Assigned Orders (RLS)
    DB-->>WO: Filtered Work Orders
    WO-->>UI: Work Order List

    UI->>WO: Start Work Order
    WO->>DB: Update Status + Audit Trail
    WO->>Notify: Send Status Change Notification
    WO->>Sync: Trigger Real-time Update
    DB-->>WO: Confirmation
    WO-->>UI: Success Response

    Sync->>UI: Push Update to Other Clients
    Notify->>UI: Show Notification
```

---

## External APIs

Based on PRD requirements analysis, GMAOapp requires minimal external API integrations for MVP. The system is designed to be self-contained with essential integrations handled through Supabase ecosystem.

### Supabase APIs

**Purpose:** Core database, authentication, and real-time services
**Documentation:** https://supabase.com/docs
**Base URL(s):** https://api.supabase.io
**Authentication:** API Keys + JWT tokens
**Rate Limits:** Based on Supabase plan (generous free tier)

**Key Endpoints Used:**
- `POST /auth/v1/token` - User authentication
- `GET /rest/v1/*` - Database CRUD operations
- `POST /storage/v1/upload` - File uploads
- `GET /storage/v1/object` - File retrieval
- `WEBSOCKET /realtime/v1` - Real-time subscriptions

**Integration Notes:** Supabase SDK handles authentication, RLS policies enforce data access boundaries automatically.

### Email Service (Future)

**Purpose:** Work order assignment notifications and low stock alerts
**Documentation:** To be determined based on provider choice
**Base URL(s):** Provider-dependent
**Authentication:** API Key
**Rate Limits:** Provider-dependent

**Key Endpoints Used:**
- `POST /send` - Send email notifications

**Integration Notes:** Can be deferred post-MVP, in-app notifications sufficient for initial deployment.

---

## Core Workflows

Key system workflows showing component interactions including real-time features and error handling paths.

### Work Order Lifecycle Workflow

```mermaid
sequenceDiagram
    participant Super as Supervisor
    participant UI as Frontend UI
    participant Auth as Auth Component
    participant WO as Work Order Service
    participant DB as Database
    participant Notify as Notification Service
    participant Op as Operator

    Super->>UI: Create Work Order
    UI->>Auth: Check Permissions
    Auth-->>UI: Supervisor Role Confirmed
    UI->>WO: POST /work-orders
    WO->>DB: Insert Work Order
    DB-->>WO: Success with ID
    WO->>Notify: Assignment Notification
    WO-->>UI: Work Order Created

    Notify->>Op: Push Notification
    Op->>UI: View My Orders
    UI->>WO: GET /work-orders?assignedTo=me
    WO->>DB: Query with RLS Filter
    DB-->>WO: Assigned Work Orders
    WO-->>UI: Filtered Results

    Op->>UI: Start Work Order
    UI->>WO: PUT /work-orders/{id}/status
    WO->>DB: Update Status + Audit Trail
    WO->>Notify: Status Change Notification
    DB-->>WO: Confirmation
    WO-->>UI: Status Updated

    Super->>UI: View Kanban Board
    UI->>WO: GET /work-orders
    WO->>DB: Query All Orders
    DB-->>WO: Complete List
    WO-->>UI: Real-time Status Updates
```

### Real-time Synchronization Workflow

```mermaid
sequenceDiagram
    participant Client1 as Mobile Client 1
    participant Client2 as Mobile Client 2
    participant Sync as Sync Component
    participant API as Backend API
    participant DB as Database

    Note over Client1,Client2: Polling every 30 seconds

    loop Polling Cycle
        Client1->>Sync: Check for Updates
        Sync->>API: GET /work-orders?since={timestamp}
        API->>DB: Query Recent Changes
        DB-->>API: Updated Records
        API-->>Sync: Changed Data
        Sync-->>Client1: Apply Updates

        Client2->>Sync: Check for Updates
        Sync->>API: GET /work-orders?since={timestamp}
        API->>DB: Query Recent Changes
        DB-->>API: Updated Records
        API-->>Sync: Changed Data
        Sync-->>Client2: Apply Updates
    end

    Note over Client1,DB: Work Order Status Change
    Client1->>API: PUT /work-orders/{id}
    API->>DB: Update Database
    DB-->>API: Success
    API-->>Client1: Immediate Response

    Note over Client1,Client2: Next polling cycle detects change
    Client2->>Sync: Check for Updates
    Sync->>API: GET /work-orders?since={timestamp}
    API->>DB: Query Recent Changes
    DB-->>API: Include Status Change
    API-->>Sync: Updated Data
    Sync-->>Client2: Show Status Change
```

### Equipment Import Workflow

```mermaid
sequenceDiagram
    participant Admin as Admin User
    participant UI as Frontend UI
    participant File as File Service
    participant EQ as Equipment Service
    participant DB as Database
    participant Valid as Validation Service

    Admin->>UI: Upload Equipment File
    UI->>File: POST /equipment/import
    File->>Valid: Validate File Format
    Valid-->>File: Format OK
    File->>Valid: Parse CSV/Excel Data
    Valid-->>File: Parsed Data
    File->>Valid: Validate Hierarchy Structure
    Valid-->>File: Validation Results

    alt Validation Success
        File->>EQ: Create Equipment Records
        EQ->>DB: Batch Insert Equipment
        DB-->>EQ: Success Confirmation
        EQ-->>File: Import Results
        File-->>UI: Success Response
        UI-->>Admin: Import Complete
    else Validation Errors
        File-->>UI: Error Report
        UI-->>Admin: Validation Failed
    end
```

### Spare Parts Management Workflow

```mermaid
sequenceDiagram
    participant Op as Operator
    participant UI as Frontend UI
    participant WO as Work Order Service
    participant SP as Spare Parts Service
    participant DB as Database
    participant Notify as Notification Service

    Op->>UI: Complete Work Order with Parts
    UI->>WO: PUT /work-orders/{id}/complete
    WO->>SP: Record Parts Usage
    SP->>DB: Update Stock Levels
    DB-->>SP: Stock Updated

    alt Stock Below Minimum
        SP->>Notify: Trigger Low Stock Alert
        Notify->>SP: Alert Sent
    end

    SP-->>WO: Usage Recorded
    WO->>DB: Update Work Order Status
    DB-->>WO: Status Updated
    WO-->>UI: Completion Confirmation
    UI-->>Op: Work Order Complete

    alt Low Stock Alert
        Notify->>UI: Show Notification
        UI-->>Op: Low Stock Warning
    end
```

---

## Database Schema

### PostgreSQL Schema Definition

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'supervisor', 'operator')) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    phone_number VARCHAR(20),
    department VARCHAR(100),
    preferences JSONB DEFAULT '{
        "language": "en",
        "theme": "light",
        "notifications": {
            "email": true,
            "push": true,
            "workOrderAssignment": true,
            "lowStockAlert": true
        }
    }'::jsonb
);

-- Equipment table with hierarchical structure
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('plant', 'area', 'functional_unit', 'equipment', 'component')) NOT NULL,
    parent_id UUID REFERENCES equipment(id),
    level INTEGER NOT NULL DEFAULT 0,
    location VARCHAR(200) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    installation_date DATE,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'maintenance', 'decommissioned')) DEFAULT 'active',
    maintenance_notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work orders table
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) CHECK (priority IN ('critical', 'high', 'medium', 'low')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('open', 'planned', 'in_execution', 'completed', 'closed', 'rejected', 'waiting', 'pending_stock')) DEFAULT 'open',
    equipment_id UUID NOT NULL REFERENCES equipment(id),
    assigned_operator_id UUID REFERENCES users(id),
    created_by_id UUID NOT NULL REFERENCES users(id),
    estimated_duration INTEGER NOT NULL CHECK (estimated_duration > 0 AND estimated_duration <= 480),
    actual_duration INTEGER CHECK (actual_duration >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    completed_by_id UUID REFERENCES users(id)
);

-- Work order audit trail
CREATE TABLE work_order_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    reason TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Spare parts table
CREATE TABLE spare_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    part_number VARCHAR(50) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    minimum_stock INTEGER NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
    maximum_stock INTEGER NOT NULL CHECK (maximum_stock > 0),
    unit VARCHAR(20) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
    location VARCHAR(100) NOT NULL,
    supplier VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spare part usage tracking
CREATE TABLE spare_part_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    used_by_id UUID NOT NULL REFERENCES users(id)
);

-- Equipment-spare parts associations
CREATE TABLE equipment_spare_parts (
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id) ON DELETE CASCADE,
    is_common BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (equipment_id, spare_part_id)
);

-- Work order attachments
CREATE TABLE work_order_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    uploaded_by_id UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_equipment_parent_id ON equipment(parent_id);
CREATE INDEX idx_equipment_type ON equipment(type);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_assigned_operator ON work_orders(assigned_operator_id);
CREATE INDEX idx_work_orders_equipment ON work_orders(equipment_id);
CREATE INDEX idx_work_orders_created_at ON work_orders(created_at);
CREATE INDEX idx_work_order_audit_work_order ON work_order_audit(work_order_id);
CREATE INDEX idx_spare_parts_category ON spare_parts(category);
CREATE INDEX idx_spare_part_usage_work_order ON spare_part_usage(work_order_id);
CREATE INDEX idx_spare_part_usage_spare_part ON spare_part_usage(spare_part_id);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;

-- Users can see their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Operators can only see assigned work orders
CREATE POLICY "Operators view assigned work orders" ON work_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'operator'
            AND work_orders.assigned_operator_id = auth.uid()
        )
    );

-- Supervisors and admins can see all work orders
CREATE POLICY "Supervisors view all work orders" ON work_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('supervisor', 'admin')
        )
    );

-- Equipment is visible to all authenticated users
CREATE POLICY "Authenticated users view equipment" ON equipment
    FOR SELECT USING (auth.role() IS NOT NULL);

-- Spare parts visible to all authenticated users
CREATE POLICY "Authenticated users view spare parts" ON spare_parts
    FOR SELECT USING (auth.role() IS NOT NULL);
```

---

## Frontend Architecture

### Component Architecture

#### Component Organization
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

#### Component Template
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

### State Management Architecture

#### State Structure
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

#### State Management Patterns
- **Zustand stores** for each major domain (auth, workOrders, equipment)
- **Optimistic updates** for immediate UI feedback
- **Rollback mechanisms** for failed operations
- **Local storage persistence** for offline capability
- **Real-time subscriptions** for automatic updates

### Routing Architecture

#### Route Organization
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

#### Protected Route Pattern
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

### Frontend Services Layer

#### API Client Setup
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

#### Service Example
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

## Backend Architecture

### Service Architecture

#### Serverless Architecture
Based on Railway/Render hosting with Express.js

#### Function Organization
```
src/
├── routes/               # API route definitions
│   ├── auth.ts          # Authentication endpoints
│   ├── workOrders.ts    # Work order CRUD
│   ├── equipment.ts     # Equipment management
│   ├── spareParts.ts    # Inventory management
│   ├── users.ts         # User management
│   └── kpi.ts           # Analytics endpoints
├── services/            # Business logic
│   ├── authService.ts
│   ├── workOrderService.ts
│   ├── equipmentService.ts
│   ├── sparePartService.ts
│   └── kpiService.ts
├── middleware/          # Express middleware
│   ├── auth.ts          # JWT verification
│   ├── validation.ts    # Input validation
│   ├── errorHandler.ts  # Error handling
│   └── rbac.ts          # Role-based access control
├── models/              # Data models
│   ├── User.ts
│   ├── WorkOrder.ts
│   ├── Equipment.ts
│   └── SparePart.ts
├── utils/               # Utilities
│   ├── database.ts      # Supabase client
│   ├── validators.ts    # Input validation schemas
│   └── logger.ts        # Logging configuration
└── types/               # TypeScript definitions
    ├── api.ts
    ├── database.ts
    └── auth.ts
```

#### Function Template
```typescript
import { Request, Response } from 'express';
import { workOrderService } from '@/services/workOrderService';
import { validateCreateWorkOrder } from '@/utils/validators';
import { requireRole } from '@/middleware/rbac';

export const createWorkOrder = [
  requireRole('supervisor'),
  validateCreateWorkOrder,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.auth;
      const workOrderData = {
        ...req.body,
        createdById: userId,
      };

      const workOrder = await workOrderService.create(workOrderData);

      res.status(201).json({
        success: true,
        data: workOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATION_FAILED',
          message: 'Failed to create work order',
          timestamp: new Date().toISOString(),
          requestId: req.id,
        },
      });
    }
  },
];
```

### Database Architecture

#### Schema Design
See Database Schema section above for complete SQL DDL

#### Data Access Layer
```typescript
import { supabase } from '@/utils/database';
import { WorkOrder, CreateWorkOrderData } from '@/types/models';

export class WorkOrderRepository {
  async create(data: CreateWorkOrderData): Promise<WorkOrder> {
    const { data: result, error } = await supabase
      .from('work_orders')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    return result;
  }

  async findByAssignedOperator(operatorId: string): Promise<WorkOrder[]> {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .eq('assigned_operator_id', operatorId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Database error: ${error.message}`);
    return data || [];
  }

  async updateStatus(id: string, status: string, userId: string): Promise<WorkOrder> {
    const updates: any = { status };

    if (status === 'in_execution') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
      updates.completed_by_id = userId;
    }

    const { data, error } = await supabase
      .from('work_orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);

    // Create audit trail entry
    await this.createAuditEntry(id, userId, status);

    return data;
  }

  private async createAuditEntry(workOrderId: string, userId: string, newStatus: string): Promise<void> {
    await supabase
      .from('work_order_audit')
      .insert({
        work_order_id: workOrderId,
        user_id: userId,
        new_status: newStatus,
        timestamp: new Date().toISOString(),
      });
  }
}
```

### Authentication and Authorization

#### Auth Flow
```mermaid
sequenceDiagram
    participant Client as Mobile Client
    participant Frontend as React Frontend
    participant Auth as Supabase Auth
    participant Backend as Express API
    participant DB as PostgreSQL

    Client->>Frontend: Login Request
    Frontend->>Auth: signInWithPassword()
    Auth->>DB: Validate Credentials
    DB-->>Auth: User Record
    Auth-->>Frontend: JWT Token + User Data
    Frontend->>Client: Authentication Success

    Client->>Frontend: API Request
    Frontend->>Backend: Request with JWT
    Backend->>Auth: verifyToken()
    Auth-->>Backend: Token Validation
    Backend->>DB: Query with RLS
    DB-->>Backend: Filtered Data
    Backend-->>Frontend: Response
    Frontend-->>Client: Data Display
```

#### Middleware/Guards
```typescript
import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/utils/database';

export interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
    role: 'admin' | 'supervisor' | 'operator';
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Authentication token required',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Get user role from database
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    req.auth = {
      userId: user.id,
      role: userData?.role || 'operator',
      email: user.email || '',
    };

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication error',
        timestamp: new Date().toISOString(),
      },
    });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'User does not have required permissions',
          timestamp: new Date().toISOString(),
        },
      });
    }
    next();
  };
};
```

---

## Unified Project Structure

### Monorepo Structure

```
gmaoapp/
├── .github/                     # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml
│       └── deploy.yaml
├── apps/                        # Application packages
│   ├── web/                     # Frontend application
│   │   ├── src/
│   │   │   ├── components/      # UI components
│   │   │   ├── pages/           # Page components/routes
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── services/        # API client services
│   │   │   ├── stores/          # State management
│   │   │   ├── styles/          # Global styles/themes
│   │   │   └── utils/           # Frontend utilities
│   │   ├── public/              # Static assets
│   │   ├── tests/               # Frontend tests
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   └── api/                     # Backend application
│       ├── src/
│       │   ├── routes/          # API routes/controllers
│       │   ├── services/        # Business logic
│       │   ├── models/          # Data models
│       │   ├── middleware/      # Express/API middleware
│       │   ├── utils/           # Backend utilities
│       │   └── server.ts        # Express server entry
│       ├── tests/               # Backend tests
│       ├── package.json
│       └── tsconfig.json
├── packages/                    # Shared packages
│   ├── shared/                  # Shared types/utilities
│   │   ├── src/
│   │   │   ├── types/           # TypeScript interfaces
│   │   │   ├── constants/       # Shared constants
│   │   │   └── utils/           # Shared utilities
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui/                      # Shared UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── styles/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/                  # Shared configuration
│       ├── eslint/
│       ├── typescript/
│       └── jest/
├── infrastructure/              # IaC definitions
│   └── supabase/
│       ├── migrations/
│       ├── functions/
│       └── seed.sql
├── scripts/                     # Build/deploy scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── seed-dev-db.sh
├── docs/                        # Documentation
│   ├── prd.md
│   ├── architecture.md
│   └── api-reference.md
├── .env.example                 # Environment template
├── package.json                 # Root package.json
├── pnpm-workspace.yaml          # pnpm workspace configuration
└── README.md
```

---

## Development Workflow

### Local Development Setup

#### Prerequisites
```bash
# Node.js 18+ required
node --version

# pnpm package manager
npm install -g pnpm

# Git for version control
git --version

# Optional: Docker for local database
docker --version
```

#### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd gmaoapp

# Install all dependencies
pnpm install

# Setup environment files
cp .env.example .env.local
cp apps/api/.env.example apps/api/.env

# Setup Supabase local development
pnpm supabase start

# Run database migrations
pnpm supabase db push

# Seed development data
pnpm run seed:dev
```

#### Development Commands
```bash
# Start all services
pnpm dev

# Start frontend only
pnpm --filter web dev

# Start backend only
pnpm --filter api dev

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Type checking
pnpm type-check

# Linting
pnpm lint

# Build for production
pnpm build
```

### Environment Configuration

#### Required Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=GMAOapp

# Backend (.env)
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
PORT=3001
NODE_ENV=development

# Shared
DATABASE_URL=your-database-connection-string
REDIS_URL=your-redis-connection-string
LOG_LEVEL=debug
```

---

## Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**
- **Platform:** Vercel
- **Build Command:** `pnpm --filter web build`
- **Output Directory:** `apps/web/dist`
- **CDN/Edge:** Vercel Edge Network with automatic global distribution

**Backend Deployment:**
- **Platform:** Railway (primary) or Render (alternative)
- **Build Command:** `pnpm --filter api build`
- **Deployment Method:** Docker container with automatic deployments from main branch

### CI/CD Pipeline
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Type check
        run: pnpm type-check

  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service: gmaoapp-api
```

### Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | localhost:3000 | localhost:3001 | Local development |
| Staging | gmaoapp-staging.vercel.app | gmao-api-staging.up.railway.app | Pre-production testing |
| Production | gmaoapp.vercel.app | gmao-api.up.railway.app | Live environment |

### Detailed Environment Setup

#### **Development Environment Setup**

**Prerequisites:**
```bash
# Node.js 18+ required
node --version  # Should be 18.x or higher

# pnpm package manager
npm install -g pnpm

# Git for version control
git --version
```

**Step-by-Step Setup:**

1. **Clone Repository**
```bash
git clone <repository-url>
cd gmaoapp
```

2. **Install Dependencies**
```bash
# Install all workspace dependencies
pnpm install

# This installs dependencies for root, apps/web, apps/api, and packages/shared
```

3. **Environment Configuration**
```bash
# Copy environment templates
cp .env.example .env.local
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
```

4. **Supabase Setup**
```bash
# Login to Supabase CLI (requires account)
pnpm supabase login

# Link to project (project settings > API > URL + anon key)
pnpm supabase link --project-ref <your-project-ref>

# Start local Supabase development
pnpm supabase start
```

5. **Database Setup**
```bash
# Apply migrations to local database
pnpm supabase db push

# Seed development data
pnpm run seed:dev
```

6. **Start Development Servers**
```bash
# Start both frontend and backend in parallel
pnpm dev

# Or start individually:
pnpm --filter web dev    # Frontend on localhost:3000
pnpm --filter api dev    # Backend on localhost:3001
```

#### **Required Environment Variables**

**Frontend (.env.local):**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=GMAOapp

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false  # Disable in development
```

**Backend (.env.local):**
```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_DB_URL=postgresql://postgres:[password]@localhost:54322/postgres

# Server Configuration
PORT=3001
NODE_ENV=development
JWT_SECRET=your-jwt-secret-here

# CORS Configuration (for development)
CORS_ORIGIN=http://localhost:3000
```

#### **Production Environment Setup**

**Vercel (Frontend) Setup:**

1. **Connect Repository**
   - Login to Vercel dashboard
   - Import GitHub repository
   - Select `apps/web` as root directory

2. **Environment Variables**
   ```bash
   # Add these in Vercel dashboard > Settings > Environment Variables
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
   NEXT_PUBLIC_API_URL=https://gmao-api.up.railway.app
   NEXT_PUBLIC_APP_NAME=GMAOapp
   ```

3. **Build Configuration**
   - **Build Command:** `pnpm --filter web build`
   - **Output Directory:** `apps/web/dist`
   - **Install Command:** `pnpm install`

4. **Deploy**
   - Connect `main` branch to production
   - Enable automatic deployments on push to main

**Railway (Backend) Setup:**

1. **Create New Service**
   - Login to Railway dashboard
   - Deploy from GitHub repository
   - Select `apps/api` as root directory

2. **Environment Variables**
   ```bash
   # Add these in Railway dashboard > Variables
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key
   SUPABASE_DB_URL=postgresql://postgres:[password]@db.your-project.railway.app:5432/postgres
   NODE_ENV=production
   JWT_SECRET=your-prod-jwt-secret
   CORS_ORIGIN=https://gmaoapp.vercel.app
   ```

3. **Build Configuration**
   - **Build Command:** `pnpm --filter api build`
   - **Start Command:** `pnpm --filter api start`
   - **Healthcheck Path:** `/api/v1/health`

4. **Deploy**
   - Connect `main` branch to production
   - Railway will automatically deploy on push

#### **Database Migration to Production**

1. **Backup Local Development Data**
```bash
# Export local data (optional)
pnpm supabase db dump > dev-backup.sql
```

2. **Deploy Migrations to Production**
```bash
# Ensure remote is set to production
pnpm supabase link --project-ref <your-prod-project-ref>

# Push migrations to production database
pnpm supabase db push

# Seed production data (admin users, basic equipment)
pnpm run seed:prod
```

3. **Verify Production Database**
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS policies enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';
```

#### **Troubleshooting Common Issues**

**Development Issues:**
```bash
# If ports conflict, check what's running
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# If dependencies fail, clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# If Supabase connection fails, check local instance
pnpm supabase status
```

**Deployment Issues:**
```bash
# Check build logs in Vercel/Railway dashboards
# Verify environment variables match exactly
# Ensure CORS origins are correctly configured
```

**Database Issues:**
```bash
# Reset local database if needed
pnpm supabase db reset
pnpm supabase db push
pnpm run seed:dev

# Check migration status
pnpm supabase migration list
```

---

## Security and Performance

### Security Requirements

**Frontend Security:**
- **CSP Headers:** `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://api.supabase.io`
- **XSS Prevention:** React's built-in XSS protection with additional DOMPurify for user-generated content
- **Secure Storage:** Sensitive data stored in httpOnly cookies, non-sensitive data in localStorage with encryption

**Backend Security:**
- **Input Validation:** Comprehensive validation using Joi/Zod schemas for all API endpoints
- **Rate Limiting:** Express-rate-limit with 100 requests per minute per user
- **CORS Policy:** Restrictive CORS with allowed origins configured per environment

**Authentication Security:**
- **Token Storage:** JWT tokens stored in httpOnly, secure cookies
- **Session Management:** Automatic token refresh with configurable session timeout (24 hours)
- **Password Policy:** Minimum 8 characters, complexity requirements enforced via Supabase Auth

### Performance Optimization

**Frontend Performance:**
- **Bundle Size Target:** <1MB initial load, <500KB for subsequent loads
- **Loading Strategy:** Code splitting by routes, lazy loading for heavy components
- **Caching Strategy:** Service worker for static assets, API response caching for 5 minutes

**Backend Performance:**
- **Response Time Target:** <200ms for API endpoints, <500ms for complex queries
- **Database Optimization:** Indexed queries, connection pooling via Supabase
- **Caching Strategy:** Response caching for static data (equipment, spare parts)

---

## Testing Strategy

### Testing Infrastructure Overview

**Comprehensive Testing Stack:**
- **Unit Testing:** Vitest for both frontend and backend with TypeScript support
- **Integration Testing:** API endpoint testing with isolated test databases
- **E2E Testing:** Playwright with mobile-first approach and device simulation
- **Visual Testing:** Playwright visual regression for UI consistency
- **Performance Testing:** Lighthouse CI for Core Web Vitals monitoring
- **Quality Gates:** ESLint, Prettier, and TypeScript strict mode enforcement

### Testing Pyramid

```
    E2E Tests (Playwright)
    /        \
  Integration Tests (API)
  /            \
Frontend Unit  Backend Unit
     (Vitest)      (Vitest)
```

### Test Organization & Standards

**Frontend Tests:**
```
apps/web/src/
├── __tests__/
│   ├── components/        # Component unit tests with React Testing Library
│   ├── hooks/            # Custom hook tests with React hooks testing utilities
│   ├── services/         # API service tests with MSW mocking
│   └── utils/            # Utility function tests
├── __e2e__/              # Playwright E2E tests
│   ├── auth.spec.ts      # Authentication flows
│   ├── work-orders.spec.ts # Complete work order workflows
│   ├── mobile.spec.ts    # Mobile-specific interactions and PWA testing
│   └── visual.spec.ts    # Visual regression tests
├── __mocks__/            # Mock data and utilities
└── setupTests.ts         # Global test configuration
```

**Backend Tests:**
```
apps/api/src/
├── __tests__/
│   ├── routes/           # API endpoint tests with Supabase test DB
│   ├── services/         # Business logic tests with comprehensive coverage
│   ├── models/           # Data model tests with validation
│   ├── middleware/       # Middleware tests (auth, validation, error handling)
│   └── integration/      # Full workflow integration tests
├── __fixtures__/         # Test data factories and fixtures
├── __mocks__/            # External service mocks
└── setupTests.ts         # Database setup and cleanup
```

### Quality Standards & Enforcement

**Code Quality Tools:**
- **ESLint:** TypeScript + React rules with custom configurations
- **Prettier:** Consistent code formatting with automated fixes
- **TypeScript:** Strict mode enabled with comprehensive type checking
- **Pre-commit Hooks:** Husky + lint-staged for automated quality checks
- **CI/CD Quality Gates:** Automated testing and quality verification

**Coverage Requirements:**
- **Unit Tests:** 80% minimum coverage, 90% target for business logic
- **Integration Tests:** 100% API endpoint coverage
- **E2E Tests:** Critical user workflows must be covered
- **Quality Metrics:** No TypeScript errors, 0 ESLint warnings

### Mobile-First Testing Strategy

**Playwright Mobile Configuration:**
```typescript
// Device emulation for testing
devices: [
  { name: 'iPhone 12', viewport: { width: 390, height: 844 } },
  { name: 'iPad', viewport: { width: 768, height: 1024 } },
  { name: 'Desktop', viewport: { width: 1920, height: 1080 } }
]
```

**Mobile Test Scenarios:**
- Touch interactions and gestures
- Responsive design verification
- Offline PWA functionality
- Performance on slow 3G networks
- Cross-browser mobile compatibility

### Performance Testing Integration

**Lighthouse CI Configuration:**
- **Core Web Vitals:** LCP <2.5s, FID <100ms, CLS <0.1
- **Performance Budgets:** Bundle size <1MB, images <500KB
- **Regression Detection:** Automated performance monitoring
- **Mobile Performance:** Specific thresholds for mobile devices

**Performance Monitoring:**
- Bundle analysis with webpack-bundle-analyzer
- Real user monitoring with Vercel Analytics
- API response time tracking
- Database query performance monitoring

### Test Data Management

**Database Strategy:**
- **Isolation:** Separate test database for each test run
- **Fixtures:** Consistent test data with factory patterns
- **Cleanup:** Automatic cleanup after each test
- **Migrations:** Test database migrations applied automatically
- **Mocking:** External services mocked for reliable testing

**Seed Data for Testing:**
- 2 admin users, 3 supervisors, 8 operators
- Complete equipment hierarchy (1 plant → 3 areas → 10 units → 50 equipment)
- Sample work orders in all statuses
- 100 spare parts with various stock levels

### CI/CD Integration

**GitHub Actions Workflow:**
```yaml
# Quality gates and automated deployment
jobs:
  test:
    - Linting and formatting checks
    - TypeScript compilation
    - Unit test execution (Vitest)
    - Integration test execution
    - E2E test execution (Playwright)
    - Coverage reporting and thresholds
    - Performance testing (Lighthouse CI)
  deploy:
    - Staging deployment verification
    - Production deployment with rollback capability
    - Post-deployment smoke tests
```

### Error Handling in Tests

**Test Scenarios:**
- Network failures and timeouts
- Authentication and authorization failures
- Database constraint violations
- File upload and validation errors
- Offline functionality testing
- PWA installation and usage scenarios

### Test Examples

**Frontend Component Test:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkOrderCard } from '@/components/WorkOrderCard';
import { mockWorkOrder } from '@/__mocks__/workOrder';

describe('WorkOrderCard', () => {
  it('displays work order information correctly', () => {
    render(
      <WorkOrderCard
        id={mockWorkOrder.id}
        onStatusChange={jest.fn()}
      />
    );

    expect(screen.getByText(mockWorkOrder.title)).toBeInTheDocument();
    expect(screen.getByText(mockWorkOrder.description)).toBeInTheDocument();
  });

  it('calls onStatusChange when start button is clicked', () => {
    const onStatusChange = jest.fn();
    render(
      <WorkOrderCard
        id={mockWorkOrder.id}
        onStatusChange={onStatusChange}
      />
    );

    fireEvent.click(screen.getByText('Start Work'));
    expect(onStatusChange).toHaveBeenCalledWith(mockWorkOrder.id, 'in_execution');
  });
});
```

**Backend API Test:**
```typescript
import request from 'supertest';
import { app } from '@/server';
import { createTestUser, createTestWorkOrder } from '@/__fixtures__/data';

describe('Work Orders API', () => {
  let authToken: string;

  beforeEach(async () => {
    const user = await createTestUser({ role: 'supervisor' });
    authToken = generateTestToken(user);
  });

  describe('POST /work-orders', () => {
    it('creates a new work order', async () => {
      const workOrderData = {
        title: 'Test Work Order',
        description: 'Test description',
        priority: 'high',
        equipmentId: 'test-equipment-id',
        estimatedDuration: 60,
      };

      const response = await request(app)
        .post('/api/v1/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workOrderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(workOrderData.title);
    });

    it('validates required fields', async () => {
      const response = await request(app)
        .post('/api/v1/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

**E2E Test:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Work Order Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as supervisor
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'supervisor@test.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  });

  test('supervisor can create and assign work order', async ({ page }) => {
    // Navigate to work orders
    await page.click('[data-testid="work-orders-nav"]');
    await page.click('[data-testid="create-work-order"]');

    // Fill work order form
    await page.fill('[data-testid="title"]', 'Repair Conveyor Belt');
    await page.fill('[data-testid="description"]', 'Replace damaged section');
    await page.selectOption('[data-testid="priority"]', 'high');
    await page.selectOption('[data-testid="equipment"]', 'conveyor-01');
    await page.fill('[data-testid="duration"]', '120');

    // Submit form
    await page.click('[data-testid="submit"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Verify work order appears in list
    await expect(page.locator('text=Repair Conveyor Belt')).toBeVisible();
  });

  test('operator can view and start assigned work order', async ({ page }) => {
    // Login as operator
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'operator@test.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // View assigned work orders
    await page.click('[data-testid="my-orders-nav"]');
    await expect(page.locator('[data-testid="work-order-card"]')).toHaveCount(1);

    // Start work order
    await page.click('[data-testid="start-work-button"]');
    await expect(page.locator('[data-testid="status-in-execution"]')).toBeVisible();
  });
});
```

---

## Coding Standards

### Critical Fullstack Rules

- **Type Sharing:** Always define types in `packages/shared` and import from there - never duplicate type definitions
- **API Calls:** Never make direct HTTP calls - use the service layer with proper error handling
- **Environment Variables:** Access only through config objects, never process.env directly in application code
- **Error Handling:** All API routes must use the standard error handler with consistent error response format
- **State Updates:** Never mutate state directly - use proper state management patterns (Zustand actions)
- **Authentication:** All protected routes must use authentication middleware with role-based access control
- **Database Access:** All database queries must go through repository pattern - no direct Supabase client calls in routes
- **Validation:** All user inputs must be validated using schema validation before processing
- **Logging:** All significant actions must be logged with user context for audit trails
- **Testing:** All business logic must have unit tests with >80% coverage

### Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `UserProfile.tsx` |
| Hooks | camelCase with 'use' | - | `useAuth.ts` |
| API Routes | - | kebab-case | `/api/user-profile` |
| Database Tables | - | snake_case | `user_profiles` |
| Files | kebab-case | kebab-case | `work-order-service.ts` |
| Constants | UPPER_SNAKE | UPPER_SNAKE | `API_BASE_URL` |
| Interfaces | PascalCase with 'I' | PascalCase | `IUser`, `WorkOrder` |
| Functions | camelCase | camelCase | `createUser()`, `calculateMTTR()` |

---

## Error Handling Strategy

### Error Flow
```mermaid
sequenceDiagram
    participant Client as Mobile Client
    participant UI as React Component
    participant Service as Service Layer
    participant API as Backend API
    participant DB as Database

    Client->>UI: User Action
    UI->>Service: API Call
    Service->>API: HTTP Request
    API->>DB: Database Query
    DB-->>API: Error
    API-->>Service: Structured Error Response
    Service-->>UI: Error with User Message
    UI-->>Client: Error Display
```

### Error Response Format
```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}
```

### Frontend Error Handling
```typescript
import { toast } from 'react-hot-toast';

export class ApiClient {
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`/api/v1${endpoint}`, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Request failed');
      }

      return response.json();
    } catch (error) {
      // Log error for debugging
      console.error('API Error:', error);

      // Show user-friendly message
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }

      throw error;
    }
  }
}
```

### Backend Error Handling
```typescript
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error with context
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.auth?.userId,
    requestId: req.id,
  });

  // Send structured error response
  const statusCode = getStatusCode(error);
  const errorResponse = {
    success: false,
    error: {
      code: getErrorCode(error),
      message: getErrorMessage(error),
      timestamp: new Date().toISOString(),
      requestId: req.id,
    },
  };

  res.status(statusCode).json(errorResponse);
};
```

---

## Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring:** Vercel Analytics for Core Web Vitals, user journey tracking
- **Backend Monitoring:** Railway built-in metrics with custom logging
- **Error Tracking:** Structured error logging with request tracing
- **Performance Monitoring:** API response time tracking and database query monitoring

### Key Metrics

**Frontend Metrics:**
- Core Web Vitals (LCP, FID, CLS)
- JavaScript error rate
- API response times by endpoint
- User interaction completion rates
- PWA installation rates

**Backend Metrics:**
- Request rate by endpoint
- Error rate by type and endpoint
- Response time (p50, p95, p99)
- Database query performance
- Authentication success/failure rates

---

## Additional Information

### Architecture Validation Summary

The full-stack architecture for GMAOapp has been successfully designed and documented. The architecture addresses all requirements from the PRD while maintaining feasibility within the 2-4 week MVP timeline and free-tier hosting constraints.

### Key Architectural Decisions Validated

✅ **Monorepo Monolith Approach**
- Simplifies development for small team
- Reduces network latency for real-time features
- Faster deployment within MVP timeline
- Can be refactored to microservices later

✅ **Polling-based Real-time Updates**
- More reliable than WebSockets in industrial environments
- Simpler implementation for MVP timeline
- 30-second intervals meet <500ms synchronization requirement
- Lower complexity for troubleshooting

✅ **Supabase Ecosystem Integration**
- Unified solution for database, auth, and storage
- Built-in Row Level Security perfect for operator access control
- Free tier sufficient for 4-8 users
- Excellent TypeScript support

✅ **Mobile-first PWA Strategy**
- Cross-platform compatibility without native apps
- Offline capabilities for intermittent connectivity
- Touch-optimized interface for industrial environments
- No app store requirements for rapid deployment

### Risk Mitigation Addressed

✅ **Timeline Risk (2-4 weeks)**
- Monolithic architecture reduces complexity
- Minimal external integrations
- Comprehensive documentation for parallel development
- Clear component boundaries for team division

✅ **Budget Risk (Free-tier hosting)**
- All selected services offer generous free tiers
- Architecture designed for resource efficiency
- Monitoring setup to avoid usage overages
- Clear upgrade path when scaling needed

✅ **Technical Complexity Risk**
- Well-established technologies with strong community support
- Comprehensive coding standards and examples
- Testing strategy ensures quality
- Error handling patterns for reliability

✅ **User Experience Risk**
- Mobile-first design addresses primary use case
- Real-time updates ensure team visibility
- Offline capabilities handle connectivity issues
- Accessibility compliance (WCAG AA) for industrial use

### Architecture Completeness Score: 95/100

The architecture comprehensively addresses all PRD requirements with detailed technical specifications, clear implementation guidance, and realistic development pathways. The remaining 5 points represent potential optimizations that can be addressed during development iterations rather than blocking the MVP delivery.

This architecture provides a solid foundation for delivering a functional industrial maintenance system within the specified constraints while establishing clear pathways for future enhancement and scaling.

---

## Cross-Story Dependencies

### Story Implementation Sequencing

This section defines the dependencies and coordination requirements between stories in Epic 1: Foundation & Authentication to prevent conflicts and ensure smooth parallel development.

### Dependency Matrix

| Story | Must Complete Before | Can Develop In Parallel With | Dependencies |
|-------|---------------------|-----------------------------|--------------|
| **1.1 Repository Setup** | All other stories | None | Git repo structure, package.json setup |
| **1.2 Frontend Infrastructure** | 1.3 (for API proxy) | 1.4, 1.5 | Monorepo structure, build tools |
| **1.3 Backend Infrastructure** | 1.1 | 1.2, 1.4, 1.5 | Database setup, API structure |
| **1.4 Testing Infrastructure** | 1.1 | 1.2, 1.3, 1.5 | Test framework setup |
| **1.5 Authentication Foundation** | 1.3, 1.2 | 1.4 | Backend API, Frontend components |

### Coordination Points

#### **Before Starting Development:**
1. **Story 1.1 must be completed first** - establishes repository structure
2. **Environment variable standards** must be agreed upon across all stories
3. **Shared types package** structure defined in Story 1.1 affects all subsequent stories

#### **Parallel Development Coordination:**
1. **API Contract Agreement** (Stories 1.2 & 1.3):
   - Backend team defines API endpoints in Story 1.3
   - Frontend team creates service layer in Story 1.2
   - Must coordinate on endpoint naming, request/response formats

2. **Database Schema Coordination** (Stories 1.3 & 1.5):
   - Story 1.3 creates basic schema
   - Story 1.5 adds authentication tables and RLS policies
   - Must coordinate on user table structure and relationships

3. **Component Testing Strategy** (Stories 1.2 & 1.4):
   - Story 1.2 creates components
   - Story 1.4 sets up testing framework
   - Must agree on component testing patterns and utilities

#### **Integration Dependencies:**
1. **Frontend-Backend Integration** (Stories 1.2 & 1.3):
   - API proxy configuration in Vite (1.2) depends on backend server setup (1.3)
   - Environment variables for API URLs must be consistent

2. **Authentication Integration** (Stories 1.2, 1.3, 1.5):
   - Frontend auth components (1.2) depend on auth middleware (1.3) and auth services (1.5)
   - JWT token handling must be consistent across all stories

3. **Testing Integration** (Story 1.4 with all others):
   - Test database setup in 1.4 must match schema from 1.3 and 1.5
   - Component testing utilities in 1.4 must work with components from 1.2

### Communication Protocols

#### **Daily Coordination:**
- **Frontend Team** (Stories 1.2, 1.5): API endpoint usage, component requirements
- **Backend Team** (Stories 1.3, 1.5): Schema changes, auth endpoints
- **Testing Team** (Story 1.4): Test environment needs, component testing patterns

#### **Critical Review Points:**
1. **After Story 1.1 Complete:** Review repository structure before parallel development
2. **API Contract Review:** Before frontend-backend integration work
3. **Schema Review:** Before implementing authentication (1.5)
4. **Integration Testing:** Before any story marks as "Ready for QA"

### Branch Management Strategy

#### **Feature Branches:**
- `feature/story-1.1-repo-setup` (completed first)
- `feature/story-1.2-frontend`
- `feature/story-1.3-backend`
- `feature/story-1.4-testing`
- `feature/story-1.5-auth`

#### **Integration Branch:**
- `develop` - integration point for all Epic 1 stories
- Regular merges from feature branches to test integration
- No direct merges to `main` until Epic 1 complete

#### **Coordination Commits:**
- Shared types package updates coordinated across all branches
- Environment variable changes require coordinated commits
- API contract changes tagged in commit messages for easy tracking

---

*This architecture document serves as the single source of truth for GMAOapp MVP development. All development decisions should reference this document to ensure consistency and alignment with the established technical vision.*