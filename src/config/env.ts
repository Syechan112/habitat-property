export const APP_NAME = 'HABITAT Properties'
export const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const isValidEnv = (): boolean => {
  return !!(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    CLOUDINARY_CLOUD_NAME
  )
}