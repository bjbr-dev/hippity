import { RequestTransform } from '~/transform-middleware'
import { RouteValues } from '~/rest-client'

export type ResolveDelegate = (
  path: string,
  params?: RouteValues | undefined
) => string

export const uriResolver = (resolve: ResolveDelegate): RequestTransform => {
  return request => {
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
