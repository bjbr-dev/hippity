export const transformMiddleware = (requestTransforms, responseTransforms) => {
  if (!Array.isArray(requestTransforms)) {
    throw new TypeError('Request transforms must be an array')
  }

  if (!Array.isArray(responseTransforms)) {
    throw new TypeError('Response transforms must be an array')
  }

  return async function(request, next) {
    request = requestTransforms.reduce((acc, current) => current(acc), request)
    const response = await next(request)
    return responseTransforms.reduce(
      (acc, current) => current(request, acc),
      response
    )
  }
}
