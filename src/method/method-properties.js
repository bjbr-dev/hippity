const methods = ['HEAD', 'GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']

export function methodProperties(request) {
  if (request.method) {
    return request
  }

  for (const method of methods) {
    if (request.hasOwnProperty(method)) {
      const newRequest = { ...request }
      newRequest.method = method
      newRequest.url = request[method]
      delete newRequest[method]
      return newRequest
    }
  }

  return request
}
