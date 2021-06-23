import { HippityRequestTransform } from '../transform-middleware'

export function baseUrl(defaultBaseUrl?: string): HippityRequestTransform {
  return (request) => {
    if (isAbsoluteUrl(request.url as string)) {
      return request
    }

    const { baseUrl, ...rest } = request
    rest.url = combineUrls(
      (baseUrl as string) || defaultBaseUrl,
      request.url as string
    )
    return rest
  }
}

function isAbsoluteUrl(url: string): boolean {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

function combineUrls(baseUrl: string, relativeUrl: string): string {
  if (!baseUrl) {
    return relativeUrl
  }

  return relativeUrl
    ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '')
    : baseUrl
}
