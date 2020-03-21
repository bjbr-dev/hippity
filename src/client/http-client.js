export class HttpClient {
  constructor(middleware = []) {
    if (!Array.isArray(middleware)) {
      throw new TypeError('Middleware stack must be an array')
    }

    if (middleware.some(m => typeof m !== 'function')) {
      throw new Error('Middleware must be a function')
    }

    this.middleware = middleware
  }

  if(predicate, thenCallback, elseCallback) {
    if (predicate) {
      return typeof thenCallback === 'function' ? thenCallback(this) : this
    } else {
      return typeof elseCallback === 'function' ? elseCallback(this) : this
    }
  }

  useTerminator(terminator) {
    const newMiddleware = [...this.middleware]
    newMiddleware.splice(-1, 1, terminator)
    return new HttpClient(newMiddleware)
  }

  use(middleware) {
    return this.useFirst(middleware)
  }

  useFirst(middleware) {
    const newMiddleware = Array.isArray(middleware)
      ? [...middleware, ...this.middleware]
      : [middleware, ...this.middleware]
    return new HttpClient(newMiddleware)
  }

  useLast(middleware) {
    const newMiddleware = [...this.middleware]
    if (Array.isArray(middleware)) {
      newMiddleware.splice(-1, 0, ...middleware)
    } else {
      newMiddleware.splice(-1, 0, middleware)
    }

    return new HttpClient(newMiddleware)
  }

  useIf(predicate, middleware) {
    return this.if(predicate, c => c.use(middleware))
  }

  async send(request) {
    const middleware = this.middleware
    return await dispatch(request, 0)

    function dispatch(currentRequest, index) {
      if (index >= middleware.length) {
        throw new Error(
          'Reached end of pipeline. Use a middleware which terminates the pipeline.'
        )
      } else {
        const next = function(request) {
          if (!request) {
            request = currentRequest
          }

          return dispatch(request, index + 1)
        }

        return middleware[index](currentRequest, next)
      }
    }
  }

  async $send(request) {
    const { success, ...response } = await this.send(request)

    if (success !== false) {
      return response.body
    } else {
      throw new Error(
        `Response does not indicate success\n\n` +
          `Request: ${JSON.stringify(request, null, 2)}\n\n` +
          `Response: ${JSON.stringify(response, null, 2)}`
      )
    }
  }
}

function addSendWithoutBody(property, method) {
  method = (method || property).toUpperCase()

  HttpClient.prototype[property] = function(url, options) {
    return this.send({ method, url: url, ...options })
  }

  HttpClient.prototype['$' + property] = function(url, options) {
    return this.$send({ method, url: url, ...options })
  }
}

function addSendWithBody(property, method) {
  method = (method || property).toUpperCase()

  HttpClient.prototype[property] = function(url, body, options) {
    return this.send({ method, url, body, ...options })
  }

  HttpClient.prototype['$' + property] = function(url, body, options) {
    return this.$send({ method, url, body, ...options })
  }
}

addSendWithoutBody('get')
addSendWithoutBody('head')
addSendWithoutBody('options')
addSendWithBody('post')
addSendWithBody('put')
addSendWithBody('patch')
addSendWithoutBody('del', 'DELETE')
addSendWithoutBody('delete', 'DELETE')
