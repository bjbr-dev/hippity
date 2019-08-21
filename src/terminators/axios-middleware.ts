import Axios, { AxiosInstance } from 'axios'
import { Middleware, HttpResponse } from '~/rest-client'
import { isSuccess } from './is-success'

export const axiosMiddleware = function(axios: AxiosInstance): Middleware {
  if (axios === null) {
    throw new Error('Axios must not be null: ')
  }

  if (typeof axios !== 'function') {
    throw new Error('Axios must be a function but was: ' + typeof axios)
  }

  return async function(request) {
    let {
      // The root of the uri, if uri is not absolute
      baseUri,

      // The uri of the resource
      uri,

      // the HTTP method to apply. GET by default.
      method,

      // custom headers to be sent with the request
      headers,

      // The body of the request. Can be one of:
      // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
      // - Browser only: FormData, File, Blob
      // - Node only: Stream, Buffer
      body,

      // specifies the number of milliseconds before the request times out.
      // If the request takes longer than `timeout`, the request will be aborted.
      timeout,

      // `withCredentials` indicates whether or not cross-site Access-Control requests
      // should be made using credentials. False by default
      withCredentials,

      // `responseType` indicates the type of data that the server will respond with
      // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'.
      // 'json' is the default
      responseType,

      // `responseEncoding` indicates encoding to use for decoding responses
      // Note: Ignored for `responseType` of 'stream' or client-side requests
      // 'utf8', // default
      responseEncoding,

      // `maxContentLength` defines the max size of the http response content in bytes allowed
      responseMaxContentLength,

      // `onUploadProgress` allows handling of progress events for uploads
      // function (progressEvent) { /* handle native event */ }
      onUploadProgress,

      // `onDownloadProgress` allows handling of progress events for downloads
      // function (progressEvent) { /* handle native event */ }
      onDownloadProgress,

      // `maxRedirects` defines the maximum number of redirects to follow in node.js.
      // If set to 0, no redirects will be followed.
      maxRedirects,

      cancel
    } = request

    let cancelToken
    if (cancel) {
      let source = Axios.CancelToken.source()

      cancel.onCancel(() => {
        source.cancel()
      })

      cancelToken = source.token
    }

    let axiosRequest = {
      url: uri,
      baseURL: baseUri,
      method: typeof method === 'string' ? method.toLowerCase() : method,
      headers: headers,
      data: body,
      timeout: timeout,
      withCredentials: withCredentials,
      responseType: responseType,
      responseEncoding: responseEncoding,
      onUploadProgress: onUploadProgress,
      onDownloadProgress: onDownloadProgress,
      maxContentLength: responseMaxContentLength,
      maxRedirects: maxRedirects,
      cancelToken: cancelToken,
      validateStatus: null
    }

    let axiosResponse = await axios(removeUndefinedProperties(axiosRequest))

    return removeUndefinedProperties({
      success: isSuccess(request.method || '', axiosResponse.status),
      body: axiosResponse.data,
      status: axiosResponse.status,
      message: axiosResponse.statusText,
      headers: axiosResponse.headers
    } as HttpResponse)
  }
}

function removeUndefinedProperties(obj: { [key: string]: any }): any {
  Object.keys(obj).forEach(
    key => typeof obj[key] === 'undefined' && delete obj[key]
  )
  return obj
}

export const defaultAxiosMiddleware = function(
  options: Object = {}
): Middleware {
  const axiosOptions = {
    // Create fresh objects for all default header scopes
    // Axios creates only one which is shared across SSR requests!
    // https://github.com/mzabriskie/axios/blob/master/lib/defaults.js
    headers: {
      common: {},
      delete: {},
      get: {},
      head: {},
      post: {},
      put: {},
      patch: {}
    },
    ...options
  }

  return axiosMiddleware(Axios.create(axiosOptions))
}
