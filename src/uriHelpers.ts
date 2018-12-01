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

export function resolve(path: string, params?: RouteValues): string {
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

export const normalizeMethodMiddleware: Middleware = (context, next) => {
  if (!context.method) {
    for (let method of [
      'HEAD',
      'GET',
      'OPTIONS',
      'POST',
      'PUT',
      'PATCH',
      'DELETE'
    ]) {
      if (context.hasOwnProperty(method)) {
        context.method = method
        context.uri = context[method]
        delete context[method]

        break
      }
    }
  }

  return next()
}

export const resolvingMiddleware = (
  resolve: (path: string, params: RouteValues) => string
): Middleware => {
  return function(context, next) {
    if (Array.isArray(context.uri)) {
      return next({
        ...context,
        uri: resolve(context.uri[0] as string, context.uri[1] as RouteValues)
      })
    } else {
      return next()
    }
  }
}

export const defaultUriRootMiddleware = (root: string): Middleware => {
  return function(context, next) {
    return next({ uriRoot: root, ...context })
  }
}
