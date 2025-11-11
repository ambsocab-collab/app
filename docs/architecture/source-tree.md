# Source Tree Structure

This document describes the complete source code organization for the GMAO Maintenance Management System.

## 📁 Repository Overview

```
gmaoapp/
├── 📂 apps/                           # Application packages
│   ├── 📂 web/                       # Frontend React application
│   │   ├── 📂 public/                # Static assets
│   │   ├── 📂 src/
│   │   │   ├── 📂 __tests__/         # Frontend tests
│   │   │   ├── 📂 test/              # Test setup and utilities
│   │   │   ├── 📄 App.tsx            # Main application component
│   │   │   ├── 📄 main.tsx           # Application entry point
│   │   │   └── 📄 index.css          # Global styles
│   │   ├── 📄 .env.example           # Environment variables template
│   │   ├── 📄 index.html             # HTML template
│   │   ├── 📄 package.json           # Dependencies and scripts
│   │   ├── 📄 tailwind.config.js     # Tailwind CSS configuration
│   │   ├── 📄 tsconfig.json          # TypeScript configuration
│   │   ├── 📄 vite.config.ts         # Vite build configuration
│   │   └── 📄 postcss.config.js      # PostCSS configuration
│   └── 📂 api/                       # Backend Express application
│       ├── 📂 src/
│       │   ├── 📂 middleware/        # Express middleware
│       │   │   ├── 📄 errorHandler.ts    # Error handling middleware
│       │   │   ├── 📄 rateLimiter.ts     # Rate limiting middleware
│       │   │   └── 📄 security.ts         # Security middleware
│       │   ├── 📂 __tests__/         # Backend tests
│       │   ├── 📄 index.ts            # Server entry point
│       │   └── 📄 routes/             # API route definitions
│       ├── 📄 .env.example           # Environment variables template
│       ├── 📄 package.json           # Dependencies and scripts
│       └── 📄 tsconfig.json          # TypeScript configuration
├── 📂 packages/                      # Shared packages
│   ├── 📂 shared/                    # Shared types, utilities, and configuration
│   │   ├── 📂 src/
│   │   │   ├── 📂 __tests__/         # Shared package tests
│   │   │   ├── 📂 config/            # Environment configuration
│   │   │   │   └── 📄 index.ts       # Main configuration exports
│   │   │   ├── 📂 schemas/           # Zod validation schemas
│   │   │   │   └── 📄 index.ts       # Main schema exports
│   │   │   ├── 📂 types/             # TypeScript type definitions
│   │   │   │   └── 📄 index.ts       # Main type exports
│   │   │   ├── 📂 utils/             # Utility functions
│   │   │   │   └── 📄 index.ts       # Main utility exports
│   │   │   └── 📄 index.ts           # Main package exports
│   │   ├── 📂 dist/                  # Compiled output
│   │   ├── 📄 package.json           # Dependencies and scripts
│   │   ├── 📄 tsconfig.json          # TypeScript configuration
│   │   └── 📄 vitest.config.ts       # Vitest test configuration
│   └── 📂 ui/                        # Shared UI components
│       ├── 📂 src/
│       │   └── 📄 index.ts           # UI component exports
│       ├── 📄 package.json           # Dependencies and scripts
│       └── 📄 tsconfig.json          # TypeScript configuration
├── 📂 docs/                          # Documentation
│   ├── 📂 architecture/              # Architecture documentation
│   │   ├── 📄 coding-standards.md    # Development standards
│   │   ├── 📄 tech-stack.md          # Technology stack overview
│   │   └── 📄 source-tree.md         # This file
│   ├── 📂 prd/                       # Product requirements (when sharded)
│   ├── 📂 stories/                   # User stories and development records
│   │   └── 📄 1.1.repository-setup.md # Repository setup story
│   └── 📂 qa/                        # Quality assurance documentation
│       ├── 📂 assessments/           # QA assessments and reports
│       └── 📂 gates/                 # Quality gate decisions
├── 📂 infrastructure/                # Infrastructure as code
│   └── 📂 supabase/                  # Supabase configuration
├── 📂 scripts/                       # Build and utility scripts
├── 📂 .github/                      # GitHub workflows and templates
│   └── 📂 workflows/                 # CI/CD workflows
├── 📂 .husky/                       # Git hooks
│   └── 📄 pre-commit                 # Pre-commit hook script
├── 📄 .env.example                   # Root environment template
├── 📄 .eslintrc.js                   # ESLint configuration
├── 📄 .gitignore                     # Git ignore patterns
├── 📄 .prettierignore                # Prettier ignore patterns
├── 📄 commitlint.config.js           # Commit message linting
├── 📄 package.json                   # Root package configuration
├── 📄 pnpm-workspace.yaml            # pnpm workspace configuration
├── 📄 tsconfig.json                  # Root TypeScript configuration
└── 📄 README.md                      # Project documentation
```

