import { jsonClient, baseUrl, transformMiddleware } from '../src/'

export const client = jsonClient.useAt(
  -1,
  transformMiddleware([baseUrl('http://localhost:3000/')])
)
