import { HippityRequest } from '~/client'
import { HippityRequestTransform } from '~/transform-middleware'
import { hasHeader } from './headers'

const toBase64 =
  typeof btoa !== 'undefined'
    ? btoa
    : (value) => Buffer.from(value).toString('base64')

interface BasicAuthCredentials {
  username: string
  password: string
}

export function basicAuth(
  defaultAuth?: BasicAuthCredentials
): HippityRequestTransform {
  return (request) => {
    if (hasHeader(request.headers, 'authorization')) {
      return request
    }

    const auth = (request.auth as BasicAuthCredentials) || defaultAuth
    if (!auth) {
      return request
    }

    const username = auth.username || ''
    const password = auth.password || ''

    const result: HippityRequest = {
      ...request,
      headers: {
        ...request.headers,
        authorization: 'Basic ' + toBase64(username + ':' + password),
      },
    }
    delete result.auth
    return result
  }
}
