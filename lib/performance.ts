// Performance monitoring utilities
export const performanceMetrics = {
  // Measure component render times
  measureRender: (componentName: string, fn: () => any) => {
    if (typeof performance === 'undefined') return fn()
    
    const startTime = performance.now()
    const result = fn()
    const endTime = performance.now()
    
    console.log(`⚡ ${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`)
    return result
  },

  // Measure async operations
  measureAsync: async (operationName: string, fn: () => Promise<any>) => {
    if (typeof performance === 'undefined') return await fn()
    
    const startTime = performance.now()
    const result = await fn()
    const endTime = performance.now()
    
    console.log(`⚡ ${operationName} duration: ${(endTime - startTime).toFixed(2)}ms`)
    return result
  },

  // Log Web Vitals
  logWebVitals: (metric: any) => {
    console.log(`📊 Web Vital - ${metric.name}: ${metric.value}${metric.unit || ''} (${metric.rating})`)
  },

  // Debounce utility for search/input optimization
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  },

  // Throttle utility for scroll/resize events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0
    
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }
  },

  // Lazy loading utility
  createLazyComponent: <T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    fallback: React.ReactNode = null
  ) => {
    const LazyComponent = React.lazy(importFn)
    
    return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
      <React.Suspense fallback={fallback}>
        <LazyComponent {...props} ref={ref} />
      </React.Suspense>
    ))
  }
}

// Bundle size analyzer for development
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return
  
  // Estimate JavaScript bundle size
  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const totalSize = scripts.reduce((size, script) => {
    const src = (script as HTMLScriptElement).src
    if (src.includes('/_next/')) {
      // Rough estimation - in production you'd want actual bundle analysis
      return size + 50000 // Placeholder KB estimate
    }
    return size
  }, 0)
  
  console.log(`📦 Estimated bundle size: ${(totalSize / 1024).toFixed(2)} KB`)
}

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window === 'undefined' || !('performance' in window) || !('memory' in (window as any).performance)) {
    return
  }
  
  const memory = (window as any).performance.memory
  console.log(`🧠 Memory usage: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`)
}

// React import
import React from 'react'

// Export performance hooks
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)
  const lastUpdated = React.useRef<number>(0)

  React.useEffect(() => {
    const now = Date.now()
    
    if (now - lastUpdated.current >= delay) {
      setThrottledValue(value)
      lastUpdated.current = now
    } else {
      const timeout = setTimeout(() => {
        setThrottledValue(value)
        lastUpdated.current = Date.now()
      }, delay - (now - lastUpdated.current))
      
      return () => clearTimeout(timeout)
    }
  }, [value, delay])

  return throttledValue
}