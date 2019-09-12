import { HttpClient } from './http-client'
import { transformMiddleware } from '../transform-middleware'
import { sendMiddleware } from '~/send'
import { jsonMiddleware } from '~/body'
import { urlInMethodProperties } from '~/method'
import { urlResolver } from '~/url'
import { defaultHeaders, userAgentHeaders } from '~/headers'

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
  .use(sendMiddleware)
  .use(userAgentMiddleware())
  .use(resolveUrlInMethodPropertiesMiddleware)

export const jsonClient = httpClient.use(jsonMiddleware).use(
  defaultHeadersMiddleware({
    common: { accept: 'application/json, text/plain, */*' }
  })
)
