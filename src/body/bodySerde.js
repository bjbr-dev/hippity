import { hasHeader, findHeader } from '~/headers/headers'

export function bodySerializer(contentType, serialize) {
  return request => {
    if (!('body' in request)) {
      return request
    }

    if (hasHeader(request.headers, 'content-type')) {
      return request
    }

    return {
      ...request,
      headers: { ...request.headers, 'content-type': contentType },
      body: serialize(request.body)
    }
  }
}

export function bodyDeserializer(contentTypeTest, deserialize) {
  if (typeof contentTypeTest === 'string') {
    const expectedContentType = contentTypeTest
    contentTypeTest = c => c.toLowerCase().indexOf(expectedContentType) >= 0
  }

  return (_, response) => {
    if (typeof response.body !== 'string') {
      return response
    }

    const contentType = findHeader(response.headers, 'content-type')
    if (typeof contentType === 'string' && contentTypeTest(contentType)) {
      return {
        ...response,
        body: deserialize(response.body)
      }
    }

    return response
  }
}
