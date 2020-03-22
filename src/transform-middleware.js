export const transformMiddleware = (
  requestTransforms = [],
  responseTransforms = []
) => {
  if (!Array.isArray(requestTransforms)) {
    throw new TypeError('Request transforms must be an array')
  }

  if (!Array.isArray(responseTransforms)) {
    throw new TypeError('Response transforms must be an array')
  }

  return async function(request, next) {
    const transformedRequest = await requestTransforms.reduce(
      (p, t) => p.then(r => t(r) || r),
      Promise.resolve(request)
    )

    const response = await next(transformedRequest)

    return await responseTransforms.reduce(
      (p, t) => p.then(r => t(transformedRequest, r) || r),
      Promise.resolve(response)
    )
  }
}
