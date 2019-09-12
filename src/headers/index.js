import { transformMiddleware } from '~/transform-middleware'
import { defaultHeaders } from './default-headers'
import { userAgent } from './user-agent'

export * from './basic-auth'
export * from './default-headers'
export * from './user-agent'

export function defaultHeaderMiddleware(headers) {
  return transformMiddleware([defaultHeaders(headers), userAgent()])
}
