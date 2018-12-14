import { RouteValue, RouteValues } from './restclient'

function buildParams(
  prefix: string,
  obj: RouteValue | RouteValue[],
  add: (prefix: string, obj: RouteValue) => void
) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      add(prefix, obj[i])
    }
  } else {
    add(prefix, obj)
  }
}

export function resolve(
  path: string,
  params?: RouteValues | undefined | null
): string {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string')
  }

  if (typeof params === 'undefined' || params === null) {
    return path
  }

  const queryParameters: string[] = []
  let pushQueryParameter = function(key: string, value: RouteValue) {
    queryParameters.push(
      encodeURIComponent(key) +
        '=' +
        encodeURIComponent(value == null ? '' : value.toString())
    )
  }

  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key]
      const placeholder = `{${key}}`

      if (path.indexOf(placeholder) !== -1) {
        path = path.replace(placeholder, encodeURIComponent(value as string))
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
