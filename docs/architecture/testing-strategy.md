# Testing Strategy

## Testing Infrastructure Overview

**Comprehensive Testing Stack:**
- **Unit Testing:** Vitest for both frontend and backend with TypeScript support
- **Integration Testing:** API endpoint testing with isolated test databases
- **E2E Testing:** Playwright with mobile-first approach and device simulation
- **Visual Testing:** Playwright visual regression for UI consistency
- **Performance Testing:** Lighthouse CI for Core Web Vitals monitoring
- **Quality Gates:** ESLint, Prettier, and TypeScript strict mode enforcement

## Testing Pyramid

```
    E2E Tests (Playwright)
    /        \
  Integration Tests (API)
  /            \
Frontend Unit  Backend Unit
     (Vitest)      (Vitest)
```

## Test Organization & Standards

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

## Quality Standards & Enforcement

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

## Mobile-First Testing Strategy

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

## Performance Testing Integration

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

## Test Data Management

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

## CI/CD Integration

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

## Error Handling in Tests

**Test Scenarios:**
- Network failures and timeouts
- Authentication and authorization failures
- Database constraint violations
- File upload and validation errors
- Offline functionality testing
- PWA installation and usage scenarios

## Test Examples

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
