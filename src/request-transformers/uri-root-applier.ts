import { RequestTransform } from '~/src/transform-middleware'

export const uriRootApplier = (root: string): RequestTransform => {
  return function(request) {
    return { uriRoot: root, ...request }
  }
}
