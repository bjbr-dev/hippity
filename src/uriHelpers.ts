import { Middleware, RouteValue, RouteValues } from './restclient'

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

  if (path.indexOf('~/') === 0) {
    path = path.substring(1)
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

export const normalizeMethodMiddleware: Middleware = (request, next) => {
  if (!request.method) {
    for (let method of [
      'HEAD',
      'GET',
      'OPTIONS',
      'POST',
      'PUT',
      'PATCH',
      'DELETE'
    ]) {
      if (request.hasOwnProperty(method)) {
        request.method = method
        request.uri = request[method]
        delete request[method]

        break
      }
    }
  }

  return next()
}

export const resolvingMiddleware = (
  resolve: (path: string, params: RouteValues | undefined) => string
): Middleware => {
  return function(request, next) {
    if (Array.isArray(request.uri)) {
      return next({
        ...request,
        uri: resolve(request.uri[0], request.uri[1])
      })
    } else {
      return next()
    }
  }
}

export const defaultUriRootMiddleware = (root: string): Middleware => {
  return function(request, next) {
    return next({ uriRoot: root, ...request })
  }
}
