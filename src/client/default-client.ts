import {
  HippityRequestHeaders,
  HippityMiddleware,
  HttpClient,
  HippityRequest,
} from './http-client'
import { transformMiddleware } from '../transform-middleware'
import { sendTerminator } from '~/send'
import { jsonMiddleware } from '~/body'
import { urlInMethodProperties } from '~/method'
import { urlResolver, baseUrl, RouteTemplate } from '~/url'
import { defaultHeaders, userAgentHeaders } from '~/headers'
import { timeoutMiddleware } from '~/send/timeout-middleware'
import { isNode } from 'browser-or-node'

export function defaultHeadersMiddleware(headers: {
  [method: string]: HippityRequestHeaders
}): HippityMiddleware {
  return transformMiddleware([defaultHeaders(headers)])
}

export function userAgentMiddleware(
  userAgentString?: string
): HippityMiddleware {
  return defaultHeadersMiddleware({ common: userAgentHeaders(userAgentString) })
}

export function resolveUrlInMethodPropertiesMiddleware(
  defaultBaseUrl?: string
): HippityMiddleware {
  return transformMiddleware([
    urlInMethodProperties,
    urlResolver,
    baseUrl(defaultBaseUrl),
  ])
}

export const httpClient = new HttpClient<
  HippityRequest<string | RouteTemplate>
>([], sendTerminator())
  .use(timeoutMiddleware())
  .if(!isNode, (c) => c.use(userAgentMiddleware()))
  .use(resolveUrlInMethodPropertiesMiddleware())

export const jsonClient = httpClient.use(jsonMiddleware()).use(
  defaultHeadersMiddleware({
    common: { accept: 'application/json, text/plain, */*' },
  })
)
