export const defaultHeaderInjector = defaultHeaders => {
  if (
    typeof defaultHeaders !== 'object' ||
    defaultHeaders === null ||
    Array.isArray(defaultHeaders)
  ) {
    throw new TypeError('Default headers should be an object')
  }

  return request => {
    return {
      ...request,
      headers: {
        ...defaultHeaders['common'],
        ...(typeof request.method === 'string'
          ? defaultHeaders[request.method]
          : null),
        ...request.headers
      }
    }
  }
}
