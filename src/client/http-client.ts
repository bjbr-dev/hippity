export type HippityRequestHeaders = {
  [name: string]: string
}

export interface HippityRequest {
  method?: 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url?: string
  body?: unknown
  headers?: HippityRequestHeaders
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
  request: HippityRequest
) => Promise<HippityResponse>

export type HippityMiddlewareNextCallback = (
  request?: HippityRequest
) => Promise<HippityResponse>

export type HippityMiddleware = (
  request: HippityRequest,
  next: HippityMiddlewareNextCallback
) => Promise<HippityResponse>

export class HttpClient {
  constructor(
    private middleware: HippityMiddleware[] = [],
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
    thenCallback?: (client: HttpClient) => HttpClient,
    elseCallback?: (client: HttpClient) => HttpClient
  ): HttpClient {
    if (predicate) {
      return typeof thenCallback === 'function' ? thenCallback(this) : this
    } else {
      return typeof elseCallback === 'function' ? elseCallback(this) : this
    }
  }

  useTerminator(terminator: HippityTerminator): HttpClient {
    return new HttpClient(this.middleware, terminator)
  }

  use(middleware: HippityMiddleware | HippityMiddleware[]): HttpClient {
    return this.useFirst(middleware)
  }

  useFirst(middleware: HippityMiddleware | HippityMiddleware[]): HttpClient {
    const newMiddleware = Array.isArray(middleware)
      ? [...middleware, ...this.middleware]
      : [middleware, ...this.middleware]
    return new HttpClient(newMiddleware, this.terminator)
  }

  useLast(middleware: HippityMiddleware | HippityMiddleware[]): HttpClient {
    const newMiddleware = Array.isArray(middleware)
      ? [...this.middleware, ...middleware]
      : [...this.middleware, middleware]

    return new HttpClient(newMiddleware, this.terminator)
  }

  useIf(predicate: boolean, middleware: HippityMiddleware): HttpClient {
    return this.if(predicate, (c) => c.use(middleware))
  }

  async send(request: HippityRequest): Promise<HippityResponse> {
    const middleware = this.terminator
      ? [...this.middleware, this.terminator]
      : this.middleware

    return await dispatch(request, 0)

    function dispatch(
      currentRequest: HippityRequest,
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

        return middleware[index](currentRequest, next)
      }
    }
  }

  async $send(request: HippityRequest): Promise<unknown> {
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

  get(url: string, options?: HippityRequest): Promise<HippityResponse> {
    return this.send({ method: 'GET', url, ...options })
  }

  $get(url: string, options?: HippityRequest): Promise<unknown> {
    return this.$send({ method: 'GET', url, ...options })
  }

  head(url: string, options?: HippityRequest): Promise<HippityResponse> {
    return this.send({ method: 'HEAD', url, ...options })
  }

  $head(url: string, options?: HippityRequest): Promise<unknown> {
    return this.$send({ method: 'HEAD', url, ...options })
  }

  options(url: string, options?: HippityRequest): Promise<HippityResponse> {
    return this.send({ method: 'OPTIONS', url, ...options })
  }

  $options(url: string, options?: HippityRequest): Promise<unknown> {
    return this.$send({ method: 'OPTIONS', url, ...options })
  }

  post(
    url: string,
    body: unknown,
    options?: HippityRequest
  ): Promise<HippityResponse> {
    return this.send({ method: 'POST', body, url, ...options })
  }

  $post(
    url: string,
    body: unknown,
    options?: HippityRequest
  ): Promise<unknown> {
    return this.$send({ method: 'POST', body, url, ...options })
  }

  put(
    url: string,
    body: unknown,
    options?: HippityRequest
  ): Promise<HippityResponse> {
    return this.send({ method: 'PUT', body, url, ...options })
  }

  $put(url: string, body: unknown, options?: HippityRequest): Promise<unknown> {
    return this.$send({ method: 'PUT', body, url, ...options })
  }

  patch(
    url: string,
    body: unknown,
    options?: HippityRequest
  ): Promise<HippityResponse> {
    return this.send({ method: 'PATCH', body, url, ...options })
  }

  $patch(
    url: string,
    body: unknown,
    options?: HippityRequest
  ): Promise<unknown> {
    return this.$send({ method: 'PATCH', body, url, ...options })
  }

  del(
    url: string,
    body: unknown,
    options?: HippityRequest
  ): Promise<HippityResponse> {
    return this.send({ method: 'DELETE', body, url, ...options })
  }

  $del(url: string, body: unknown, options?: HippityRequest): Promise<unknown> {
    return this.$send({ method: 'DELETE', body, url, ...options })
  }

  delete(
    url: string,
    body: unknown,
    options?: HippityRequest
  ): Promise<HippityResponse> {
    return this.send({ method: 'DELETE', body, url, ...options })
  }

  $delete(
    url: string,
    body: unknown,
    options?: HippityRequest
  ): Promise<unknown> {
    return this.$send({ method: 'DELETE', body, url, ...options })
  }
}
