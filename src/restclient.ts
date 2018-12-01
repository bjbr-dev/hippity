export type RouteValue = string | number
export type RouteValues = { [name: string]: RouteValue | RouteValue[] }
export type Route = string | [string, RouteValues?]

export type HttpRequest = {
  method?: string
  uri?: Route
  message?: string
  headers?: Object
  body?: any
  [key: string]: any
}

export type HttpResponse = {
  status?: number
  message?: string
  headers?: Object
  body?: any
  [key: string]: any
}

export type MiddlewareDelegate = (
  request?: HttpRequest
) => Promise<HttpResponse> | HttpResponse

export type Middleware = (
  request: HttpRequest,
  next: MiddlewareDelegate
) => Promise<HttpResponse> | HttpResponse

export class RestClient {
  constructor(private stack: Middleware[] = []) {
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

  use(middleware: Middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function')
    }

    let newStack = this.stack.slice()
    newStack.push(middleware)
    return new RestClient(newStack)
  }

  useIf(predicate: boolean, middleware: Middleware) {
    if (predicate === true) {
      return this.use(middleware)
    }

    return this
  }

  send(request: HttpRequest): Promise<HttpResponse> | HttpResponse {
    const middlewares = this.stack

    return dispatch(request, 0)

    function dispatch(currentRequest: HttpRequest, index: number) {
      if (index === middlewares.length) {
        throw new Error(
          'Reached end of pipeline. Use a middleware which terminates the pipeline.'
        )
      } else {
        let next: MiddlewareDelegate = function(request?: HttpRequest) {
          if (!request) {
            request = currentRequest
          }

          return dispatch(request, index + 1)
        }

        return middlewares[index](currentRequest, next)
      }
    }
  }

  async $send(request: HttpRequest) {
    let result = await this.send(request)
    if (
      typeof result.status === 'number' &&
      result.status >= 200 &&
      result.status < 300
    ) {
      return result.body
    }

    throw new Error('Unexpected status code: ' + result.status)
  }

  get(uri: Route, options?: Object) {
    return this.send({ method: 'GET', uri: uri, ...options })
  }

  $get(uri: Route, options?: Object) {
    return this.$send({ method: 'GET', uri: uri, ...options })
  }

  head(uri: Route, options?: Object) {
    return this.send({ method: 'HEAD', uri: uri, ...options })
  }

  $head(uri: Route, options?: Object) {
    return this.$send({ method: 'HEAD', uri: uri, ...options })
  }

  options(uri: Route, options?: Object) {
    return this.send({ method: 'OPTIONS', uri: uri, ...options })
  }

  $options(uri: Route, options?: Object) {
    return this.$send({ method: 'OPTIONS', uri: uri, ...options })
  }

  post(uri: Route, body: any, options?: Object) {
    return this.send({ method: 'POST', uri: uri, body: body, ...options })
  }

  $post(uri: Route, body: any, options?: Object) {
    return this.$send({ method: 'POST', uri: uri, body: body, ...options })
  }

  put(uri: Route, body: any, options?: Object) {
    return this.send({ method: 'PUT', uri: uri, body: body, ...options })
  }

  $put(uri: Route, body: any, options?: Object) {
    return this.$send({ method: 'PUT', uri: uri, body: body, ...options })
  }

  patch(uri: Route, body: any, options?: Object) {
    return this.send({ method: 'PATCH', uri: uri, body: body, ...options })
  }

  $patch(uri: Route, body: any, options?: Object) {
    return this.$send({ method: 'PATCH', uri: uri, body: body, ...options })
  }

  del(uri: Route, options?: Object) {
    return this.send({ method: 'DELETE', uri: uri, ...options })
  }

  async $del(uri: Route, options?: Object) {
    let result = await this.send({ method: 'DELETE', uri: uri, ...options })
    if (
      typeof result.status === 'number' &&
      result.status >= 200 &&
      result.status < 300
    ) {
      return result.body
    }

    if (result.status === 404 || result.status === 410) {
      return result.body
    }

    throw new Error('Unexpected status code: ' + result.status)
  }
}
