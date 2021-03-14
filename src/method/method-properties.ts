const methods = ['HEAD', 'GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']

export function urlInMethodProperties(request) {
  if (request.method) {
    return request
  }

  for (const method of methods) {
    if (Object.prototype.hasOwnProperty.call(request, method)) {
      const newRequest = { ...request }
      newRequest.method = method
      newRequest.url = request[method]
      delete newRequest[method]
      return newRequest
    }
  }

  return request
}
