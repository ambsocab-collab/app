# Coding Standards

## Critical Fullstack Rules

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

## Naming Conventions

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
