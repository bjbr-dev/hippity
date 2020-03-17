export function userAgentHeaders(userAgentString) {
  const version = process.env.HIPPITY_VERSION || 'unknown'
  return { 'user-agent': userAgentString || 'hippity/' + version }
}
