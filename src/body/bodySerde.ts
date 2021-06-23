import { HippityRequest, HippityResponse } from '../client'
import { hasHeader, findHeader } from '../headers/headers'

export function bodySerializer(
  contentType: string,
  serialize: (body: unknown) => string | Buffer
) {
  return (request: HippityRequest): HippityRequest => {
    if (!('body' in request)) {
      return request
    }

    if (hasHeader(request.headers, 'content-type')) {
      return request
    }

    return {
      ...request,
      headers: { ...request.headers, 'content-type': contentType },
      body: serialize(request.body),
    }
  }
}

export function bodyDeserializer(
  contentTypeTest: string | ((contentType: string) => boolean),
  deserialize: (body: string) => unknown
): (request: HippityRequest, response: HippityResponse) => HippityResponse {
  const actualContentTypeTest: (contentType: string) => boolean =
    typeof contentTypeTest === 'string'
      ? (c) => c.toLowerCase().indexOf(contentTypeTest) >= 0
      : contentTypeTest

  return (_, response) => {
    if (typeof response.body !== 'string') {
      return response
    }

    const contentType = findHeader(response.headers, 'content-type')
    if (typeof contentType === 'string' && actualContentTypeTest(contentType)) {
      return {
        ...response,
        body: deserialize(response.body),
      }
    }

    return response
  }
}
