import AbortController from 'abort-controller'

// Unfortunately, the async-to-promises transform doesn't support returns inside finally block, so use promises everywhere
export function timeoutMiddleware(ms = 0) {
  return (request, next) => {
    const timeout = 'timeout' in request ? request.timeout : ms
    if (timeout <= 0) {
      return next()
    }

    const controller = new AbortController()
    const nextRequest = { ...request, abort: controller.signal }
    delete nextRequest.timeout

    const timer = setTimeout(controller.abort, timeout)
    const onFinally = () => clearTimeout(timer)

    try {
      return Promise.resolve(next(nextRequest)).then(
        v => {
          onFinally()
          return v
        },
        e => {
          onFinally()
          throw e
        }
      )
    } catch (e) {
      onFinally()
      throw e
    }
  }
}
