export function userAgent(userAgentString) {
  return request => {
    if (request.headers && request.headers['user-agent']) {
      return
    }

    return {
      ...request,
      headers: {
        ...request.headers,
        'user-agent': userAgentString || 'axios/' + version
      }
    }
  }
}
