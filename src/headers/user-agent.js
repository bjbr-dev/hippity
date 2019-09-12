import { isNode } from '~/run-location'
import { hasHeader } from './headers'

/* global GLOBAL_VERSION */

export function userAgent(userAgentString) {
  if (!isNode) {
    return r => r
  }

  return request => {
    if (hasHeader(request.headers, 'user-agent')) {
      return request
    }

    return {
      ...request,
      headers: {
        ...request.headers,
        'user-agent': userAgentString || 'hippity/' + GLOBAL_VERSION
      }
    }
  }
}
