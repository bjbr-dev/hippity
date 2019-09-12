import { HttpClient } from './http-client'
import { transformMiddleware } from '../transform-middleware'
import { sendMiddleware } from '~/send'
import { jsonMiddleware } from '~/body'
import { urlInMethodProperties } from '~/method'
import { urlResolver } from '~/url'
import { defaultHeaderMiddleware } from '~/headers'

export function resolveUrlInMethodPropertiesMiddleware() {
  return transformMiddleware([urlInMethodProperties, urlResolver])
}

export const httpClient = new HttpClient()
  .use(sendMiddleware)
  .use(resolveUrlInMethodPropertiesMiddleware)

export const jsonClient = httpClient
  .use(jsonMiddleware)
  .use(defaultHeaderMiddleware({ accept: 'application/json, text/plain, */*' }))
