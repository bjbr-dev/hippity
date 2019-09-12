import { addHeadersIfNotPresent } from './headers'

export const defaultHeaders = defaultHeaders => {
  if (
    typeof defaultHeaders !== 'object' ||
    defaultHeaders === null ||
    Array.isArray(defaultHeaders)
  ) {
    throw new TypeError('Default headers should be an object')
  }

  return request => {
    const headers = { ...request.headers }

    const method = request.method
    if (typeof method === 'string') {
      addHeadersIfNotPresent(headers, defaultHeaders[method])
    }

    addHeadersIfNotPresent(headers, defaultHeaders.common)

    return { ...request, headers }
  }
}
