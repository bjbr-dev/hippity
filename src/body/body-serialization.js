import {
  isFormData,
  isArrayBuffer,
  isStream,
  isFile,
  isBlob,
  isArrayBufferView,
  isURLSearchParams,
  isObject
} from '~/send/utils'
import isBuffer from 'is-buffer'

function setContentTypeIfUnset(headers, value) {
  if (!('content-type' in headers)) {
    headers['content-type'] = value
  }
}

function normalizeHeaderName(headers, normalizedName) {
  // Don't bother if no value provided
  if (headers === null || typeof headers === 'undefined') {
    return
  }

  for (const key in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, key)) {
      if (
        key !== normalizedName &&
        key.toUpperCase() === normalizedName.toUpperCase()
      ) {
        headers[normalizedName] = headers[key]
        delete headers[key]
      }
    }
  }
}

export function bodySerializer(request) {
  const body = request.body
  const headers = request.headers

  normalizeHeaderName(headers, 'accept')
  normalizeHeaderName(headers, 'content-type')
  if (
    isFormData(body) ||
    isArrayBuffer(body) ||
    isBuffer(body) ||
    isStream(body) ||
    isFile(body) ||
    isBlob(body)
  ) {
    return
  }

  if (isArrayBufferView(body)) {
    request.body = body.buffer
    return
  }

  if (isURLSearchParams(body)) {
    setContentTypeIfUnset(
      headers,
      'application/x-www-form-urlencoded;charset=utf-8'
    )
    request.body = body.toString()
    return
  }
  if (isObject(body)) {
    setContentTypeIfUnset(headers, 'application/json;charset=utf-8')
    request.body = JSON.stringify(body)
    return
  }
}

export function bodyDeserializer(_, response) {
  if (typeof response.body === 'string') {
    try {
      response.body = JSON.parse(response.body)
    } catch (e) {
      /* Ignore */
    }
  }
}
