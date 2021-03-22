import { HippityMiddleware } from '~/client'
import { transformMiddleware } from '~/transform-middleware'
import { bodySerializer, bodyDeserializer } from './bodySerde'

export function jsonMiddleware(): HippityMiddleware {
  return transformMiddleware([jsonSerializer], [jsonDeserializer])
}

export const jsonSerializer = bodySerializer(
  'application/json;charset=utf-8',
  (body) => JSON.stringify(body)
)

export const jsonDeserializer = bodyDeserializer('application/json', (b) =>
  JSON.parse(b)
)
