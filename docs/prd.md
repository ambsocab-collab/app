# GMAOapp Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Launch a functional maintenance work order system that tracks equipment repairs from creation to completion
- Enable 4-8 operators to view and complete assigned maintenance tasks on mobile devices
- Provide real-time visibility of work order status through a Meeting Mode Kanban board and TV display
- Track spare parts usage and alert when stock falls below minimum thresholds
- Calculate basic maintenance KPIs (MTTR, MTBF, availability) to establish baseline performance metrics

### Background Context

Small industrial maintenance teams currently manage work orders using spreadsheets, paper forms, or no system at all. This leads to lost work orders, unclear task assignments, untracked spare parts consumption, and zero visibility into maintenance performance. The GMAOapp MVP solves the immediate pain point: getting maintenance operations out of spreadsheets and into a purpose-built system that operators can access from tablets in the field.

The MVP focuses on the core workflow: supervisors create work orders and assign them to operators, operators complete work and log spare parts used, and everyone can see current status on a shared Kanban board or TV display. Advanced features like AI diagnosis, external component repairs, and complex reporting are explicitly out of scope for v1.0. The goal is to get a working system deployed in 2-4 weeks that immediately improves visibility and organization, with a clear path to add capabilities in future iterations.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-05 | v1.0 | Initial MVP PRD | PM Agent |

---

## Requirements

### Functional

**FR1:** The system shall allow supervisors to create work orders specifying machine, description, priority (Critical/High/Medium/Low), and estimated duration

**FR2:** The system shall support work order states: Open, Planned, In Execution, Completed, Closed, Rejected, Waiting, and Pending Stock

**FR3:** The system shall allow supervisors to assign work orders to specific operators with automatic notification

**FR4:** The system shall provide operators a "My Orders" view showing assigned work orders filtered by status

**FR5:** The system shall automatically transition work orders to "In Execution" state when an operator starts work

**FR6:** The system shall allow operators to log spare parts consumed during work order execution with automatic stock updates

**FR7:** The system shall alert supervisors when spare part stock falls below configured minimum thresholds

**FR8:** The system shall provide a Meeting Mode Kanban board with drag-and-drop capability to change work order states and assignments

**FR9:** The system shall synchronize all work order changes across all connected devices using 30-second polling intervals

**FR10:** The system shall provide a TV Display Mode that rotates between KPI dashboard and pending work order cards every 30 seconds

**FR11:** The system shall calculate and display MTTR (Mean Time To Repair), MTBF (Mean Time Between Failures), and equipment availability KPIs

**FR12:** The system shall maintain a complete audit trail of all work order state changes including user, timestamp, and reason

**FR13:** The system shall support a flexible hierarchical equipment structure starting from Plant (top level) with a default organization of Plant → Area → Functional Unit → Equipment → Components, allowing administrators to add or remove intermediate hierarchy levels as needed (only Plant level is mandatory)

**FR16:** The system shall allow administrators to bulk upload equipment hierarchy data via Excel/CSV file import and provide a downloadable template file with the current structure format

**FR14:** The system shall allow administrators to manage user accounts with role-based permissions (Admin/Supervisor/Operator)

**FR15:** The system shall allow spare parts to be associated with multiple components for inventory planning

### Non Functional

**NFR1:** The system shall be responsive and fully functional on desktop, tablet, and mobile devices with mobile-first design priority

**NFR2:** The system shall support 4-8 concurrent operators managing 50-100 pieces of equipment without performance degradation

**NFR3:** The system shall use free-tier cloud services (Vercel frontend, Railway/Render backend, Supabase database) to minimize operational costs

**NFR4:** The system shall achieve work order state synchronization within 30 seconds across all connected clients

**NFR5:** The system shall implement Row Level Security (RLS) policies ensuring operators only access their assigned work orders

**NFR6:** The system shall maintain 99.5% uptime during production facility operating hours (excludes planned maintenance windows)

**NFR7:** The system shall be deployable within a 2-4 week development timeline using React, Node.js, and Supabase technology stack