## 🏗️ Package Architecture

### Applications (`apps/`)

#### Web Application (`apps/web/`)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3.4
- **Testing**: Vitest + React Testing Library
- **State Management**: Zustand
- **Data Fetching**: React Query

#### API Application (`apps/api/`)
- **Framework**: Express.js + TypeScript
- **Security**: Helmet, Rate Limiting, CORS
- **Validation**: Zod schemas
- **Testing**: Vitest
- **Database**: Supabase (PostgreSQL)

### Shared Packages (`packages/`)

#### Shared Package (`packages/shared/`)
- **Purpose**: Common types, utilities, and configuration
- **Exports**:
  - `types/`: TypeScript interfaces and type definitions
  - `utils/`: Utility functions and helpers
  - `schemas/`: Zod validation schemas
  - `config/`: Environment configuration management
- **Testing**: Comprehensive unit tests with 100% coverage

#### UI Package (`packages/ui/`)
- **Purpose**: Shared React components
- **Status**: Placeholder for future component library

## 🔧 Configuration Files

### Root Configuration
- `package.json`: Workspace dependencies and scripts
- `pnpm-workspace.yaml`: Package workspace configuration
- `tsconfig.json`: Root TypeScript configuration with path aliases
- `.eslintrc.js`: ESLint configuration for all packages
- `.prettierignore`: Files to exclude from formatting

### Package-Specific Configuration
Each package has its own configuration files that extend or override root settings.

## 🧪 Testing Structure

### Test Locations
- **Unit Tests**: `src/__tests__/` within each package
- **Integration Tests**: Package-level test directories
- **E2E Tests**: Root-level tests (planned)

### Test Configuration
- **Shared Package**: `vitest.config.ts`
- **Web Application**: `vite.config.ts` (includes test configuration)
- **API Application**: Vitest configuration (planned)

## 🔐 Security Structure

### Security Middleware (`apps/api/src/middleware/`)
- `security.ts`: Helmet, CSP, HSTS, IP security
- `rateLimiter.ts`: Progressive rate limiting
- `errorHandler.ts`: Comprehensive error handling

### Environment Security
- Type-safe environment variable validation
- CORS configuration
- Rate limiting tiers (general, auth, API, upload)

## 📦 Build and Distribution

### Build Outputs
- **Web**: `apps/web/dist/` - Static assets for deployment
- **API**: `apps/api/dist/` - Compiled TypeScript
- **Shared**: `packages/shared/dist/` - Compiled types and utilities

### Development Workflow
1. Install dependencies: `pnpm install`
2. Start development: `pnpm dev` (runs both apps)
3. Run tests: `pnpm test`
4. Build for production: `pnpm build`
5. Lint code: `pnpm lint`

## 🚀 Deployment Structure

### Development Environment
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`
- Database: Supabase development instance

### Production Considerations
- Environment-specific configurations
- Security headers and policies
- Rate limiting and monitoring
- Error handling and logging

## 📊 Module Dependencies

```
apps/web → packages/shared → packages/ui (future)
apps/api → packages/shared
```

The shared package is the core dependency that provides types, utilities, and configuration to both applications.