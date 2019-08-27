import AbortController from 'abort-controller'

export function timeout(ms) {
  return async (request, next) => {
    const timeout = 'timeout' in request ? request.timeout : ms
    if (timeout > 0) {
      const controller = new AbortController()
      const timer = setTimeout(controller.abort, timeout)

      try {
        return await next({ ...request, abort: controller.signal })
      } finally {
        clearTimeout(timer)
      }
    } else {
      return await next()
    }
  }
}
