export function defaultHeaderMiddleware(defaultHeaders) {
  if (
    typeof defaultHeaders !== 'object' ||
    defaultHeaders === null ||
    Array.isArray(defaultHeaders)
  ) {
    throw new TypeError('Default headers should be an object')
  }

  return function(context, next) {
    let nextContext = {
      ...context,
      headers: {
        ...defaultHeaders['common'],
        ...defaultHeaders[context.method],
        ...context.headers
      }
    }

    return next(nextContext)
  }
}
