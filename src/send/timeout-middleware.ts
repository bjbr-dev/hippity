import { HippityMiddleware } from '../client'

export function timeoutMiddleware(ms = 20000): HippityMiddleware {
  return async (request, next) => {
    const requestTimeout = 'timeout' in request ? request.timeout : ms
    if (requestTimeout <= 0) {
      return next()
    }

    const callbacks = []
    const nextRequest = {
      ...request,
      onAbort: (callback) => callbacks.push(callback),
    }

    delete nextRequest.timeout

    const timer = setTimeout(() => {
      for (const callback of callbacks) {
        callback()
      }
    }, requestTimeout)

    // Unfortunately, the async-to-promises transform doesn't support returns inside finally blocks
    let result
    try {
      result = await next(nextRequest)
    } finally {
      clearTimeout(timer)
    }

    return result
  }
}
