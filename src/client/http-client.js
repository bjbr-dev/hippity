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

  use(middleware) {
    if (Array.isArray(middleware)) {
      return new HttpClient([...this.middleware, ...middleware])
    } else {
      return new HttpClient([...this.middleware, middleware])
    }
  }

  useIf(predicate, middleware) {
    if (predicate === true) {
      return this.use(middleware)
    }

    return this
  }

  _run(request) {
    const middleware = this.middleware
    return dispatch(request, middleware.length - 1)

    function dispatch(currentRequest, index) {
      if (index < 0) {
        throw new Error(
          'Reached end of pipeline. Use a middleware which terminates the pipeline.'
        )
      } else {
        const next = function(request) {
          if (!request) {
            request = currentRequest
          }

          return dispatch(request, index - 1)
        }

        return middleware[index](currentRequest, next)
      }
    }
  }

  async send(request) {
    const response = await this._run(request)
    delete response.success
    return response
  }

  async $send(request) {
    const { success, ...response } = await this._run(request)

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
