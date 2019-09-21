import { hasHeader, findHeader } from '~/headers/headers'
import { transformMiddleware } from '~/transform-middleware'

export function jsonMiddleware() {
  return transformMiddleware([jsonSerializer], [jsonDeserializer])
}

export function jsonSerializer(request) {
  if (!('body' in request)) {
    return request
  }

  if (hasHeader(request.headers, 'content-type')) {
    return request
  }

  return {
    ...request,
    headers: {
      ...request.headers,
      'content-type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(request.body)
  }
}

export function jsonDeserializer(_, response) {
  if (typeof response.body !== 'string') {
    return response
  }

  const contentType = findHeader(response.headers, 'content-type')
  if (
    typeof contentType === 'string' &&
    contentType.toLowerCase().indexOf('application/json') >= 0
  ) {
    return {
      ...response,
      body: JSON.parse(response.body)
    }
  }

  return response
}