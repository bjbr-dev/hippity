import { HippityRequestHeaders } from '../client'

export function userAgentHeaders(
  userAgentString?: string
): HippityRequestHeaders {
  const version = process.env.HIPPITY_VERSION || 'unknown'
  return { 'user-agent': userAgentString || 'hippity/' + version }
}
