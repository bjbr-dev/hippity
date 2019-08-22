export class RestClient {
  constructor(middleware = []) {
    if (!Array.isArray(middleware)) {
      throw new TypeError('Middleware stack must be an array')
    }

    for (const m of middleware) {
      if (typeof m !== 'function') {
        throw new Error('Middleware must be a function')
      }
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

  get(uri, options) {
    return this.send({ method: 'GET', uri: uri, ...options })
  }

  $get(uri, options) {
    return this.$send({ method: 'GET', uri: uri, ...options })
  }

  head(uri, options) {
    return this.send({ method: 'HEAD', uri: uri, ...options })
  }

  $head(uri, options) {
    return this.$send({ method: 'HEAD', uri: uri, ...options })
  }

  options(uri, options) {
    return this.send({ method: 'OPTIONS', uri: uri, ...options })
  }

  $options(uri, options) {
    return this.$send({ method: 'OPTIONS', uri: uri, ...options })
  }

  post(uri, body, options) {
    return this.send({ method: 'POST', uri: uri, body: body, ...options })
  }

  $post(uri, body, options) {
    return this.$send({ method: 'POST', uri: uri, body: body, ...options })
  }

  put(uri, body, options) {
    return this.send({ method: 'PUT', uri: uri, body: body, ...options })
  }

  $put(uri, body, options) {
    return this.$send({ method: 'PUT', uri: uri, body: body, ...options })
  }

  patch(uri, body, options) {
    return this.send({ method: 'PATCH', uri: uri, body: body, ...options })
  }

  $patch(uri, body, options) {
    return this.$send({ method: 'PATCH', uri: uri, body: body, ...options })
  }

  del(uri, options) {
    return this.send({ method: 'DELETE', uri: uri, ...options })
  }

  async $del(uri, options) {
    return this.$send({ method: 'DELETE', uri: uri, ...options })
  }
}
