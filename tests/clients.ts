import { jsonClient, baseUrl, transformMiddleware } from '~/'

export const client = jsonClient.useLast(
  transformMiddleware([baseUrl('http://localhost:3000/')])
)
