import { Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

export interface PerformanceMetrics {
  cls: number | null
  inp: number | null
  fcp: number | null
  lcp: number | null
  ttfb: number | null
}

export interface PerformanceThresholds {
  cls: number
  inp: number
  fcp: number
  lcp: number
  ttfb: number
}

const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  cls: 0.1,        // Cumulative Layout Shift
  inp: 200,        // Interaction to Next Paint (ms)
  fcp: 1800,       // First Contentful Paint (ms)
  lcp: 2500,       // Largest Contentful Paint (ms)
  ttfb: 800        // Time to First Byte (ms)
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    cls: null,
    inp: null,
    fcp: null,
    lcp: null,
    ttfb: null
  }

  private observers: PerformanceObserver[] = []
  private isMonitoring = false

  constructor() {
    // Only run in browser and production
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
      return
    }
  }

  startMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') {
      return
    }

    this.isMonitoring = true

    // Core Web Vitals monitoring
    this.setupWebVitals()

    // Bundle size monitoring
    this.setupBundleSizeMonitoring()

    // Resource timing monitoring
    this.setupResourceTimingMonitoring()
  }

  private setupWebVitals(): void {
    const sendToAnalytics = (metric: Metric): void => {
      this.metrics[metric.name.toLowerCase() as keyof PerformanceMetrics] = metric.value

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${metric.name}:`, metric.value, metric.rating)
      }

      // Send to analytics service in production
      if (process.env.NODE_ENV === 'production') {
        this.sendToAnalyticsService(metric)
      }

      // Check performance thresholds
      this.checkPerformanceThresholds(metric)
    }

    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  }

  private setupBundleSizeMonitoring(): void {
    // Monitor bundle sizes
    setTimeout(() => {
      if ((performance as any).memory) {
        const memoryUsage = {
          used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
        }

        console.log('[Memory Usage]', memoryUsage)

        // Alert if memory usage is high
        if (memoryUsage.used > memoryUsage.limit * 0.8) {
          console.warn('[Performance Warning] High memory usage detected:', memoryUsage)
        }
      }
    }, 5000) // Check after page load
  }

  private setupResourceTimingMonitoring(): void {
    // Monitor slow resources
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 2000) { // 2 second threshold
          console.warn('[Performance Warning] Slow resource detected:', {
            name: entry.name,
            duration: Math.round(entry.duration),
            size: (entry as PerformanceResourceTiming).transferSize || 'unknown'
          })
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    } catch (e) {
      // PerformanceObserver might not be available
      console.log('[Performance] Resource timing monitoring not available')
    }
  }

  private sendToAnalyticsService(metric: Metric): void {
    // Send to Vercel Analytics or custom endpoint
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }
  }

  private checkPerformanceThresholds(metric: Metric): void {
    const threshold = PERFORMANCE_THRESHOLDS[metric.name.toLowerCase() as keyof PerformanceThresholds]
    const value = metric.value

    if (threshold && value > threshold) {
      console.warn(`[Performance] ${metric.name} exceeds threshold:`, {
        value: Math.round(value),
        threshold,
        rating: metric.rating
      })

      // In production, you might want to send this to an error tracking service
      if (process.env.NODE_ENV === 'production') {
        // Send to error tracking service
        this.reportPerformanceIssue(metric.name, value, threshold)
      }
    }
  }

  private reportPerformanceIssue(metricName: string, value: number, threshold: number): void {
    // Send to error tracking service like Sentry
    console.error('[Performance Issue]', {
      metric: metricName,
      value: Math.round(value),
      threshold,
      url: window.location.href,
      userAgent: navigator.userAgent
    })
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.isMonitoring = false
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Auto-start monitoring in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Start monitoring after page load
  if (document.readyState === 'complete') {
    performanceMonitor.startMonitoring()
  } else {
    window.addEventListener('load', () => {
      performanceMonitor.startMonitoring()
    })
  }
}