# GMAO Maintenance Management System

A comprehensive maintenance management system built with modern web technologies to streamline equipment maintenance, work order management, and operational efficiency.

## 🚀 Tech Stack

This project uses a modern fullstack architecture with the following technologies:

### Frontend
- **React 18.2** - Component-based UI development
- **TypeScript 5.0** - Type-safe development
- **Vite 5.0** - Fast build tool and development server
- **Tailwind CSS 3.4** - Utility-first styling
- **Headless UI 2.0** - Accessible components
- **Zustand 4.4** - Simple state management
- **React Query 5.15** - Data fetching and caching

### Backend
- **Express.js 4.18** - API server framework
- **TypeScript 5.0** - Type-safe backend development
- **Zod 3.22** - Schema validation

### Database & Infrastructure
- **Supabase (PostgreSQL 15)** - Primary database and auth
- **Row-Level Security** - Built-in data protection
- **Real-time subscriptions** - Live updates
- **File Storage** - Equipment CSV uploads

### Development Tools
- **pnpm 8.10** - Package manager with workspace support
- **ESLint & Prettier** - Code quality and formatting
- **Husky & lint-staged** - Git hooks and pre-commit validation
- **Vitest 1.0** - Unit and integration testing
- **Commitlint** - Conventional commit messages

## 📁 Project Structure

```
gmaoapp/
├── apps/
│   ├── web/                 # Frontend application (React + Vite)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── api/                 # Backend application (Express + TypeScript)
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── shared/              # Shared types and utilities
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui/                  # Shared UI components
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/              # Shared configuration (ESLint, TypeScript)
├── infrastructure/
│   └── supabase/
├── scripts/
├── docs/
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Git**

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd gmaoapp
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Setup

Copy the environment example files and configure them:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
```

Update the environment variables with your Supabase configuration.

### 4. Start Development

Start both frontend and backend in parallel:

```bash
pnpm dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📝 Available Scripts

### Root Level Scripts
- `pnpm dev` - Start both frontend and backend in development mode
- `pnpm build` - Build both frontend and backend for production
- `pnpm test` - Run all tests across packages
- `pnpm lint` - Run linting across all packages
- `pnpm type-check` - Type check all TypeScript code
- `pnpm format` - Format all code with Prettier
- `pnpm clean` - Clean all build artifacts and node_modules

### Package-specific Scripts
Navigate to individual packages to run specific commands:

#### Frontend (apps/web)
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run frontend tests

#### Backend (apps/api)
- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Compile TypeScript
- `pnpm start` - Start production server
- `pnpm test` - Run backend tests

#### Shared Package (packages/shared)
- `pnpm build` - Compile shared types and utilities
- `pnpm test` - Run shared package tests

## 🧪 Testing

This project uses Vitest for testing with the following structure:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage

# Run tests for specific package
pnpm --filter web test
pnpm --filter api test
pnpm --filter shared test
```

Tests are located in `__tests__/` directories within each package.

## 📊 Code Quality

### Pre-commit Hooks
This project uses Husky and lint-staged to ensure code quality:

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Commitlint** - Conventional commit message validation

### Commit Convention
We follow conventional commits:

```
feat: add new work order creation feature
fix: resolve equipment status update bug
docs: update API documentation
test: add unit tests for user service
```

## 🔧 Environment Variables

### Frontend (apps/web/.env.local)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3001
```

### Backend (apps/api/.env.local)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
```

## 📚 Documentation

- **Architecture** - `docs/architecture/` - System architecture and technical decisions
- **API Documentation** - Available after starting the backend at `/api/docs`
- **Component Documentation** - Storybook (when configured)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass and code quality checks pass
6. Commit your changes using conventional commits
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `docs/` directory
- Review existing issues and discussions

---

Built with ❤️ using modern web technologies