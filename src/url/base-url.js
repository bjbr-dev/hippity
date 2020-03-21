export function baseUrl(defaultBaseUrl) {
  return request => {
    if (isAbsoluteUrl(request.url)) {
      return request
    }

    const { baseUrl, ...rest } = request
    rest.url = combineUrls(baseUrl || defaultBaseUrl, request.url)
    return rest
  }
}

function isAbsoluteUrl(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

function combineUrls(baseUrl, relativeUrl) {
  if (!baseUrl) {
    return relativeUrl
  }

  return relativeUrl
    ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '')
    : baseUrl
}
