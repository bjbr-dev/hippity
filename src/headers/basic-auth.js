import { hasHeader } from './headers'

const toBase64 =
  typeof btoa !== 'undefined'
    ? btoa
    : value => Buffer.from(value).toString('base64')

export function basicAuth(defaultAuth) {
  return request => {
    if (hasHeader(request.headers, 'authorization')) {
      return request
    }

    const auth = request.auth || defaultAuth
    if (!auth) {
      return request
    }

    const username = auth.username || ''
    const password = auth.password || ''

    const result = {
      ...request,
      headers: {
        ...request.headers,
        authorization: 'Basic ' + toBase64(username + ':' + password)
      }
    }
    delete result.auth
    return result
  }
}
