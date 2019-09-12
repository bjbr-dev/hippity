import { isNode } from 'browser-or-node'

export function userAgentHeaders(userAgentString) {
  if (!isNode) {
    return {}
  }

  const version = process.env.HIPPITY_VERSION || 'unknown'
  return { 'user-agent': userAgentString || 'hippity/' + version }
}
