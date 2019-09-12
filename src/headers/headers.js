export function findHeader(headers, name) {
  const lowerName = name.toLowerCase()

  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() == lowerName) {
      return headers[key]
    }
  }

  return void 0
}

function getHeaderName(headers, name) {
  const lowerName = name.toLowerCase()

  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() == lowerName) {
      return key
    }
  }

  return name
}

export function hasHeader(headers, name) {
  const lowerName = name.toLowerCase()

  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() == lowerName) {
      return true
    }
  }

  return false
}

export function addHeaderIfNotPresent(headers, name, value) {
  if (!hasHeader(headers, name)) {
    headers[name] = value
  }
}

export function addHeadersIfNotPresent(headers, newHeaders) {
  for (const key of Object.keys(newHeaders || {})) {
    addHeaderIfNotPresent(headers, key, newHeaders[key])
  }
}

export function replaceHeader(headers, name, value) {
  headers[getHeaderName(headers, name)] = value
}
