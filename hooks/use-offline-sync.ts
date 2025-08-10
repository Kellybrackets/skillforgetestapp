// hooks/use-offline-sync.ts - Hook for managing offline/online synchronization
'use client'

import { useEffect, useState } from 'react'
import { syncLocalProgressToDatabase } from '@/lib/database/learning-paths'
import { useDataMigration } from '@/lib/utils/data-migration'

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)
  const { attemptMigration } = useDataMigration()

  // Monitor online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Set initial status
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Cleanup
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // Sync when coming back online
  useEffect(() => {
    if (isOnline && !isSyncing) {
      handleSync()
    }
  }, [isOnline])

  // Periodic sync when online
  useEffect(() => {
    if (!isOnline) return

    const syncInterval = setInterval(() => {
      if (!isSyncing) {
        handleSync()
      }
    }, 5 * 60 * 1000) // Sync every 5 minutes

    return () => clearInterval(syncInterval)
  }, [isOnline, isSyncing])

  const handleSync = async () => {
    if (!isOnline || isSyncing) return

    setIsSyncing(true)
    
    try {
      console.log('🔄 Starting offline sync...')
      
      // Attempt data migration if needed
      await attemptMigration()
      
      // Sync local progress to database
      await syncLocalProgressToDatabase()
      
      setLastSyncTime(Date.now())
      console.log('✅ Offline sync completed')
      
    } catch (error) {
      console.error('❌ Sync failed:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const forcSync = () => {
    if (!isSyncing) {
      handleSync()
    }
  }

  const getSyncStatus = () => {
    if (!isOnline) return 'offline'
    if (isSyncing) return 'syncing'
    return 'online'
  }

  const getLastSyncText = () => {
    if (!lastSyncTime) return 'Never synced'
    
    const now = Date.now()
    const diff = now - lastSyncTime
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return 'Just synced'
    if (minutes === 1) return '1 minute ago'
    if (minutes < 60) return `${minutes} minutes ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hour ago'
    if (hours < 24) return `${hours} hours ago`
    
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    syncStatus: getSyncStatus(),
    lastSyncText: getLastSyncText(),
    forceSync: forcSync
  }
}

// Hook for checking if data needs sync
export function useDataSyncStatus() {
  const [hasPendingSync, setHasPendingSync] = useState(false)
  
  useEffect(() => {
    const checkSyncStatus = () => {
      if (typeof window === 'undefined') return
      
      try {
        const syncQueue = localStorage.getItem('skillforge_sync_queue')
        const queue = syncQueue ? JSON.parse(syncQueue) : []
        setHasPendingSync(queue.length > 0)
      } catch (error) {
        console.error('Error checking sync status:', error)
      }
    }
    
    // Check initially
    checkSyncStatus()
    
    // Check periodically
    const interval = setInterval(checkSyncStatus, 30 * 1000) // Every 30 seconds
    
    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'skillforge_sync_queue') {
        checkSyncStatus()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  
  return { hasPendingSync }
}