import { isNode } from 'browser-or-node'
import { defaultHeaders } from './default-headers'

export function userAgentHeaders(userAgentString) {
  if (!isNode) {
    return {}
  }

  const version = process.env.HIPPITY_VERSION || 'unknown'
  userAgentString = userAgentString || 'hippity/' + version
  return { 'user-agent': userAgentString }
}

export function userAgent(userAgentString) {
  return defaultHeaders({ common: userAgentHeaders(userAgentString) })
}
