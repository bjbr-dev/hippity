export const transformMiddleware = (requestTransforms, responseTransforms) => {
  if (!Array.isArray(requestTransforms)) {
    throw new TypeError('Request transforms must be an array')
  }

  if (!Array.isArray(responseTransforms)) {
    throw new TypeError('Response transforms must be an array')
  }

  return async function(request, next) {
    for (const transform of requestTransforms) {
      request = await transform(request)
    }

    let response = await next(request)

    for (const transform of responseTransforms) {
      response = await transform(request, response)
    }

    return response
  }
}
