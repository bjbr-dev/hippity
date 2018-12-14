import { RequestTransform } from '~/src/transform-middleware'
import { RouteValues } from '~/src/restclient'

export const resolvingTransform = (
  resolve: (path: string, params?: RouteValues | undefined) => string
): RequestTransform => {
  return function(request) {
    if (Array.isArray(request.uri)) {
      return {
        ...request,
        uri: resolve(request.uri[0], request.uri[1])
      }
    } else {
      return request
    }
  }
}
