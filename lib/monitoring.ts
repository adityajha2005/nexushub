export function logError(error: Error, context?: string) {
  console.error(`[${context || 'ERROR'}]:`, error)
  // Add your preferred error tracking service here
}

export function logInfo(message: string, data?: any) {
  console.log(`[INFO]: ${message}`, data)
} 