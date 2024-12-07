export function getAvatarUrl(seed: string) {
  const styles = ['personas', 'bottts', 'avataaars']
  const style = styles[Math.abs(hashCode(seed)) % styles.length] // Consistent style for same user
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`
}

// Simple hash function to get consistent style for same user
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
} 