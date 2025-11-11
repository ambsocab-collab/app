# Configuration Guide

This document provides comprehensive information about all configuration files and settings in the GMAO Maintenance Management System.

## 🔧 Configuration Overview

The project uses a hierarchical configuration system:

1. **Root Configuration**: Global settings for all packages
2. **Package Configuration**: Package-specific settings
3. **Environment Configuration**: Runtime environment variables
4. **Build Configuration**: Development and production builds

## 📁 Root Configuration Files

### package.json
```json
{
  "name": "gmaoapp",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "pnpm --parallel --filter web dev --filter api dev",
    "build": "pnpm --filter web build --filter api build",
    "test": "pnpm --recursive test",
    "lint": "pnpm --recursive lint",
    "type-check": "pnpm --recursive type-check",
    "format": "prettier --write .",
    "clean": "pnpm --recursive clean"
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### tsconfig.json (Root)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@gmao/shared": ["./packages/shared/src"],
      "@gmao/ui": ["./packages/ui/src"],
      "@gmao/web": ["./apps/web/src"],
      "@gmao/api": ["./apps/api/src"]
    }
  },
  "include": ["packages/*/src/**/*", "apps/*/src/**/*"]
}
```

### .eslintrc.js
```javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn'
  }
}
```

## 🏗️ Package Configuration

### Web Application (apps/web)

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), VitePWA({...})],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@ui': path.resolve(__dirname, '../../packages/ui/src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
})
```

#### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    },
  },
  plugins: [],
}
```

#### tsconfig.json
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### API Application (apps/api)

#### tsconfig.json
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "composite": true,
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Shared Package (packages/shared)

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "composite": true,
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.config.*'
      ]
    }
  }
})
```

## 🌍 Environment Configuration

### Environment Variables Structure

The project uses a comprehensive environment configuration system managed through the shared package.

#### Configuration Schemas

**Base Environment Schema**
```typescript
{
  NODE_ENV: 'development' | 'production' | 'test',
  PORT: number,
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug'
}
```

**Database Schema**
```typescript
{
  DATABASE_URL?: string,
  SUPABASE_URL: string,
  SUPABASE_ANON_KEY: string,
  SUPABASE_SERVICE_ROLE_KEY: string
}
```

**API Schema**
```typescript
{
  API_PREFIX: string,
  CORS_ORIGIN: string,
  RATE_LIMIT_WINDOW_MS: number,
  RATE_LIMIT_MAX_REQUESTS: number
}
```

**Web Schema**
```typescript
{
  VITE_API_URL: string,
  VITE_SUPABASE_URL: string,
  VITE_SUPABASE_ANON_KEY: string,
  VITE_APP_NAME: string,
  VITE_APP_VERSION: string
}
```

### Environment Files

#### Root .env.example
```env
# Application Environment
NODE_ENV=development

# Logging
LOG_LEVEL=info

# Database (Supabase)
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Security
JWT_SECRET=
REFRESH_TOKEN_SECRET=

# API Configuration
API_PREFIX=/api
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=GMAO System
VITE_APP_VERSION=1.0.0
```

#### apps/web/.env.example
```env
# Application
VITE_APP_NAME=GMAO System
VITE_APP_VERSION=1.0.0

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_URL=http://localhost:3001/api
```

#### apps/api/.env.example
```env
# Server Configuration
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
JWT_SECRET=your_jwt_secret_at_least_32_characters_long
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Security Configuration
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Development Features
ENABLE_DEBUG_LOGS=true
ENABLE_SWAGGER=true
ENABLE_MOCK_DATA=false
```

### Environment Validation

All environment variables are validated using Zod schemas. The validation provides:

- **Type Safety**: Automatic type conversion and validation
- **Error Messages**: Clear error messages for missing/invalid variables
- **Defaults**: Sensible defaults for optional variables
- **Development Helpers**: Additional validation in development mode

#### Usage Example
```typescript
import { createApiConfig, createWebConfig } from '@gmao/shared/config'

// API Configuration
const apiConfig = createApiConfig(process.env)

// Web Configuration
const webConfig = createWebConfig(process.env)

// Type-safe access
const port = apiConfig.PORT // number
const supabaseUrl = apiConfig.SUPABASE_URL // string
```

## 🔐 Security Configuration

### Rate Limiting Configuration

#### Rate Limit Tiers
```typescript
// General API rate limiting
{
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false
}

// Authentication rate limiting (strict)
{
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  skipSuccessfulRequests: false
}

// Progressive rate limiting
{
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // Reduces limit based on violation count
    const violations = getViolationCount(req.ip)
    return Math.max(5, 100 - (violations * 20))
  }
}
```

### Security Headers Configuration

#### Helmet Configuration
```typescript
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.supabase.io"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}
```

### CORS Configuration

#### Development CORS
```typescript
{
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}
```

#### Production CORS
```typescript
{
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://yourdomain.com',
      'https://app.yourdomain.com'
    ]
    return callback(null, allowedOrigins.includes(origin))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}
```

## 🧪 Testing Configuration

### Vitest Configuration

#### Shared Package (packages/shared/vitest.config.ts)
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.config.*'
      ]
    }
  }
})
```

#### Web Application (apps/web/vite.config.ts)
```typescript
export default defineConfig({
  // ... other config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true
  }
})
```

### Test Setup Configuration

#### Web Application Test Setup (apps/web/src/test/setup.ts)
```typescript
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
```

## 🏗️ Build Configuration

### Development Build Configuration

#### Vite Development (apps/web)
```typescript
{
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    sourcemap: true,
    minify: false
  }
}
```

#### TypeScript Development (apps/api)
```typescript
{
  compilerOptions: {
    sourceMap: true,
    inlineSourceMap: true,
    outDir: './dist'
  }
}
```

### Production Build Configuration

#### Vite Production (apps/web)
```typescript
{
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react'],
          utils: ['clsx', 'zustand']
        }
      }
    }
  }
}
```

## 📋 Configuration Checklist

### Development Setup
- [ ] Environment variables configured for all packages
- [ ] TypeScript configuration extended from root
- [ ] ESLint configuration shared across packages
- [ ] Testing framework configured
- [ ] Development servers configured with hot reload

### Production Setup
- [ ] Environment variables configured for production
- [ ] Build optimization configured
- [ ] Security headers configured
- [ ] Rate limiting configured
- [ ] Error handling configured

### Security Configuration
- [ ] Environment validation implemented
- [ ] CORS properly configured
- [ ] Rate limiting tiers implemented
- [ ] Security headers configured
- [ ] Input validation implemented

### Testing Configuration
- [ ] Unit tests configured for all packages
- [ ] Integration tests configured
- [ ] Test environment setup configured
- [ ] Coverage reporting configured
- [ ] CI/CD testing configured