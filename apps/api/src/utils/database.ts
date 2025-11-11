import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { logger } from './logger.js';

// Database configuration - TEMPORAL: Configurar directamente aquí
// Reemplaza estos valores con los de tu proyecto Supabase
const supabaseUrl =
  process.env.SUPABASE_URL || 'https://jkyeouiicdcpmkpsaolq.supabase.co';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreWVvdWlpY2RjcG1rcHNhb2xxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcyMzMyOCwiZXhwIjoyMDc4Mjk5MzI4fQ.ZFTn3VQLQclUP38TXWJYS2lwHMG1Hw4kuuDKw02xBr8';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Connection pool configuration
const connectionConfig = {
  max: parseInt(process.env.DATABASE_POOL_MAX || '10'),
  min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
  idleTimeoutMillis: parseInt(
    process.env.DATABASE_POOL_IDLE_TIMEOUT || '30000'
  ),
  connectionTimeoutMillis: parseInt(
    process.env.DATABASE_CONNECTION_TIMEOUT || '10000'
  ),
};

// Circuit breaker state
interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

const circuitBreakerConfig = {
  failureThreshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5'),
  timeout: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT || '30000'),
  monitoringPeriod: 60000, // 1 minute
};

let circuitBreakerState: CircuitBreakerState = {
  isOpen: false,
  failureCount: 0,
  lastFailureTime: 0,
  nextAttemptTime: 0,
};

// Retry configuration
const retryConfig = {
  maxAttempts: parseInt(process.env.RETRY_MAX_ATTEMPTS || '3'),
  baseDelay: parseInt(process.env.RETRY_BASE_DELAY || '100'),
  maxDelay: 5000,
};

// Create Supabase client with optimized settings
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'gmao-api/1.0.0',
    },
  },
});

// Circuit breaker functions
const isCircuitBreakerOpen = (): boolean => {
  const now = Date.now();

  if (
    circuitBreakerState.isOpen &&
    now >= circuitBreakerState.nextAttemptTime
  ) {
    // Try to close the circuit
    circuitBreakerState.isOpen = false;
    circuitBreakerState.failureCount = 0;
    logger.info('Circuit breaker attempting to close');
    return false;
  }

  return circuitBreakerState.isOpen;
};

const recordCircuitBreakerFailure = (): void => {
  circuitBreakerState.failureCount++;
  circuitBreakerState.lastFailureTime = Date.now();

  if (
    circuitBreakerState.failureCount >= circuitBreakerConfig.failureThreshold
  ) {
    circuitBreakerState.isOpen = true;
    circuitBreakerState.nextAttemptTime =
      Date.now() + circuitBreakerConfig.timeout;
    logger.error(
      `Circuit breaker opened after ${circuitBreakerState.failureCount} failures`
    );
  }
};

const recordCircuitBreakerSuccess = (): void => {
  if (circuitBreakerState.failureCount > 0) {
    circuitBreakerState.failureCount = Math.max(
      0,
      circuitBreakerState.failureCount - 1
    );
  }
};

// Exponential backoff retry helper
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const calculateDelay = (attempt: number): number => {
  const delay = retryConfig.baseDelay * Math.pow(2, attempt);
  return Math.min(delay, retryConfig.maxDelay);
};

// Database operation wrapper with circuit breaker and retry logic
export const withDatabaseRetry = async <T>(
  operation: () => Promise<T>,
  operationName: string = 'database operation'
): Promise<T> => {
  // Check circuit breaker
  if (isCircuitBreakerOpen()) {
    const error = new Error(
      'Database temporarily unavailable (circuit breaker open)'
    );
    logger.warn(`Circuit breaker open for ${operationName}`);
    throw error;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retryConfig.maxAttempts; attempt++) {
    try {
      const result = await operation();

      // Record success
      recordCircuitBreakerSuccess();

      if (attempt > 0) {
        logger.info(`${operationName} succeeded after ${attempt + 1} attempts`);
      }

      return result;
    } catch (error) {
      lastError = error as Error;

      if (attempt < retryConfig.maxAttempts - 1) {
        const delay = calculateDelay(attempt);
        logger.warn(
          `${operationName} failed (attempt ${attempt + 1}/${retryConfig.maxAttempts}), retrying in ${delay}ms: ${lastError.message}`
        );
        await sleep(delay);
      } else {
        recordCircuitBreakerFailure();
        logger.error(
          `${operationName} failed after ${retryConfig.maxAttempts} attempts: ${lastError.message}`
        );
      }
    }
  }

  throw lastError;
};

// Health check function
export const checkDatabaseHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  details?: any;
}> => {
  try {
    const startTime = Date.now();
    const { error } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
      .limit(1);
    const responseTime = Date.now() - startTime;

    if (error) {
      return {
        status: 'unhealthy',
        details: { error: error.message, responseTime },
      };
    }

    return {
      status: 'healthy',
      details: { responseTime, circuitBreakerOpen: circuitBreakerState.isOpen },
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: (error as Error).message,
        circuitBreakerOpen: circuitBreakerState.isOpen,
      },
    };
  }
};

// Get circuit breaker status for monitoring
export const getCircuitBreakerStatus = () => {
  return {
    ...circuitBreakerState,
    config: circuitBreakerConfig,
  };
};

// Reset circuit breaker (for admin/maintenance)
export const resetCircuitBreaker = (): void => {
  circuitBreakerState = {
    isOpen: false,
    failureCount: 0,
    lastFailureTime: 0,
    nextAttemptTime: 0,
  };
  logger.info('Circuit breaker manually reset');
};

// Export the Supabase client for direct use when needed
export { supabase };

// Export database utility functions
export const dbUtils = {
  withRetry: withDatabaseRetry,
  checkHealth: checkDatabaseHealth,
  getCircuitBreakerStatus,
  resetCircuitBreaker,
};

// Database connection metrics
export const getDatabaseMetrics = () => {
  return {
    circuitBreaker: getCircuitBreakerStatus(),
    retryConfig,
    connectionConfig,
  };
};
