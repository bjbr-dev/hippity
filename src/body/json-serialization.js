import {
  isFormData,
  isStream,
  isFile,
  isBlob,
  isURLSearchParams,
  isArrayBufferView,
  isArrayBuffer
} from '~/body/body-types'
import isBuffer from 'is-buffer'
import { addHeaderIfNotPresent } from '~/headers/headers'

function passThroughToRequest(body) {
  return isBuffer(body) || isStream(body)
}

function passThroughToXhr(body) {
  return isFormData(body) || isArrayBuffer(body) || isFile(body) || isBlob(body)
}

export function jsonSerializer(request) {
  const body = request.body
  const headers = request.headers

  if (passThroughToRequest(body) || passThroughToXhr(body)) {
    return request
  }

  if (isArrayBufferView(body)) {
    request.body = body.buffer
    return request
  }

  if (isURLSearchParams(body)) {
    addHeaderIfNotPresent(
      headers,
      'content-type',
      'application/x-www-form-urlencoded;charset=utf-8'
    )

    request.body = body.toString()
    return request
  }

  addHeaderIfNotPresent(
    headers,
    'content-type',
    'application/json;charset=utf-8'
  )
  request.body = JSON.stringify(body)
  return request
}

export function jsonDeserializer(_, response) {
  if (typeof response.body === 'string') {
    try {
      response.body = JSON.parse(response.body)
    } catch (e) {
      /* Ignore */
    }
  }
}
