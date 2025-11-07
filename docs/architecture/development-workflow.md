# Development Workflow

## Local Development Setup

### Prerequisites
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

### Initial Setup
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

### Development Commands
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

## Environment Configuration

### Required Environment Variables

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
