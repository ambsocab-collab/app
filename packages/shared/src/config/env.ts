import { z } from 'zod'

// Environment variable schema for shared configuration
const SharedEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_PROJECT_ID: z.string().min(1),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  APP_NAME: z.string().default('GMAO Maintenance Management System'),
  APP_VERSION: z.string().default('1.0.0'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json')
})

// Validate environment variables
export function validateSharedEnv() {
  try {
    return SharedEnvSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
      APP_NAME: process.env.APP_NAME,
      APP_VERSION: process.env.APP_VERSION,
      LOG_LEVEL: process.env.LOG_LEVEL,
      LOG_FORMAT: process.env.LOG_FORMAT
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => `- ${e.path.join('.')}: ${e.message}`).join('\n')
      throw new Error(`Invalid environment variables:\n${missingVars}`)
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateSharedEnv()

// Export type for environment variables
export type SharedEnv = z.infer<typeof SharedEnvSchema>