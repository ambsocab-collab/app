import { NextFunction, Request, Response } from 'express'
import { logger } from '../utils/logger.js'

// Performance metrics storage
interface PerformanceMetrics {
  totalRequests: number
  totalResponseTime: number
  errorCount: number
  lastReset: Date
  responseTimeHistory: Array<{
    timestamp: Date
    responseTime: number
    statusCode: number
    method: string
    path: string
  }>
}

const metrics: PerformanceMetrics = {
  totalRequests: 0,
  totalResponseTime: 0,
  errorCount: 0,
  lastReset: new Date(),
  responseTimeHistory: []
}

// Performance alert thresholds
const ALERT_THRESHOLDS = {
  responseTime: 500, // ms
  errorRate: 0.01, // 1%
  memoryUsage: 512 * 1024 * 1024, // 512MB in bytes
  cpuUsage: 0.7 // 70%
}

// Performance metrics middleware
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()

  // Track response
  res.on('finish', () => {
    const responseTime = Date.now() - startTime
    const statusCode = res.statusCode
    const isError = statusCode >= 400

    // Update metrics
    metrics.totalRequests++
    metrics.totalResponseTime += responseTime

    if (isError) {
      metrics.errorCount++
    }

    // Add to history (keep last 1000 entries)
    metrics.responseTimeHistory.push({
      timestamp: new Date(),
      responseTime,
      statusCode,
      method: req.method,
      path: req.path
    })

    if (metrics.responseTimeHistory.length > 1000) {
      metrics.responseTimeHistory.shift()
    }

    // Log performance data
    logger.http(`${req.method} ${req.path} - ${statusCode} - ${responseTime}ms`)

    // Check for performance alerts
    checkPerformanceAlerts(responseTime, isError)
  })

  next()
}

// Check for performance alerts
const checkPerformanceAlerts = (responseTime: number, _isError: boolean) => {
  // Check response time alert
  if (responseTime > ALERT_THRESHOLDS.responseTime) {
    logger.warn(`Performance Alert: High response time detected - ${responseTime}ms`)
  }

  // Check error rate alert
  const errorRate = metrics.errorCount / metrics.totalRequests
  if (errorRate > ALERT_THRESHOLDS.errorRate && metrics.totalRequests > 10) {
    logger.warn(`Performance Alert: High error rate detected - ${(errorRate * 100).toFixed(2)}%`)
  }

  // Check memory usage alert
  const memoryUsage = process.memoryUsage()
  if (memoryUsage.heapUsed > ALERT_THRESHOLDS.memoryUsage) {
    logger.warn(`Performance Alert: High memory usage detected - ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`)
  }
}

// Get current metrics
export const getMetrics = () => {
  const averageResponseTime = metrics.totalRequests > 0
    ? metrics.totalResponseTime / metrics.totalRequests
    : 0

  const errorRate = metrics.totalRequests > 0
    ? metrics.errorCount / metrics.totalRequests
    : 0

  const uptime = process.uptime()
  const memoryUsage = process.memoryUsage()

  return {
    ...metrics,
    averageResponseTime: Math.round(averageResponseTime * 100) / 100,
    errorRate: Math.round(errorRate * 10000) / 100, // percentage with 2 decimal places
    uptime,
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100,
      external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100
    },
    alerts: {
      responseTime: averageResponseTime > ALERT_THRESHOLDS.responseTime,
      errorRate: errorRate > ALERT_THRESHOLDS.errorRate,
      memoryUsage: memoryUsage.heapUsed > ALERT_THRESHOLDS.memoryUsage
    }
  }
}

// Reset metrics
export const resetMetrics = () => {
  metrics.totalRequests = 0
  metrics.totalResponseTime = 0
  metrics.errorCount = 0
  metrics.lastReset = new Date()
  metrics.responseTimeHistory = []
}

// Get recent performance history
export const getPerformanceHistory = (limit: number = 100) => {
  return metrics.responseTimeHistory.slice(-limit)
}