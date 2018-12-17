import { Middleware, HttpRequest, HttpResponse } from './rest-client'

export type RequestTransform = (request: HttpRequest) => HttpRequest
export type ResponseTransform = (
  request: HttpRequest,
  response: HttpResponse
) => HttpResponse

export const transformMiddleware = (
  requestTransforms: RequestTransform[],
  responseTransforms: ResponseTransform[]
): Middleware => {
  if (!Array.isArray(requestTransforms)) {
    throw new TypeError('Request transforms must be an array')
  }

  if (!Array.isArray(responseTransforms)) {
    throw new TypeError('Response transforms must be an array')
  }

  return async function(request, next) {
    request = requestTransforms.reduce((acc, current) => current(acc), request)
    const response = await next(request)
    return responseTransforms.reduce(
      (acc, current) => current(request, acc),
      response
    )
  }
}
