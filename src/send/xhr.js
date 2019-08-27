'use strict'

import { parseHeaders } from './parse-headers'
import { isSuccess } from './is-success'

export function sendViaXhr(request) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const requestData = request.data
    const requestHeaders = request.headers

    if (isFormData(requestData)) {
      delete requestHeaders['content-type'] // Let the browser set it
    }

    let xhr = new XMLHttpRequest()
    xhr.open(request.method.toUpperCase(), request.url, true)

    // Set the request timeout in MS
    xhr.timeout = request.timeout

    // Listen for ready state
    xhr.onreadystatechange = function handleLoad() {
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

      // Prepare the response
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
        headers: responseHeaders
      })
      xhr = null
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    xhr.onabort = function handleAbort() {
      if (!xhr) {
        return
      }

      reject(createError('Request aborted', request, 'ECONNABORTED', xhr))
      xhr = null
    }

    // Handle low level network errors
    xhr.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', request, null, xhr))
      xhr = null
    }

    // Add headers to the request
    if ('setRequestHeader' in xhr) {
      forEach(requestHeaders, function setRequestHeader(val, key) {
        if (
          typeof requestData === 'undefined' &&
          key.toLowerCase() === 'content-type'
        ) {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key]
        } else {
          // Otherwise add header to the request
          xhr.setRequestHeader(key, val)
        }
      })
    }

    // Add withCredentials to request if needed
    if (request.withCredentials) {
      xhr.withCredentials = true
    }

    // Add responseType to request if needed
    if (request.responseType) {
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

    // Handle progress if needed
    if (typeof request.onDownloadProgress === 'function') {
      xhr.addEventListener('progress', request.onDownloadProgress)
    }

    // Not all browsers support upload events
    if (typeof request.onUploadProgress === 'function' && xhr.upload) {
      xhr.upload.addEventListener('progress', request.onUploadProgress)
    }

    if (request.abort) {
      request.abort.addEventListener('abort', () => {
        if (!xhr) {
          return
        }

        xhr.abort()
        reject()
        xhr = null
      })
    }

    xhr.send(typeof requestData === 'undefined' ? null : requestData)
  })
}
