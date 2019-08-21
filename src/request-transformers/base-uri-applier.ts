import { RequestTransform } from '~/transform-middleware'

export const baseUriApplier = (baseUri: string): RequestTransform => {
  return request => {
    return { baseUri: baseUri, ...request }
  }
}
