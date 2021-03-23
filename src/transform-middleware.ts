import { HippityMiddleware, HippityRequest, HippityResponse } from './client'

export type HippityRequestTransform = (
  request: HippityRequest
) => void | Promise<void> | HippityRequest | Promise<HippityRequest>

export type HippityResponseTransform = (
  request: HippityRequest,
  response: HippityResponse
) => void | Promise<void> | HippityResponse | Promise<HippityResponse>

export const transformMiddleware = (
  requestTransforms: HippityRequestTransform[] = [],
  responseTransforms: HippityResponseTransform[] = []
): HippityMiddleware => {
  if (!Array.isArray(requestTransforms)) {
    throw new TypeError('Request transforms must be an array')
  }

  if (!Array.isArray(responseTransforms)) {
    throw new TypeError('Response transforms must be an array')
  }

  return async function (request, next) {
    const transformedRequest = await requestTransforms.reduce(
      (p, t) => p.then(async (r) => (await t(r)) || r),
      Promise.resolve(request)
    )

    const response = await next(transformedRequest)

    return await responseTransforms.reduce(
      (p, t) => p.then(async (r) => (await t(transformedRequest, r)) || r),
      Promise.resolve(response)
    )
  }
}
