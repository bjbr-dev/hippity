export function baseUrl(defaultBaseUrl) {
  return request => {
    if (isAbsoluteURL(request.url)) {
      return request
    }

    const { baseUrl, ...rest } = request
    rest.url = combineURLs(baseUrl || defaultBaseUrl, request.url)
    return rest
  }
}

function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

function combineURLs(baseURL, relativeURL) {
  if (!baseURL) {
    return relativeURL
  }

  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}