---

## User Interface Design Goals

### Overall UX Vision

The GMAOapp delivers a mobile-first Progressive Web App (PWA) experience optimized for industrial maintenance operators working in the field with tablets and smartphones. The interface prioritizes quick access to critical information, one-handed operation with large touch targets (48x48px minimum), and offline-capable workflows for environments with intermittent connectivity. The design language is clean and utilitarian—prioritizing clarity and speed over decorative elements—with color-coded priority indicators (red/orange/yellow/green) that are instantly recognizable from across a factory floor.

The operator experience centers on a persistent bottom tab navigation (Home, My Orders, Workshop, Reports, Profile) that keeps core functions always accessible. Work order cards use a scannable card-based layout with progressive disclosure: essential information visible at a glance, full details available with a tap. Real-time synchronization provides immediate feedback when supervisors assign work or make changes, creating a sense of connectedness despite physical distance across the facility.

### Key Interaction Paradigms

- **Pull-to-refresh**: Standard mobile gesture to manually sync latest work orders and KPIs
- **Swipe actions**: Swipe left/right on work order cards for quick actions (start, complete, view details)
- **Drag-and-drop** (Meeting Mode only): Supervisors manipulate work order cards on Kanban board via touch gestures
- **Progressive disclosure**: Cards show summary info by default, tap to expand full details without navigation
- **No camera integration**: Photo attachments removed from MVP scope to focus on core work order management
- **Offline-first**: App caches recent data locally, queues changes when offline, auto-syncs when connectivity returns with visual feedback

### Core Screens and Views

**Operator Role:**
- Home Dashboard (KPI summary, alerts, quick actions)
- My Orders (work orders assigned to me, filterable by status)
- Work Order Detail (timer, spare parts checklist, photo capture, notes)
- Workshop (spare parts inventory, stock alerts)
- Profile (settings, notifications preferences)

**Supervisor Role:**
- All operator screens plus:
- Create/Assign Work Order (machine selector, operator assignment)
- Meeting Mode Kanban Board (drag-and-drop work order management)
- TV Display Toggle (activate/deactivate TV rotation mode)

**Admin Role:**
- All supervisor screens plus:
- Equipment Management (flexible hierarchical structure with bulk CSV/Excel import)
- User Management (create users, assign roles/permissions)
- Spare Parts Management (CRUD, stock thresholds)

**Shared Displays:**
- TV Display Mode (auto-rotating KPI dashboard and pending work cards, no interaction required)

### Accessibility: WCAG AA

- Minimum contrast ratio 4.5:1 for all text and interactive elements
- Touch targets minimum 48x48px for thumb-friendly operation with work gloves
- Text size minimum 14px body copy, 16px for critical information, scalable via browser settings
- Color is never the sole indicator (priority uses color + icon + text label)
- Screen reader compatible with proper semantic HTML and ARIA labels
- Keyboard navigation support for desktop users
- Respects `prefers-reduced-motion` for users sensitive to animation

### Branding

Clean, industrial aesthetic with minimal ornamentation. The interface uses the Inter system font for universal device compatibility and professional appearance. Iconography uses standard Material Design icons for universal recognition (wrench for maintenance, bell for notifications, etc.). The color palette is functional rather than branded: blue for primary actions, green for success/completion, yellow/orange for warnings, red for critical priorities. No corporate logo or custom brand assets are required for MVP—the focus is on tool utility, not marketing.

### Target Device and Platforms: Web Responsive

