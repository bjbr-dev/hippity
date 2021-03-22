import { HippityMethod } from '~/method'

export type HippityRequestHeaders = {
  [name: string]: string
}

export interface HippityRequest<TUrl = string> {
  method?: HippityMethod
  url?: TUrl
  body?: unknown
  headers?: HippityRequestHeaders
  timeout?: number
  onAbort?: (triggerAbort: () => void) => void
  responseEncoding?: BufferEncoding
  responseType?: XMLHttpRequestResponseType | 'stream'
  onDownloadProgress?: () => void
  onUploadProgress?: () => void
  [key: string]: unknown
}

export type HippityResponseHeaders = {
  [name: string]: string | string[]
}

export interface HippityResponse {
  status: number
  success: boolean
  message?: string
  body?: unknown
  headers?: HippityResponseHeaders
  request?: HippityRequest
}

export type HippityTerminator = (
  request: HippityRequest<string>
) => Promise<HippityResponse>

export type HippityMiddlewareNextCallback = (
  request?: HippityRequest
) => Promise<HippityResponse>

export type HippityMiddleware<TUrl = string> = (
  request: HippityRequest<TUrl>,
  next: HippityMiddlewareNextCallback
) => Promise<HippityResponse>

export class HttpClient<
  TRequest extends { url?: TRequest['url'] } = HippityRequest,
  TResponse = HippityResponse
