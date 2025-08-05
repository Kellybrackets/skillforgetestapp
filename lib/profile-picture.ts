// lib/profile-picture.ts - Profile picture upload functionality
import { createSupabaseClient } from '@/lib/supabase'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export const uploadProfilePicture = async (file: File, userId: string): Promise<UploadResult> => {
  try {
    const supabase = createSupabaseClient()
    
    // Validate file
    const validationError = validateImageFile(file)
    if (validationError) {
      return { success: false, error: validationError }
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`
    
    console.log('📁 Uploading file:', fileName)
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('❌ Upload error:', uploadError)
      return { success: false, error: uploadError.message }
    }
    
    console.log('✅ File uploaded successfully')
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath)
    
    if (!urlData?.publicUrl) {
      return { success: false, error: 'Failed to get public URL' }
    }
    
    return { 
      success: true, 
      url: urlData.publicUrl 
    }
    
  } catch (error: any) {
    console.error('💥 Upload exception:', error)
    return { success: false, error: error.message || 'Upload failed' }
  }
}

export const deleteProfilePicture = async (avatarUrl: string): Promise<boolean> => {
  try {
    const supabase = createSupabaseClient()
    
    console.log('🗑️ Starting deletion for URL:', avatarUrl)
    
    // Extract file path from URL
    const filePath = extractFilePathFromUrl(avatarUrl)
    if (!filePath) {
      console.error('❌ Could not extract file path from URL:', avatarUrl)
      return false
    }
    
    console.log('🗑️ Extracted file path:', filePath)
    
    // Delete from storage
    const { data, error } = await supabase.storage
      .from('profile-pictures')
      .remove([filePath])
    
    if (error) {
      console.error('❌ Storage delete error:', error)
      return false
    }
    
    console.log('✅ File deleted successfully from storage:', data)
    return true
    
  } catch (error) {
    console.error('💥 Delete exception:', error)
    return false
  }
}

const validateImageFile = (file: File): string | null => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return 'File size must be less than 5MB'
  }
  
  return null
}

const extractFilePathFromUrl = (url: string): string | null => {
  try {
    console.log('🔍 Extracting path from URL:', url)
    
    // Handle different URL formats:
    // 1. https://project.supabase.co/storage/v1/object/public/profile-pictures/avatars/filename.jpg
    // 2. https://project.supabase.co/storage/v1/object/profile-pictures/avatars/filename.jpg
    
    let matches = url.match(/\/profile-pictures\/(.+)(?:\?|$)/)
    
    if (!matches) {
      // Try alternative pattern
      matches = url.match(/\/object\/public\/profile-pictures\/(.+)(?:\?|$)/)
    }
    
    if (!matches) {
      // Try another pattern
      matches = url.match(/\/object\/profile-pictures\/(.+)(?:\?|$)/)
    }
    
    const extractedPath = matches ? matches[1] : null
    console.log('🔍 Extracted path:', extractedPath)
    
    return extractedPath
  } catch (error) {
    console.error('💥 Path extraction error:', error)
    return null
  }
}

// Resize image before upload (optional - for better performance)
export const resizeImage = (file: File, maxWidth: number = 300, maxHeight: number = 300, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      // Set canvas size
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            resolve(file) // Fallback to original
          }
        },
        file.type,
        quality
      )
    }
    
    img.src = URL.createObjectURL(file)
  })
}