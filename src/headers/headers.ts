import { HippityResponseHeaders } from '~/client'

export function findHeader(
  headers: HippityResponseHeaders,
  name: string
): string | string[] | undefined {
  const lowerName = name.toLowerCase()

  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() == lowerName) {
      return headers[key]
    }
  }

  return void 0
}

function getHeaderName(headers: HippityResponseHeaders, name: string): string {
  const lowerName = name.toLowerCase()

  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() == lowerName) {
      return key
    }
  }

  return name
}

export function hasHeader(
  headers: HippityResponseHeaders,
  name: string
): boolean {
  const lowerName = name.toLowerCase()

  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() == lowerName) {
      return true
    }
  }

  return false
}

export function addHeaderIfNotPresent(
  headers: HippityResponseHeaders,
  name: string,
  value: string | string[]
): void {
  if (!hasHeader(headers, name)) {
    headers[name] = value
  }
}

export function addHeadersIfNotPresent(
  headers: HippityResponseHeaders,
  newHeaders: HippityResponseHeaders
): void {
  for (const key of Object.keys(newHeaders || {})) {
    addHeaderIfNotPresent(headers, key, newHeaders[key])
  }
}

export function replaceHeader(
  headers: HippityResponseHeaders,
  name: string,
  value: string
): void {
  headers[getHeaderName(headers, name)] = value
}
