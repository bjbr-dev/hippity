import { Middleware, HttpRequest, HttpResponse } from './restclient'

export const validationMiddleware: Middleware = async function(request, next) {
  const response = await next()

  if (isValid(request, response)) {
    return response
  }

  let responseMessage = response.message || 'No message'

  let { validate, ...serializedRequest } = request

  throw new Error(
    `Unexpected status code: ${response.status} (${responseMessage})\n\n` +
      `Requested: ${JSON.stringify(serializedRequest, null, 2)}\n\n` +
      `Response: ${JSON.stringify(response, null, 2)}`
  )
}

function isValid(request: HttpRequest, response: HttpResponse): boolean {
  if (request.validate === true) {
    if (typeof response.status !== 'number') {
      return false
    }

    if (response.status >= 200 && response.status < 300) {
      return true
    }

    if (
      request.method === 'DELETE' &&
      (response.status == 404 || response.status == 410)
    ) {
      return true
    }

    return false
  }

  return true
}
