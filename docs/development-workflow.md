# Development Workflow

This document outlines the complete development workflow for the GMAO Maintenance Management System.

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Git**

### Setup Commands
```bash
# Clone the repository
git clone <repository-url>
cd gmaoapp

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local

# Start development servers
pnpm dev
```

## 📋 Development Tasks

### Daily Development Workflow

#### 1. Start Development
```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm --filter web dev    # Frontend only
pnpm --filter api dev    # Backend only
```

#### 2. Run Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests for specific package
pnpm --filter shared test
pnpm --filter web test
pnpm --filter api test
```

#### 3. Code Quality Checks
```bash
# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Format code
pnpm format
```

#### 4. Build for Production
```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter web build
pnpm --filter api build
pnpm --filter shared build
```

## 🔧 Package-Specific Workflows

### Frontend Development (apps/web)

#### Development Server
```bash
cd apps/web
pnpm dev
```
- **URL**: http://localhost:5173
- **Hot Reload**: Enabled
- **Proxy**: API requests proxied to http://localhost:3001

#### Testing
```bash
cd apps/web
pnpm test                # Run tests
pnpm test --watch        # Watch mode
pnpm test --coverage     # Coverage report
pnpm test:ui            # Test UI interface
```

#### Build Process
```bash
cd apps/web
pnpm build               # Production build
pnpm preview             # Preview production build
```

### Backend Development (apps/api)

#### Development Server
```bash
cd apps/api
pnpm dev
```
- **URL**: http://localhost:3001
- **Hot Reload**: Enabled with tsx
- **Auto-restart**: On file changes

#### Testing
```bash
cd apps/api
pnpm test                # Run tests
pnpm test --watch        # Watch mode
pnpm test --coverage     # Coverage report
```

#### Build Process
```bash
cd apps/api
pnpm build               # Compile TypeScript
pnpm start               # Start production server
```

### Shared Package Development (packages/shared)

#### Development
```bash
cd packages/shared
pnpm build               # Compile TypeScript
pnpm test                # Run tests
pnpm test --watch        # Watch mode
```

#### Publishing (Internal)
```bash
cd packages/shared
pnpm build               # Must build before using in other packages
```

## 🌿 Git Workflow

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: Feature development
- **fix/***: Bug fixes
- **docs/***: Documentation changes

### Commit Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new work order creation feature
fix: resolve equipment status update bug
docs: update API documentation
test: add unit tests for user service
refactor: optimize database queries
style: format code with prettier
chore: update dependencies
```

### Pre-commit Hooks
Automatically runs on every commit:
- **ESLint**: Code quality checks
- **Prettier**: Code formatting
- **Type Check**: TypeScript compilation

### Pull Request Process
1. Create feature branch from develop
2. Make changes with proper commits
3. Ensure all tests pass
4. Create pull request to develop
5. Code review and required changes
6. Merge to develop

## 🧪 Testing Strategy

### Test Types
- **Unit Tests**: Individual function/component testing
- **Integration Tests**: Package interaction testing
- **E2E Tests**: Full application testing (planned)

### Test Structure
```
src/
├── __tests__/           # Test files
│   ├── *.test.ts       # Unit tests
│   ├── *.test.tsx      # React component tests
│   └── setup.ts        # Test configuration
```

### Running Tests
```bash
# All tests
pnpm test

# Specific file
pnpm test path/to/file.test.ts

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage

# Coverage threshold
pnpm test --coverage --threshold=80
```

### Test Writing Guidelines
- Use **AAA Pattern**: Arrange, Act, Assert
- Write descriptive test names
- Test both happy path and edge cases
- Mock external dependencies
- Maintain >80% code coverage

## 🔒 Security Development

### Environment Variables
Never commit sensitive information:
- API keys
- Database credentials
- JWT secrets
- Production URLs

### Security Testing
```bash
# Test rate limiting
curl -I http://localhost:3001/api/test

# Test security headers
curl -I http://localhost:3001/api/test

# Test CORS
curl -H "Origin: http://evil.com" http://localhost:3001/api/test
```

### Code Security
- Use parameterized queries (Supabase RLS)
- Validate all inputs (Zod schemas)
- Implement proper error handling
- Use HTTPS in production

## 🚀 Deployment Workflow

### Development Deployment
```bash
# Build all packages
pnpm build

# Run production tests
pnpm test

# Deploy to staging
```

### Production Deployment
```bash
# Ensure all tests pass
pnpm test

# Build for production
pnpm build

# Run security checks
pnpm audit

# Deploy
```

### Environment-Specific Configurations
- **Development**: Debug logging, mock data, relaxed security
- **Staging**: Production-like environment, test data
- **Production**: Optimized, secure, monitored

## 🔍 Debugging

### Frontend Debugging
- **Browser DevTools**: Standard web debugging
- **React DevTools**: Component state debugging
- **Network Tab**: API request debugging

### Backend Debugging
- **VS Code Debugger**: Node.js debugging
- **Console Logs**: Structured logging
- **API Testing**: Postman/Insomnia

### Common Debugging Commands
```bash
# Check build process
pnpm build --verbose

# Check package dependencies
pnpm why <package-name>

# Check TypeScript compilation
pnpm type-check

# Check linting issues
pnpm lint --fix
```

## 📊 Performance Monitoring

### Development Tools
- **Vite DevTools**: Build performance
- **React DevTools Profiler**: Component performance
- **Node.js Inspector**: Backend performance

### Production Monitoring (Planned)
- **Application Performance Monitoring (APM)**
- **Error tracking**
- **User analytics**
- **Performance budgets**

## 📝 Documentation Updates

### When to Update Documentation
- New features added
- Architecture changes
- Workflow modifications
- Configuration updates

### Documentation Locations
- **README.md**: Project overview and setup
- **docs/architecture/**: System architecture
- **docs/stories/**: User stories and requirements
- **Code comments**: Complex logic explanations

## 🛠️ Troubleshooting

### Common Issues

#### Dependencies
```bash
# Clear cache
pnpm store prune

# Reinstall
rm -rf node_modules
pnpm install
```

#### Build Issues
```bash
# Clean build
pnpm clean
pnpm build

# Check TypeScript
pnpm type-check
```

#### Test Issues
```bash
# Update snapshots
pnpm test --update-snapshots

# Run specific test
pnpm test path/to/test.test.ts
```

#### Port Conflicts
```bash
# Check port usage
netstat -an | grep :3001
netstat -an | grep :5173

# Kill processes
pkill -f "node.*3001"
pkill -f "vite.*5173"
```

### Getting Help
1. Check this documentation
2. Search existing issues
3. Check error logs
4. Ask team members
5. Create new issue with detailed information

## 📋 Development Checklist

Before committing changes:
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] TypeScript compilation succeeds
- [ ] No ESLint errors
- [ ] Documentation updated (if needed)
- [ ] Security considerations addressed
- [ ] Performance impact considered

Before creating pull request:
- [ ] Feature branch is up to date
- [ ] All tests passing including new ones
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Ready for deployment