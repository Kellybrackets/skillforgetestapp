// lib/utils/data-migration.ts - Data migration utility for moving to database
import { migrateLearningPathDataAPI } from '@/lib/api/learning-paths-api'

/**
 * Migration manager for moving from static data to database
 */
export class DataMigrationManager {
  private static readonly MIGRATION_KEYS = {
    LEARNING_PATHS_MIGRATED: 'skillforge_learning_paths_migrated',
    LAST_MIGRATION_CHECK: 'skillforge_last_migration_check'
  }

  private static readonly MIGRATION_CHECK_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours

  /**
   * Check if learning paths have been migrated to database
   */
  static hasLearningPathsMigrated(): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      const migrated = localStorage.getItem(this.MIGRATION_KEYS.LEARNING_PATHS_MIGRATED)
      return migrated === 'true'
    } catch (error) {
      console.error('Error checking migration status:', error)
      return false
    }
  }

  /**
   * Mark learning paths as migrated
   */
  static markLearningPathsMigrated(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.MIGRATION_KEYS.LEARNING_PATHS_MIGRATED, 'true')
      localStorage.setItem(this.MIGRATION_KEYS.LAST_MIGRATION_CHECK, Date.now().toString())
    } catch (error) {
      console.error('Error marking migration status:', error)
    }
  }

  /**
   * Check if we should attempt migration (not too frequent)
   */
  static shouldAttemptMigration(): boolean {
    if (typeof window === 'undefined') return false
    if (this.hasLearningPathsMigrated()) return false
    
    try {
      const lastCheck = localStorage.getItem(this.MIGRATION_KEYS.LAST_MIGRATION_CHECK)
      if (!lastCheck) return true
      
      const timeSinceLastCheck = Date.now() - parseInt(lastCheck)
      return timeSinceLastCheck > this.MIGRATION_CHECK_INTERVAL
    } catch (error) {
      console.error('Error checking migration interval:', error)
      return true
    }
  }

  /**
   * Attempt to migrate learning paths data to database
   */
  static async migrateLearningPaths(): Promise<boolean> {
    if (!this.shouldAttemptMigration()) {
      console.log('📦 Skipping migration - not due or already completed')
      return false
    }

    try {
      console.log('🔄 Starting learning paths migration...')
      
      // Update last check time to prevent frequent retries
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.MIGRATION_KEYS.LAST_MIGRATION_CHECK, Date.now().toString())
      }
      
      const success = await migrateLearningPathDataAPI()
      
      if (success) {
        console.log('✅ Learning paths migration completed successfully')
        this.markLearningPathsMigrated()
        return true
      } else {
        console.warn('⚠️ Learning paths migration failed')
        return false
      }
    } catch (error) {
      console.error('❌ Error during learning paths migration:', error)
      return false
    }
  }

  /**
   * Reset migration status (for testing or manual re-migration)
   */
  static resetMigrationStatus(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(this.MIGRATION_KEYS.LEARNING_PATHS_MIGRATED)
      localStorage.removeItem(this.MIGRATION_KEYS.LAST_MIGRATION_CHECK)
      console.log('🔄 Migration status reset - will attempt migration on next load')
    } catch (error) {
      console.error('Error resetting migration status:', error)
    }
  }

  /**
   * Get migration status info for debugging
   */
  static getMigrationStatus(): {
    migrated: boolean
    lastCheck: string | null
    shouldAttempt: boolean
  } {
    return {
      migrated: this.hasLearningPathsMigrated(),
      lastCheck: typeof window !== 'undefined' 
        ? localStorage.getItem(this.MIGRATION_KEYS.LAST_MIGRATION_CHECK) 
        : null,
      shouldAttempt: this.shouldAttemptMigration()
    }
  }
}

/**
 * Hook to automatically attempt migration on app startup
 */
export function useDataMigration() {
  const attemptMigration = async () => {
    try {
      await DataMigrationManager.migrateLearningPaths()
    } catch (error) {
      console.error('Auto-migration failed:', error)
    }
  }

  return {
    attemptMigration,
    migrationStatus: DataMigrationManager.getMigrationStatus(),
    resetMigration: DataMigrationManager.resetMigrationStatus
  }
}

// Export utility functions
export const {
  hasLearningPathsMigrated,
  markLearningPathsMigrated,
  shouldAttemptMigration,
  migrateLearningPaths,
  resetMigrationStatus,
  getMigrationStatus
} = DataMigrationManager