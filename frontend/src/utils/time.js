export function timeAgo(dateInput) {
  const date = new Date(dateInput)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks}w ago`
  }
  if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months}mo ago`
  }
  const years = Math.floor(days / 365)
  return `${years}y ago`
}
