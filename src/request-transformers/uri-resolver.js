export function uriResolver(resolve) {
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
