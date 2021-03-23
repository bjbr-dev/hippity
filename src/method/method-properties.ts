import { HippityRequest } from '~/client'
import { possibleMethods } from './possible-methods'

export function urlInMethodProperties(request: HippityRequest): HippityRequest {
  if (request.method) {
    return request
  }

  for (const method of possibleMethods) {
    if (Object.prototype.hasOwnProperty.call(request, method)) {
      const newRequest = { ...request }
      newRequest.method = method
      newRequest.url = request[method] as string
      delete newRequest[method]
      return newRequest
    }
  }

  return request
}
