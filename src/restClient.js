export class RestClient {
  constructor(stack = []) {
    if (!Array.isArray(stack)) {
      throw new TypeError('Middleware stack must be an array')
    }

    for (const middleware of stack) {
      if (typeof middleware !== 'function') {
        throw new Error('Middleware must be a function')
      }
    }

    this.stack = stack
  }

  use(middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function')
    }

    let newStack = this.stack.slice()
    newStack.push(middleware)
    return new RestClient(newStack)
  }

  useIf(predicate, middleware) {
    if (predicate === true) {
      return this.use(middleware)
    }

    return this
  }

  send(context) {
    const middlewares = this.stack

    return dispatch(context, 0)

    function dispatch(currentContext, index) {
      if (index === middlewares.length) {
        throw new Error(
          'Reached end of pipeline. Use a middleware which terminates the pipeline.'
        )
      } else {
        let next = function(nextContext) {
          if (!nextContext) {
            nextContext = currentContext
          }

          return dispatch(nextContext, index + 1)
        }

        return middlewares[index](currentContext, next)
      }
    }
  }

  async $send(context) {
    let result = await this.send(context)
    if (result.status >= 200 && result.status < 300) {
      return result.body
    }

    throw new Error('Unexpected status code: ' + result.status)
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
    let result = await this.send({ method: 'DELETE', uri: uri, ...options })
    if (result.status >= 200 && result.status < 300) {
      return result.body
    }

    if (result.status === 404 || result.status === 410) {
      return result.body
    }

    throw new Error('Unexpected status code: ' + result.status)
  }
}
