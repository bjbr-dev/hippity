import { HttpClient } from './http-client'
import { transformMiddleware } from '../transform-middleware'
import { sendTerminator } from '~/send'
import { jsonMiddleware } from '~/body'
import { urlInMethodProperties } from '~/method'
import { urlResolver } from '~/url'
import { defaultHeaders, userAgentHeaders } from '~/headers'
import { timeoutMiddleware } from '~/send/timeout-middleware'
import { isNode } from 'browser-or-node'

export function defaultHeadersMiddleware(headers) {
  return transformMiddleware([defaultHeaders(headers)])
}

export function userAgentMiddleware(userAgentString) {
  return defaultHeadersMiddleware({ common: userAgentHeaders(userAgentString) })
}

export function resolveUrlInMethodPropertiesMiddleware() {
  return transformMiddleware([urlInMethodProperties, urlResolver])
}

export const httpClient = new HttpClient()
  .useTerminator(sendTerminator())
  .use(timeoutMiddleware())
  .if(!isNode, c => c.use(userAgentMiddleware()))
  .use(resolveUrlInMethodPropertiesMiddleware())

export const jsonClient = httpClient.use(jsonMiddleware()).use(
  defaultHeadersMiddleware({
    common: { accept: 'application/json, text/plain, */*' }
  })
)
