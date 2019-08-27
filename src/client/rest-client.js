export class RestClient {
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
      return new RestClient([...this.middleware, ...middleware])
    } else {
      return new RestClient([...this.middleware, middleware])
    }
  }

  useIf(predicate, middleware) {
    if (predicate === true) {
      return this.use(middleware)
    }

    return this
  }

  send(request) {
    const middlewares = this.middleware

    return dispatch(request, 0)

    function dispatch(currentRequest, index) {
      if (index === middlewares.length) {
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

        return middlewares[index](currentRequest, next)
      }
    }
  }

  async $send(request) {
    const response = await this.send(request)

    if (response.success !== false) {
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

  RestClient.prototype[property] = function(url, options) {
    return this.send({ method, url: url, ...options })
  }

  RestClient.prototype['$' + property] = function(url, options) {
    return this.$send({ method, url: url, ...options })
  }
}

function addSendWithBody(property, method) {
  method = (method || property).toUpperCase()

  RestClient.prototype[property] = function(url, body, options) {
    return this.send({ method, url, body, ...options })
  }

  RestClient.prototype['$' + property] = function(url, body, options) {
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
