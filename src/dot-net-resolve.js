function buildParams(key, value, add) {
  if (typeof value === 'undefined') {
    return
  }

  if (value !== null && typeof value === 'object') {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        buildParams(`${key}[${i}]`, value[i], add)
      }
    } else {
      for (const subKey in value) {
        if (value.hasOwnProperty(subKey)) {
          buildParams(`${key}.${subKey}`, value[subKey], add)
        }
      }
    }
  } else {
    add(key, value)
  }
}

export function dotNetResolve(path, params) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string')
  }

  if (typeof params === 'undefined' || params === null) {
    return path
  }

  const queryParameters = []
  const pushQueryParameter = function(key, value) {
    queryParameters.push(
      encodeURIComponent(key) +
        '=' +
        encodeURIComponent(value == null ? '' : value.toString())
    )
  }

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key]
      const placeholder = `{${key}}`

      if (path.indexOf(placeholder) >= 0) {
        do {
          path = path.replace(placeholder, encodeURIComponent(value))
        } while (path.indexOf(placeholder) >= 0)
      } else {
        buildParams(key, value, pushQueryParameter)
      }
    }
  }

  if (queryParameters.length === 0) {
    return path
  }

  // Check if the url already has a query string
  return path + (path.indexOf('?') < 0 ? '?' : '&') + queryParameters.join('&')
}
