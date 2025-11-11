import { z } from 'zod'

/**
 * Shared Environment Configuration
 * Provides type-safe environment variable validation for all packages
 */

// Base environment schema with common variables
const BaseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3001'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
})

// Database environment schema
const DatabaseEnvSchema = BaseEnvSchema.extend({
  DATABASE_URL: z.string().url().optional(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

// Authentication environment schema
const AuthEnvSchema = BaseEnvSchema.extend({
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1h'),
  REFRESH_TOKEN_SECRET: z.string().min(32).optional(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
})

// API environment schema
const ApiEnvSchema = DatabaseEnvSchema.extend({
  API_PREFIX: z.string().default('/api'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().min(1000)).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().min(1)).default('100'),
})

// Web environment schema
const WebEnvSchema = BaseEnvSchema.extend({
  VITE_API_URL: z.string().url().default('http://localhost:3001/api'),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_APP_NAME: z.string().default('GMAO System'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
})

// Development-specific schema
const DevelopmentEnvSchema = z.object({
  ENABLE_DEBUG_LOGS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_MOCK_DATA: z.string().transform(val => val === 'true').default('false'),
  ENABLE_SWAGGER: z.string().transform(val => val === 'true').default('true'),
})

// Production-specific schema
const ProductionEnvSchema = z.object({
  ENABLE_DEBUG_LOGS: z.string().transform(val => val === 'true').default('false'),
  ENABLE_MOCK_DATA: z.string().transform(val => val === 'true').default('false'),
  ENABLE_SWAGGER: z.string().transform(val => val === 'true').default('false'),
  SENTRY_DSN: z.string().url().optional(),
  ANALYTICS_ID: z.string().optional(),
})

// Environment validation function
export function validateEnv<T extends z.ZodSchema>(
  schema: T,
  env: Record<string, string | undefined> = process.env
): z.infer<T> {
  try {
    return schema.parse(env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === 'invalid_type')
        .map(err => `  ${err.path.join('.')}: ${err.message}`)

      const invalidVars = error.errors
        .filter(err => err.code !== 'invalid_type')
        .map(err => `  ${err.path.join('.')}: ${err.message}`)

      let errorMessage = 'Environment validation failed:\n'

      if (missingVars.length > 0) {
        errorMessage += `\nMissing required variables:\n${missingVars.join('\n')}`
      }

      if (invalidVars.length > 0) {
        errorMessage += `\nInvalid variables:\n${invalidVars.join('\n')}`
      }

      throw new Error(errorMessage)
    }
    throw error
  }
}

// Predefined environment configurations
export const createApiConfig = (env: Record<string, string | undefined> = process.env) => {
  const isProduction = env.NODE_ENV === 'production'
  const isDevelopment = env.NODE_ENV === 'development'

  const schema = isProduction
    ? ApiEnvSchema.and(ProductionEnvSchema)
    : isDevelopment
      ? ApiEnvSchema.and(DevelopmentEnvSchema)
      : ApiEnvSchema

  return validateEnv(schema, env)
}

export const createWebConfig = (env: Record<string, string | undefined> = process.env) => {
  const isProduction = env.NODE_ENV === 'production'
  const isDevelopment = env.NODE_ENV === 'development'

  const schema = isProduction
    ? WebEnvSchema.and(ProductionEnvSchema)
    : isDevelopment
      ? WebEnvSchema.and(DevelopmentEnvSchema)
      : WebEnvSchema

  return validateEnv(schema, env)
}

export const createDatabaseConfig = (env: Record<string, string | undefined> = process.env) => {
  return validateEnv(DatabaseEnvSchema, env)
}

export const createAuthConfig = (env: Record<string, string | undefined> = process.env) => {
  return validateEnv(AuthEnvSchema, env)
}

// Configuration types
export type ApiConfig = ReturnType<typeof createApiConfig>
export type WebConfig = ReturnType<typeof createWebConfig>
export type DatabaseConfig = ReturnType<typeof createDatabaseConfig>
export type AuthConfig = ReturnType<typeof createAuthConfig>

// Utility functions
export const isDevelopment = (env: Record<string, string | undefined> = process.env): boolean => {
  return env.NODE_ENV === 'development'
}

export const isProduction = (env: Record<string, string | undefined> = process.env): boolean => {
  return env.NODE_ENV === 'production'
}

export const isTest = (env: Record<string, string | undefined> = process.env): boolean => {
  return env.NODE_ENV === 'test'
}

// Default configurations for different environments
export const defaultConfigs = {
  development: {
    api: {
      NODE_ENV: 'development',
      PORT: '3001',
      LOG_LEVEL: 'debug',
      API_PREFIX: '/api',
      CORS_ORIGIN: 'http://localhost:5173',
      ENABLE_DEBUG_LOGS: 'true',
      ENABLE_SWAGGER: 'true',
    },
    web: {
      NODE_ENV: 'development',
      VITE_API_URL: 'http://localhost:3001/api',
      VITE_APP_NAME: 'GMAO System (Dev)',
      ENABLE_DEBUG_LOGS: 'true',
    }
  },
  production: {
    api: {
      NODE_ENV: 'production',
      LOG_LEVEL: 'info',
      ENABLE_DEBUG_LOGS: 'false',
      ENABLE_SWAGGER: 'false',
    },
    web: {
      NODE_ENV: 'production',
      LOG_LEVEL: 'info',
      ENABLE_DEBUG_LOGS: 'false',
    }
  },
  test: {
    api: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
      ENABLE_DEBUG_LOGS: 'false',
      ENABLE_SWAGGER: 'false',
    },
    web: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
      ENABLE_DEBUG_LOGS: 'false',
    }
  }
} as const

// Export all schemas for external validation
export {
  BaseEnvSchema,
  DatabaseEnvSchema,
  AuthEnvSchema,
  ApiEnvSchema,
  WebEnvSchema,
  DevelopmentEnvSchema,
  ProductionEnvSchema
}