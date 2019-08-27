export function basicAuth(defaultAuth) {
  return request => {
    const auth = request.auth || defaultAuth
    if (!auth) {
      return request
    }

    const username = auth.username || ''
    const password = auth.password || ''
    request.headers = {
      authorization: 'Basic ' + btoa(username + ':' + password),
      ...request.headers
    }
  }
}
