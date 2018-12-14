import { RequestTransform } from '~/src/transform-middleware'

const methods = ['HEAD', 'GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']

export const methodNormalizer: RequestTransform = request => {
  if (request.method) {
    return request
  }

  for (let method of methods) {
    if (request.hasOwnProperty(method)) {
      let newRequest = { ...request }
      newRequest.method = method
      newRequest.uri = request[method]
      delete newRequest[method]
      return newRequest
    }
  }

  return request
}
