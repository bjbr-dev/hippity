function buildParams(prefix, obj, add) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      add(prefix, obj[i])
    }
  } else {
    add(prefix, obj)
  }
}

export function resolve(path, params) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string')
  }

  if (path.indexOf('~/') === 0) {
    path = path.substring(1)
  }

  if (typeof params === 'undefined' || params === null) {
    return path
  }

  const queryParameters = []
  let pushQueryParameter = function(key, value) {
    queryParameters.push(
      encodeURIComponent(key) +
        '=' +
        encodeURIComponent(value == null ? '' : value)
    )
  }

  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key]
      const placeholder = `{${key}}`

      if (path.indexOf(placeholder) !== -1) {
        path = path.replace(placeholder, encodeURIComponent(value))
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

export function normalizeMethodMiddleware(context, next) {
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

export function resolvingMiddleware(resolve) {
  return function(context, next) {
    if (Array.isArray(context.uri)) {
      return next({ ...context, uri: resolve(context.uri[0], context.uri[1]) })
    } else if (typeof context.uri === 'object') {
      let uri = resolve(context.uri.route, context.uri.params)
      return next({ ...context, uri: uri })
    } else {
      return next()
    }
  }
}

export function defaultUriRootMiddleware(root) {
  return function(context, next) {
    return next({ uriRoot: root, ...context })
  }
}
