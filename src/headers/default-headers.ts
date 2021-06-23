import { HippityRequestHeaders } from '../client'
import { HippityRequestTransform } from '../transform-middleware'
import { addHeadersIfNotPresent } from './headers'

export type DefaultHeaderLookup = {
  [method: string]: HippityRequestHeaders
}

export const defaultHeaders = (
  defaultHeaders: DefaultHeaderLookup
): HippityRequestTransform => {
  if (
    typeof defaultHeaders !== 'object' ||
    defaultHeaders === null ||
    Array.isArray(defaultHeaders)
  ) {
    throw new TypeError('Default headers should be an object')
  }

  return (request) => {
    const headers = { ...request.headers }

    const method = request.method
    if (typeof method === 'string') {
      addHeadersIfNotPresent(headers, defaultHeaders[method])
    }

    addHeadersIfNotPresent(headers, defaultHeaders.common)

    return { ...request, headers }
  }
}
