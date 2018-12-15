import Axios, { AxiosInstance } from 'axios'
import { Middleware } from './rest-client'

export function isSuccess(method: string, status: number): boolean {
  if (typeof status !== 'number') {
    return false
  }

  if (status >= 200 && status < 300) {
    return true
  }

  if (method === 'DELETE' && (status === 404 || status === 410)) {
    return true
  }

  return false
}

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

      // `socketPath` defines a UNIX Socket to be used in node.js.
      // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
      // Only either `socketPath` or `proxy` can be specified.
      // If both are specified, `socketPath` is used.
      // null is default
      socketPath,

      // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
      // and https requests, respectively, in node.js. This allows options to be added like
      // `keepAlive` that are not enabled by default.
      httpAgent,
      httpsAgent,

      // 'proxy' defines the hostname and port of the proxy server
      // Use `false` to disable proxies, ignoring environment variables.
      // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
      // supplies credentials.
      // This will set an `Proxy-Authorization` header, overwriting any existing
      // `Proxy-Authorization` custom headers you have set using `headers`.
      proxy,

      // `cancelToken` specifies a cancel token that can be used to cancel the request
      // (see Cancellation section below for details)
      cancelToken
    } = request

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
      socketPath: socketPath,
      httpAgent: httpAgent,
      httpsAgent: httpsAgent,
      proxy: proxy,
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
    })
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
