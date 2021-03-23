/**
 * @file Originally copied from Axios under MIT license and subsequently significantly changed
 */

import { parseHeaders } from './parse-headers'
import { isSuccess } from './is-success'
import { createError } from './createError'
import { isFormData } from '~/body/body-types'
import { HippityRequest, HippityResponse } from '~/client'

export function xhrTerminator(
  request: HippityRequest
): Promise<HippityResponse> {
  return new Promise(function (resolve, reject) {
    const requestBody = request.body
    const requestHeaders = request.headers

    if (isFormData(requestBody)) {
      delete requestHeaders['content-type'] // Let the browser set it
    }

    let xhr = new XMLHttpRequest()
    xhr.open(request.method.toUpperCase(), request.url as string, true)

    // Listen for ready state
    xhr.onreadystatechange = function () {
      if (!xhr || xhr.readyState !== 4) {
        return
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (
        xhr.status === 0 &&
        !(xhr.responseURL && xhr.responseURL.indexOf('file:') === 0)
      ) {
        return
      }

      const responseHeaders =
        'getAllResponseHeaders' in xhr
          ? parseHeaders(xhr.getAllResponseHeaders())
          : null
      const responseData =
        !request.responseType || request.responseType === 'text'
          ? xhr.responseText
          : xhr.response

      resolve({
        success: isSuccess(request.method || '', xhr.status),
        body: responseData,
        status: xhr.status,
        message: xhr.statusText,
        headers: responseHeaders,
        request: request,
      })
      xhr = null
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    xhr.onabort = function () {
      if (!xhr) {
        return
      }

      reject(createError('Request aborted', { request, xhr }))
      xhr = null
    }

    // Handle low level network errors
    xhr.onerror = function () {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', { request, xhr }))
      xhr = null
    }

    // Add headers to the request
    if ('setRequestHeader' in xhr) {
      for (const key in requestHeaders) {
        if (
          !(
            typeof requestBody === 'undefined' &&
            key.toLowerCase() === 'content-type'
          )
        ) {
          xhr.setRequestHeader(key, requestHeaders[key])
        }
      }
    }

    // Add withCredentials to request if needed
    if (request.withCredentials) {
      xhr.withCredentials = true
    }

    // Add responseType to request if needed
    if (request.responseType) {
      if (request.responseType === 'stream') {
        throw new Error(
          "Cannot use 'stream' response type with the XHR Terminator"
        )
      }

      try {
        xhr.responseType = request.responseType
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (request.responseType !== 'json') {
          throw e
        }
      }
    }

    if (typeof request.onDownloadProgress === 'function') {
      xhr.addEventListener('progress', request.onDownloadProgress)
    }

    // Not all browsers support upload events
    if (typeof request.onUploadProgress === 'function' && xhr.upload) {
      xhr.upload.addEventListener('progress', request.onUploadProgress)
    }

    if (request.onAbort) {
      request.onAbort(() => {
        if (!xhr) {
          return
        }

        xhr.abort()
        reject()
        xhr = null
      })
    }

    xhr.send(
      typeof requestBody === 'undefined' ? null : (requestBody as string)
    )
  })
}
