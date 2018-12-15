import { RestClient, Middleware } from './rest-client'

import {
  methodNormalizer,
  uriResolver,
  ResolveDelegate,
  baseUriApplier
} from './request-transformers/index'

import { defaultAxiosMiddleware } from './axios-middleware'
import { resolve as defaultResolve } from './resolve'
import {
  transformMiddleware,
  RequestTransform,
  ResponseTransform
} from './transform-middleware'

export type DefaultClientOptions = {
  /** Prepended to the request uri if it's relative */
  baseUri?: string

  /**
   * Function to transform a url template and its parameters into a url.
   * Defaults to the standard resolve if not set.
   * If set explicitly to null, then resolving urls is disabled
   */
  resolve?: ResolveDelegate

  /**
   * Middleware to run in the pipeline.
   * All the middleware will run after request transforms, before the terminating middleware, and before responseTransforms
   */
  middleware?: Middleware[]

  /**
   * Transformation functions to apply to the request. Ideally they should be pure (clone the request before modification), but don't strictly have to be.
   * These transforms will run after the baseUri, resolve and methodNormalizer have been applied
   */
  requestTransforms?: RequestTransform[]

  /**
   * Transformation functions to apply to the result. Ideally they should be pure (clone the repsonse before modificaiton), but don't strictly have to be.
   * These transforms will run last, after any middleware have been processed and immediately before the final response is returned.
   */
  responseTransforms?: ResponseTransform[]

  /**
   * The final middleware, which will terminate the pipeline. This would usually perform the actual HTTP request, and build the first response.
   * Defaults to the defaultAxiosMiddleware.
   */
  terminatingMiddleware?: Middleware
}

export class RestClientBuilder {
  private baseUri: string | null | undefined
  private resolve: ResolveDelegate | null | undefined
  private middleware: Middleware[]
  private requestTransforms: RequestTransform[]
  private responseTransforms: ResponseTransform[]
  private terminatingMiddleware: Middleware | undefined

  constructor(options: DefaultClientOptions = {}) {
    this.baseUri = options.baseUri
    this.resolve = options.resolve
    this.middleware = options.middleware || []
    this.requestTransforms = options.requestTransforms || []
    this.responseTransforms = options.responseTransforms || []
    this.terminatingMiddleware = options.terminatingMiddleware
  }

  use(middleware: Middleware | Middleware[]) {
    this.middleware = [...this.middleware, ...normalizeMiddleware(middleware)]
    return this
  }

  clearMiddleware() {
    this.middleware = []
    return this
  }

  transformRequest(transform: RequestTransform | RequestTransform[]) {
    this.requestTransforms = [
      ...this.requestTransforms,
      ...normalizeRequest(transform)
    ]

    return this
  }

  clearRequestTransforms() {
    this.requestTransforms = []
    return this
  }

  transformResponse(transform: ResponseTransform | ResponseTransform[]) {
    this.responseTransforms = [
      ...this.responseTransforms,
      ...normalizeResponse(transform)
    ]

    return this
  }

  clearResponseTransforms() {
    this.responseTransforms = []
    return this
  }

  resolveUris(uriRoot: string | null, resolve: ResolveDelegate | null) {
    this.baseUri = uriRoot
    this.resolve = resolve
    return this
  }

  build() {
    let requestTransforms = [methodNormalizer]

    if (this.resolve !== null) {
      requestTransforms.push(uriResolver(this.resolve || defaultResolve))
    }

    if (this.baseUri) {
      requestTransforms.push(baseUriApplier(this.baseUri))
    }

    return new RestClient([
      transformMiddleware(
        [...requestTransforms, ...this.requestTransforms],
        [...this.responseTransforms]
      ),
      ...this.middleware,
      this.terminatingMiddleware || defaultAxiosMiddleware()
    ])
  }
}

export const CreateDefaultClient = (options: DefaultClientOptions) => {
  return new RestClientBuilder(options).build()
}

function normalizeMiddleware(
  middleware: Middleware | Middleware[]
): Middleware[] {
  if (!Array.isArray(middleware)) {
    middleware = [middleware]
  }

  for (const m of middleware) {
    if (typeof m !== 'function') {
      throw new Error('Middleware must be a function')
    }
  }

  return middleware
}

function normalizeRequest(
  transform: RequestTransform | RequestTransform[]
): RequestTransform[] {
  if (!Array.isArray(transform)) {
    transform = [transform]
  }

  for (const t of transform) {
    if (typeof t !== 'function') {
      throw new Error('Request Transform must be a function')
    }
  }

  return transform
}

function normalizeResponse(
  transform: ResponseTransform | ResponseTransform[]
): ResponseTransform[] {
  if (!Array.isArray(transform)) {
    transform = [transform]
  }

  for (const t of transform) {
    if (typeof t !== 'function') {
      throw new Error('Response Transform must be a function')
    }
  }

  return transform
}
