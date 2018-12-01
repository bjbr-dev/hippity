import { Middleware } from './restclient'

export const defaultHeaderMiddleware = (defaultHeaders: {
  [x: string]: Object
}): Middleware => {
  if (
    typeof defaultHeaders !== 'object' ||
    defaultHeaders === null ||
    Array.isArray(defaultHeaders)
  ) {
    throw new TypeError('Default headers should be an object')
  }

  return (request, next) => {
    return next({
      ...request,
      headers: {
        ...defaultHeaders['common'],
        ...(typeof request.method === 'string'
          ? defaultHeaders[request.method]
          : null),
        ...request.headers
      }
    })
  }
}
