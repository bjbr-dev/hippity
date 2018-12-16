/**
 * @file Originally copied from Axios under MIT license
 */

export type HeadersCollection = { [key: string]: string | string[] }

var ignoreDuplicateOf = [
  'age',
  'authorization',
  'content-length',
  'content-type',
  'etag',
  'expires',
  'from',
  'host',
  'if-modified-since',
  'if-unmodified-since',
  'last-modified',
  'location',
  'max-forwards',
  'proxy-authorization',
  'referer',
  'retry-after',
  'user-agent'
]

export function parseHeaders(headers: string): HeadersCollection {
  var parsed: HeadersCollection = {}

  if (!headers) {
    return parsed
  }

  for (let line of headers.split('\n')) {
    let i = line.indexOf(':')

    // Normalize headers to be consistent with browsers, and fetch()
    // https://github.com/whatwg/xhr/issues/146
    let key = line
      .substr(0, i)
      .trim()
      .toLowerCase()

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        continue
      }

      // https://tools.ietf.org/html/rfc6265
      // Origin servers SHOULD NOT fold multiple Set-Cookie header fields into
      // a single header field.  The usual mechanism for folding HTTP headers
      // fields (i.e., as defined in [RFC2616]) might change the semantics of
      // the Set-Cookie header field because the %x2C (",") character is used
      // by Set-Cookie in a way that conflicts with such folding.
      let val = line.substr(i + 1).trim()
      if (key === 'set-cookie') {
        parsed[key] = [...((parsed[key] as string[]) || []), val]
      } else {
        let oldVal = parsed[key]
        parsed[key] = oldVal ? oldVal + ', ' + val : val
      }
    }
  }

  return parsed
}
