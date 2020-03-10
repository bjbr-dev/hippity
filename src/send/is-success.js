export function isSuccess(method, status) {
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
