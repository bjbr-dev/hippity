export type RouteValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | RouteValueArray
  | { [key: string]: RouteValue }

export interface RouteValueArray extends Array<RouteValue> {}
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
  success: boolean
  status: number
  message?: string
  headers?: Object
  body?: any
  [key: string]: any
}

export type NextMiddlewareDelegate = (
  request?: HttpRequest
) => Promise<HttpResponse> | HttpResponse

export type Middleware = (
  request: HttpRequest,
  next: NextMiddlewareDelegate
) => Promise<HttpResponse> | HttpResponse

export class RestClient {
  constructor(private middleware: Middleware[] = []) {
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

  use(middleware: Middleware | Middleware[]) {
    if (Array.isArray(middleware)) {
      return new RestClient([...this.middleware, ...middleware])
    } else {
      return new RestClient([...this.middleware, middleware])
    }
  }

  useIf(predicate: boolean, middleware: Middleware) {
    if (predicate === true) {
      return this.use(middleware)
    }

    return this
  }

  send(request: HttpRequest): Promise<HttpResponse> | HttpResponse {
    const middlewares = this.middleware

    return dispatch(request, 0)

    function dispatch(currentRequest: HttpRequest, index: number) {
      if (index === middlewares.length) {
        throw new Error(
          'Reached end of pipeline. Use a middleware which terminates the pipeline.'
        )
      } else {
        let next: NextMiddlewareDelegate = function(request?: HttpRequest) {
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
    let response = await this.send(request)

    if (response.success) {
      return response.body
    } else {
      throw new Error(
        `Response does not indicate success\n\n` +
          `Request: ${JSON.stringify(request, null, 2)}\n\n` +
          `Response: ${JSON.stringify(response, null, 2)}`
      )
    }
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
    return this.$send({ method: 'DELETE', uri: uri, ...options })
  }
}
