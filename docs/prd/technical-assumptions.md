# Technical Assumptions

Based on your project goals and existing configuration, here are the technical decisions that will guide the Architect:

## Repository Structure: Monorepo

**Decision:** Monorepo structure using a single repository containing both frontend and backend code.

**Rationale:**
- Simpler deployment workflow for a small team (2-4 week timeline)
- Shared dependencies and configuration can be managed centrally
- Easier to maintain consistent versions and standards
- Reduces complexity for rapid MVP development
- Free-tier hosting platforms work well with monorepo structure
- **Alternative Analysis:** Microservices would provide better long-term scalability but significantly increase complexity and development time for MVP

## Service Architecture

**Decision:** Monolith architecture with separate frontend/backend services within the same codebase.

**Rationale:**
- Faster development and deployment for MVP timeline
- Simpler debugging and monitoring for a small team
- Reduces network latency between services (important for real-time features)
- Easier to implement polling-based synchronization across components
- Can be split into microservices later if scaling needs arise
- Free-tier hosting costs are minimized with single deployment
- **Constraint Validation:** Handles 4-8 concurrent users with 30-second synchronization requirement effectively

## Testing Requirements

**Decision:** Unit + Integration testing with manual testing convenience methods.

**Rationale:**
- Unit tests for business logic validation (work order state transitions, KPI calculations)
- Integration tests for critical user workflows (work order creation → assignment → completion)
- Manual testing convenience methods for polling-based real-time features and mobile PWA functionality
- End-to-end tests deferred to maintain MVP timeline
- Critical for industrial maintenance app where data integrity and workflow correctness are essential

## Additional Technical Assumptions and Requests

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
