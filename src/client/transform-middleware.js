export const transformMiddleware = (requestTransforms, responseTransforms) => {
  if (!Array.isArray(requestTransforms)) {
    throw new TypeError('Request transforms must be an array')
  }

  if (!Array.isArray(responseTransforms)) {
    throw new TypeError('Response transforms must be an array')
  }

  return async function(request, next) {
    request = await requestTransforms.reduce(
      (p, t) => p.then(r => t(r)),
      Promise.resolve(request)
    )

    const response = await next(request)

    return await responseTransforms.reduce(
      (p, t) => p.then(r => t(request, r)),
      Promise.resolve(response)
    )
  }
}