**Primary:** Mobile phones (5-6" screens, 375-430px width, portrait orientation) running iOS Safari or Android Chrome as PWA

**Secondary:** Tablets (9-11" screens, landscape and portrait) for supervisor Kanban board interactions

**Tertiary:** Desktop browsers (1920x1080+) for administrative tasks and data entry

**Special:** TV displays (55"+ screens, 1920x1080 or 4K) for read-only auto-rotating dashboard mode, typically connected via casting or dedicated browser

All platforms access the same responsive web application—no native mobile apps. The PWA can be installed to the home screen on mobile devices for app-like experience with offline capabilities and push notifications.

---

## Technical Assumptions

Based on your project goals and existing configuration, here are the technical decisions that will guide the Architect:

### Repository Structure: Monorepo

**Decision:** Monorepo structure using a single repository containing both frontend and backend code.

**Rationale:**
- Simpler deployment workflow for a small team (2-4 week timeline)
- Shared dependencies and configuration can be managed centrally
- Easier to maintain consistent versions and standards
- Reduces complexity for rapid MVP development
- Free-tier hosting platforms work well with monorepo structure
- **Alternative Analysis:** Microservices would provide better long-term scalability but significantly increase complexity and development time for MVP

### Service Architecture

**Decision:** Monolith architecture with separate frontend/backend services within the same codebase.

**Rationale:**
- Faster development and deployment for MVP timeline
- Simpler debugging and monitoring for a small team
- Reduces network latency between services (important for real-time features)
- Easier to implement polling-based synchronization across components
- Can be split into microservices later if scaling needs arise
- Free-tier hosting costs are minimized with single deployment
- **Constraint Validation:** Handles 4-8 concurrent users with 30-second synchronization requirement effectively

### Testing Requirements

**Decision:** Unit + Integration testing with manual testing convenience methods.

**Rationale:**
- Unit tests for business logic validation (work order state transitions, KPI calculations)
- Integration tests for critical user workflows (work order creation → assignment → completion)
- Manual testing convenience methods for polling-based real-time features and mobile PWA functionality
- End-to-end tests deferred to maintain MVP timeline
- Critical for industrial maintenance app where data integrity and workflow correctness are essential

### Additional Technical Assumptions and Requests

**Technology Stack Decisions:**
- **Frontend:** React with TypeScript for type safety and faster development
- **Backend:** Node.js with Express for rapid API development
- **Database:** Supabase (PostgreSQL) for real-time subscriptions and built-in Row Level Security
- **Real-time:** Supabase real-time subscriptions for work order state synchronization
- **Authentication:** Supabase Auth for role-based access control
- **Deployment:** Vercel (frontend) + Railway/Render (backend) for free-tier hosting
- **PWA:** React PWA configuration with service worker for offline capabilities
- **Alternative Analysis:** Firebase considered but Supabase better fits structured data and RLS requirements

**Critical Technical Constraints:**
- Polling-based synchronization must handle 4-8 concurrent users with 30-second refresh intervals
- Mobile PWA must work offline and sync when connectivity returns
- Row Level Security must prevent operators from accessing unassigned work orders
- File upload support for equipment hierarchy CSV/Excel imports
- No camera API integration (removed from MVP scope)
- Bulk operations support for spare parts inventory management

**Performance Requirements:**
- Support 50-100 pieces of equipment with 5-10 concurrent work orders
- Real-time KPI calculations (MTTR, MTBF, availability) with minimal computational overhead
- Efficient database queries for Kanban board filtering and sorting
- Optimized bundle size for fast loading on mobile devices

**Security Considerations:**
- Row Level Security (RLS) policies in Supabase for data access control
- JWT token management for authenticated sessions
- Input validation and sanitization for all user inputs
- Secure file handling for CSV/Excel uploads

**Integration Requirements:**
- Polling-based client for updates across all connected devices
- File processing library for Excel/CSV parsing during equipment import
- No image handling (removed from MVP scope)
- Push notification service for PWA (optional, depends on complexity)

**Constraint Validation Summary:**
- **Time (2-4 weeks):** 18-30 days estimated across all epics - achievable
- **Budget (free-tier):** $20-50/month estimated - within small business budget
- **Scale (4-8 users):** Well within technical stack capabilities
- **Scope (MVP):** All excluded features (AI, advanced reporting) require significant complexity
- **Devices (PWA):** Best balance of reach vs development speed
- **Security (RLS):** Feasible with Supabase tooling

This technical foundation provides the Architect with clear constraints and decisions that align with your MVP timeline, budget constraints, and functional requirements. The monorepo monolith approach prioritizes speed of development while maintaining the real-time, mobile-first capabilities essential for your maintenance operators.

---

## Epic List

Based on functional requirements and constraint validation, here's the proposed epic structure:

**Epic 1: Foundation & Authentication** - Complete project initialization with granular setup steps, frontend infrastructure (Vite, Tailwind, PWA), backend infrastructure (Express, Supabase), testing framework, and authentication system with role-based permissions (4-6 days)

**Epic 1 Detailed Breakdown:**
- **Story 1.1:** Repository & Project Initialization (monorepo setup, README, environment configuration)
- **Story 1.2:** Frontend Build Infrastructure (Vite, Tailwind, component library, PWA setup)
- **Story 1.3:** Backend & Database Infrastructure (Express setup, Supabase CLI, migrations, seed data)
- **Story 1.4:** Testing & Quality Infrastructure (Vitest, Playwright, linting, CI/CD pipeline)
- **Story 1.5:** Authentication Foundation (Supabase Auth, roles, RLS policies, auth UI components)

**Epic 2: Equipment & Inventory Management** - Create flexible hierarchical equipment structure with bulk import capabilities and spare parts inventory with stock alerts (4-6 days)

**Epic 3: Core Work Order Operations** - Implement complete work order lifecycle from creation through completion with real-time state management and operator assignment (5-8 days)

**Epic 4: Real-time Collaboration & Visibility** - Build real-time work order status synchronization and TV display mode for team visibility (3-5 days)

**Epic 5: Basic KPIs & Reporting** - Display operational metrics available from system start (work order counts, repair times) on tablet and desktop interfaces (2-3 days)

**Epic Structure Rationale:**
Each epic delivers significant, end-to-end value with logical progression from foundation → domain objects → core workflows → collaboration → insights. Total estimated timeline: 17-27 days (within 2-4 week constraint). Each epic can be deployed independently to provide immediate value while building toward complete MVP functionality.

**Primary Risks & Mitigations:**
- TV display optimization complexity could extend Epic 4 → Prioritize core visibility features first
- CSV import complexity in Epic 2 → Provide manual entry fallback if import proves problematic
- KPI data availability constraints addressed by focusing on day-1 metrics
- Constraint validation shows all assumptions realistic and achievable within timeline

---

## Next Steps

### UX Expert Prompt

Initiate UX design process for GMAOapp mobile-first maintenance application. Focus on creating intuitive interfaces for industrial maintenance operators working with tablets and smartphones. Prioritize large touch targets (48x48px minimum), clear status indicators, and one-handed operation. Design mobile operator workflow (My Orders, work execution, parts logging) separately from desktop supervisor management features. Create PWA-optimized layouts with offline-first design principles and accessibility compliance (WCAG AA).

### Architect Prompt

Create technical architecture for GMAOapp maintenance system using React PWA + Node.js monolith + Supabase stack. Design monorepo structure optimized for 2-4 week MVP timeline with 4-8 concurrent users. Implement polling-based real-time updates (30-second intervals) instead of WebSockets. Focus on mobile-first responsive design with tablet/desktop management interfaces. Design Row Level Security policies ensuring operators only access assigned work orders. Plan for free-tier deployment on Vercel (frontend) + Railway/Render (backend) + Supabase database. Prioritize performance optimization for <500ms synchronization latency and offline PWA capabilities.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-05 | v1.0 | Initial MVP PRD | PM Agent |
| 2025-11-06 | v1.1 | Simplified Epic 4 (removed WebSocket/Kanban), Epic 5 (day-1 KPIs only) | PM Agent |
| 2025-11-07 | v1.2 | Updated FR9/NFR4 for 30-second polling instead of WebSocket | PM Agent |
| 2025-11-07 | v1.3 | Removed camera integration and photo attachments from MVP scope | PM Agent |

