export function isSuccess(method?: string, status?: number): boolean {
  if (typeof status !== 'number') {
    return false
  }

  if (status >= 200 && status < 300) {
    return true
  }

  if (method === 'DELETE' && (status === 404 || status === 410)) {
    return true
  }

  return false
}
