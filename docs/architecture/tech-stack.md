# Tech Stack

This is the DEFINITIVE technology selection for the entire project. All development must use these exact versions to ensure consistency and compatibility across the fullstack application.

## Technology Stack Table

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