> {
  constructor(
    private middleware: HippityMiddleware<TRequest['url']>[] = [],
    private terminator?: HippityTerminator
  ) {
    if (!Array.isArray(middleware)) {
      throw new TypeError('Middleware stack must be an array')
    }

    if (middleware.some((m) => typeof m !== 'function')) {
      throw new Error('Middleware must be a function')
    }

    if (terminator && typeof terminator !== 'function') {
      throw new Error('Terminator must be a function')
    }
  }

  if(
    predicate: boolean,
    thenCallback?: (
      client: HttpClient<TRequest, TResponse>
    ) => HttpClient<TRequest, TResponse>,
    elseCallback?: (
      client: HttpClient<TRequest, TResponse>
    ) => HttpClient<TRequest, TResponse>
  ): HttpClient<TRequest, TResponse> {
    if (predicate) {
      return typeof thenCallback === 'function' ? thenCallback(this) : this
    } else {
      return typeof elseCallback === 'function' ? elseCallback(this) : this
    }
  }

  useTerminator(
    terminator: HippityTerminator
  ): HttpClient<TRequest, TResponse> {
    return new HttpClient(this.middleware, terminator)
  }

  use(
    middleware:
      | HippityMiddleware<TRequest['url']>
      | HippityMiddleware<TRequest['url']>[]
  ): HttpClient<TRequest, TResponse> {
    return this.useFirst(middleware)
  }

  useFirst(
    middleware:
      | HippityMiddleware<TRequest['url']>
      | HippityMiddleware<TRequest['url']>[]
  ): HttpClient<TRequest, TResponse> {
    const newMiddleware = Array.isArray(middleware)
      ? [...middleware, ...this.middleware]
      : [middleware, ...this.middleware]
    return new HttpClient(newMiddleware, this.terminator)
  }

  useLast(
    middleware:
      | HippityMiddleware<TRequest['url']>
      | HippityMiddleware<TRequest['url']>[]
  ): HttpClient<TRequest, TResponse> {
    const newMiddleware = Array.isArray(middleware)
      ? [...this.middleware, ...middleware]
      : [...this.middleware, middleware]

    return new HttpClient(newMiddleware, this.terminator)
  }

  useIf(
    predicate: boolean,
    middleware: HippityMiddleware<TRequest['url']>
  ): HttpClient<TRequest, TResponse> {
    return this.if(predicate, (c) => c.use(middleware))
  }

  async send(
    request: HippityRequest<TRequest['url']>
  ): Promise<HippityResponse> {
    const middleware = this.terminator
      ? [...this.middleware, this.terminator]
      : this.middleware

    return await dispatch(request, 0)

    function dispatch(
      currentRequest: HippityRequest<TRequest['url']>,
      index: number
    ): Promise<HippityResponse> {
      if (index >= middleware.length) {
        throw new Error(
          'Reached end of pipeline. Use a middleware which terminates the pipeline.'
        )
      } else {
        const next = function (request) {
          if (!request) {
            request = currentRequest
          }

          return dispatch(request, index + 1)
        }

        return middleware[index](currentRequest as HippityRequest<string>, next)
      }
    }
  }

  async $send(request: HippityRequest<TRequest['url']>): Promise<unknown> {
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

  get(
    url: TRequest['url'],
    options?: HippityRequest<TRequest['url']>
  ): Promise<HippityResponse> {
    return this.send({ method: 'GET', url, ...options })
  }

  $get(
    url: TRequest['url'],
    options?: HippityRequest<TRequest['url']>
  ): Promise<unknown> {
    return this.$send({ method: 'GET', url, ...options })
  }

  head(
    url: TRequest['url'],
    options?: HippityRequest<TRequest['url']>
  ): Promise<HippityResponse> {
    return this.send({ method: 'HEAD', url, ...options })
  }

  $head(
    url: TRequest['url'],
    options?: HippityRequest<TRequest['url']>
  ): Promise<unknown> {
    return this.$send({ method: 'HEAD', url, ...options })
  }

  options(
    url: TRequest['url'],
    options?: HippityRequest<TRequest['url']>
  ): Promise<HippityResponse> {
    return this.send({ method: 'OPTIONS', url, ...options })
  }

  $options(
    url: TRequest['url'],
    options?: HippityRequest<TRequest['url']>
  ): Promise<unknown> {
    return this.$send({ method: 'OPTIONS', url, ...options })
  }

  post(
    url: TRequest['url'],
    body: unknown,
    options?: HippityRequest
  ): Promise<HippityResponse> {
    return this.send({ method: 'POST', body, url, ...options })
  }

  $post(
    url: TRequest['url'],
    body: unknown,
    options?: HippityRequest
  ): Promise<unknown> {
    return this.$send({ method: 'POST', body, url, ...options })
  }

  put(
    url: TRequest['url'],
    body: unknown,
    options?: HippityRequest
  ): Promise<HippityResponse> {
    return this.send({ method: 'PUT', body, url, ...options })
  }

  $put(
    url: TRequest['url'],
    body: unknown,
    options?: HippityRequest
  ): Promise<unknown> {
    return this.$send({ method: 'PUT', body, url, ...options })
  }

  patch(
    url: TRequest['url'],
    body: unknown,
    options?: HippityRequest
  ): Promise<HippityResponse> {
    return this.send({ method: 'PATCH', body, url, ...options })
  }

  $patch(
    url: TRequest['url'],
    body: unknown,
    options?: HippityRequest
  ): Promise<unknown> {
    return this.$send({ method: 'PATCH', body, url, ...options })
  }

  del(
    url: TRequest['url'],
    body?: unknown,
    options?: HippityRequest
  ): Promise<HippityResponse> {
    return this.send({ method: 'DELETE', body, url, ...options })
  }

  $del(
    url: TRequest['url'],
    body: unknown,
    options?: HippityRequest
  ): Promise<unknown> {
    return this.$send({ method: 'DELETE', body, url, ...options })
  }

  delete(
    url: TRequest['url'],
    body?: unknown,
    options?: HippityRequest
  ): Promise<HippityResponse> {
    return this.send({ method: 'DELETE', body, url, ...options })
  }

  $delete(
    url: TRequest['url'],
    body?: unknown,
    options?: HippityRequest
  ): Promise<unknown> {
    return this.$send({ method: 'DELETE', body, url, ...options })
  }
}
